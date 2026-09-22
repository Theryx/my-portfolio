// One-off (idempotent) migration: consolidate profiles / projects / blog_posts
// into the new "warehouse + companies" data layer.
//
// Creates 5 tables (companies, warehouse_entries, assets, entry_assets,
// company_entries) and copies existing content into them. The legacy tables
// (profiles, projects, blog_posts, *_profiles) are left untouched so the live
// site keeps working — this only ADDS the new data layer.
//
// Safe to re-run: DDL uses IF NOT EXISTS and every INSERT uses DO NOTHING, so
// any manual edits made in the new tables are never overwritten.
//
// Uses the Neon HTTP driver with bulk inserts (fast, ~a few round-trips).
//
// Usage (from react-portfolio/):
//   node scripts/migrate-warehouse.mjs

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── Resolve DATABASE_URL (env var, else root .env.local) ─────────────────── */

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const candidates = [
    path.join(__dirname, '../../.env.local'),
    path.join(__dirname, '../.env.local'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const m = fs.readFileSync(p, 'utf8').match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (m) {
        console.log(`Using DATABASE_URL from ${p}`);
        return m[1];
      }
    }
  }
  throw new Error('DATABASE_URL not found in env or .env.local');
}

const sql = neon(loadDatabaseUrl());

/* ── Table definitions ────────────────────────────────────────────────────── */

const DDL = `
CREATE TABLE IF NOT EXISTS companies (
  id                  text PRIMARY KEY,
  name                text NOT NULL,
  slug                text UNIQUE NOT NULL,
  is_active           boolean DEFAULT true,
  role                text,
  job_description     text,
  job_url             text,
  status              text DEFAULT 'published',
  layout              text DEFAULT 'default',
  theme_config        jsonb DEFAULT '{}'::jsonb,
  seo                 jsonb DEFAULT '{}'::jsonb,
  tagline             text,
  hero_title          text,
  hero_subtitle       text,
  philosophy_title    text,
  philosophy_text     text,
  intro_expanded_text text,
  badges              text[] DEFAULT '{}',
  social_links        jsonb DEFAULT '{}'::jsonb,
  about_content       jsonb DEFAULT '{}'::jsonb,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS warehouse_entries (
  id         text PRIMARY KEY,
  type       text NOT NULL,
  title      text NOT NULL,
  content    text,
  metadata   jsonb DEFAULT '{}'::jsonb,
  tags       text[] DEFAULT '{}',
  is_hidden  boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assets (
  id          text PRIMARY KEY,
  filename    text NOT NULL,
  url         text NOT NULL,
  mime_type   text,
  size        integer,
  description text,
  tags        text[] DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entry_assets (
  entry_id text NOT NULL REFERENCES warehouse_entries(id) ON DELETE CASCADE,
  asset_id text NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, asset_id)
);

CREATE TABLE IF NOT EXISTS company_entries (
  company_id        text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  entry_id          text NOT NULL REFERENCES warehouse_entries(id) ON DELETE CASCADE,
  sort_order        integer DEFAULT 0,
  override_content  text,
  override_metadata jsonb,
  is_visible        boolean DEFAULT true,
  PRIMARY KEY (company_id, entry_id)
);

CREATE INDEX IF NOT EXISTS idx_warehouse_entries_type ON warehouse_entries(type);
CREATE INDEX IF NOT EXISTS idx_company_entries_company ON company_entries(company_id);
`;

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const json = (v) => (v === undefined || v === null ? null : JSON.stringify(v));
const arr = (v) => (Array.isArray(v) ? v : []);

// Bulk insert with numbered placeholders, chunked to stay well under the
// Postgres 65535-parameter limit. ON CONFLICT DO NOTHING keeps it idempotent
// and preserves any manual edits already in the table.
async function bulkInsert(table, columns, rows, chunk = 200) {
  let count = 0;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const values = [];
    const tuples = slice.map((row, r) => {
      const ph = row.map((_, c) => `$${r * columns.length + c + 1}`);
      values.push(...row);
      return `(${ph.join(',')})`;
    });
    const text =
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${tuples.join(', ')} ` +
      `ON CONFLICT DO NOTHING`;
    await sql.query(text, values);
    count += slice.length;
  }
  return count;
}

function assetIdFor(url) {
  return `asset:${crypto.createHash('sha1').update(url).digest('hex').slice(0, 14)}`;
}

function filenameFromUrl(url) {
  const clean = url.split('?')[0].split('#')[0];
  const seg = clean.split('/').filter(Boolean).pop();
  return seg || clean || 'asset';
}

function mimeFromUrl(url) {
  const ext = (url.split('?')[0].split('.').pop() || '').toLowerCase();
  const map = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', jfif: 'image/jpeg',
    webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
    avif: 'image/avif', pdf: 'application/pdf',
  };
  return map[ext] || null;
}

// Pull image strings out of an arbitrary value (image fields, gallery blocks…).
function collectImageStrings(value, out) {
  if (!value) return;
  if (typeof value === 'string') {
    if (value.trim()) out.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectImageStrings(item, out);
    return;
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value)) collectImageStrings(v, out);
  }
}

/* ── Main ─────────────────────────────────────────────────────────────────── */

async function main() {
  const started = Date.now();

  /* 1. DDL */
  console.log('\n[1/6] Creating warehouse tables...');
  for (const stmt of DDL.split(';').map((s) => s.trim()).filter(Boolean)) {
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 60);
    try {
      await sql.query(stmt);
      console.log(`  ✓ ${preview}`);
    } catch (err) {
      console.log(`  ~ ${preview} (${err.message})`);
    }
  }

  /* Load source rows */
  const profiles = await sql`SELECT * FROM profiles ORDER BY id`;
  const projects = await sql`SELECT * FROM projects ORDER BY id`;
  const posts = await sql`SELECT * FROM blog_posts ORDER BY id`;

  const companyRows = [];
  const entryRows = [];
  const assetMap = new Map(); // assetId -> row
  const linkMap = new Map();  // `${entryId}|${assetId}` -> row

  const registerAsset = (rawUrl) => {
    const url = typeof rawUrl === 'string' ? rawUrl.trim() : '';
    if (!url) return null;
    const id = assetIdFor(url);
    if (!assetMap.has(id)) {
      assetMap.set(id, [id, filenameFromUrl(url), url, mimeFromUrl(url)]);
    }
    return id;
  };
  const linkAsset = (entryId, assetId) => {
    if (!entryId || !assetId) return;
    linkMap.set(`${entryId}|${assetId}`, [entryId, assetId]);
  };

  /* 2. profiles -> companies + bio entries */
  console.log('\n[2/6] Building profiles -> companies + bio entries...');
  for (const p of profiles) {
    companyRows.push([
      p.id, p.name, p.id, p.is_active ?? true,
      p.tagline, p.hero_title, p.hero_subtitle,
      p.philosophy_title, p.philosophy_text, p.intro_expanded_text,
      arr(p.badges), json(p.social_links ?? {}), json(p.about_content ?? {}),
      'published', 'default',
    ]);

    const bioId = `bio:${p.id}`;
    entryRows.push([
      bioId, 'bio', `${p.name} — Bio`, p.bio ?? '',
      json({
        tagline: p.tagline ?? null,
        hero_title: p.hero_title ?? null,
        hero_subtitle: p.hero_subtitle ?? null,
        philosophy_title: p.philosophy_title ?? null,
        philosophy_text: p.philosophy_text ?? null,
        intro_expanded_text: p.intro_expanded_text ?? null,
        about_content: p.about_content ?? {},
        social_links: p.social_links ?? {},
        source_profile_id: p.id,
      }),
      [`source:${p.id}`, 'bio'], false, 0,
    ]);

    const about = p.about_content ?? {};
    const bioImages = [];
    collectImageStrings(about.speaking_images, bioImages);
    collectImageStrings(about.speaking_image, bioImages);
    for (const url of bioImages) linkAsset(bioId, registerAsset(url));
  }
  console.log(`  ✓ ${profiles.length} profiles`);

  /* 3. projects -> project entries */
  console.log('\n[3/6] Building projects -> warehouse entries...');
  for (const pr of projects) {
    const entryId = `project:${pr.id}`;
    entryRows.push([
      entryId, 'project', pr.title, pr.content ?? '',
      json({
        tag: pr.tag ?? null,
        tagline: pr.tagline ?? null,
        image: pr.image ?? null,
        description: pr.description ?? null,
        impact: pr.impact ?? null,
        site: pr.site ?? null,
        role: pr.role ?? null,
        period: pr.period ?? null,
        location: pr.location ?? null,
        responsibilities: pr.responsibilities ?? [],
        challenge: pr.challenge ?? null,
        challenge_text: pr.challenge_text ?? null,
        solution: pr.solution ?? null,
        solution_text: pr.solution_text ?? null,
        result: pr.result ?? null,
        result_text: pr.result_text ?? null,
        content_blocks: pr.content_blocks ?? null,
        source_project_id: pr.id,
      }),
      pr.tag ? [pr.tag] : [], pr.is_hidden ?? false, pr.sort_order ?? 0,
    ]);

    const imgs = [];
    collectImageStrings(pr.image, imgs);
    collectImageStrings(pr.content_blocks, imgs);
    for (const url of imgs) linkAsset(entryId, registerAsset(url));
  }
  console.log(`  ✓ ${projects.length} projects`);

  /* 4. blog_posts -> article entries */
  console.log('\n[4/6] Building blog posts -> article entries...');
  for (const bp of posts) {
    const entryId = `article:${bp.id}`;
    entryRows.push([
      entryId, 'article', bp.title, bp.content ?? '',
      json({
        excerpt: bp.excerpt ?? null,
        date: bp.date ?? null,
        author: bp.author ?? null,
        read_time: bp.read_time ?? null,
        image: bp.image ?? null,
        source_blog_id: bp.id,
      }),
      arr(bp.tags), bp.is_hidden ?? false, bp.sort_order ?? 0,
    ]);

    const imgs = [];
    collectImageStrings(bp.image, imgs);
    for (const url of imgs) linkAsset(entryId, registerAsset(url));
  }
  console.log(`  ✓ ${posts.length} posts`);

  /* 5. Bulk writes */
  console.log('\n[5/6] Writing to the warehouse (bulk)...');
  const cCount = await bulkInsert(
    'companies',
    ['id', 'name', 'slug', 'is_active', 'tagline', 'hero_title', 'hero_subtitle',
     'philosophy_title', 'philosophy_text', 'intro_expanded_text', 'badges',
     'social_links', 'about_content', 'status', 'layout'],
    companyRows,
  );
  const eCount = await bulkInsert(
    'warehouse_entries',
    ['id', 'type', 'title', 'content', 'metadata', 'tags', 'is_hidden', 'sort_order'],
    entryRows,
  );
  const aCount = await bulkInsert(
    'assets',
    ['id', 'filename', 'url', 'mime_type'],
    [...assetMap.values()],
  );
  const eaCount = await bulkInsert(
    'entry_assets',
    ['entry_id', 'asset_id'],
    [...linkMap.values()],
  );
  console.log(`  ✓ companies: ${cCount}, entries: ${eCount}, assets: ${aCount}, entry_assets: ${eaCount}`);

  /* 5b. Join legacy links -> company_entries */
  try {
    const r1 = await sql.query(
      `INSERT INTO company_entries (company_id, entry_id, sort_order, is_visible)
       SELECT pp.profile_id, 'project:' || pp.project_id, COALESCE(p.sort_order, 0), true
       FROM project_profiles pp
       LEFT JOIN projects p ON p.id = pp.project_id
       ON CONFLICT DO NOTHING`,
    );
    const r2 = await sql.query(
      `INSERT INTO company_entries (company_id, entry_id, sort_order, is_visible)
       SELECT bpp.profile_id, 'article:' || bpp.blog_post_id, COALESCE(bp.sort_order, 0), true
       FROM blog_post_profiles bpp
       LEFT JOIN blog_posts bp ON bp.id = bpp.blog_post_id
       ON CONFLICT DO NOTHING`,
    );
    const r3 = await sql.query(
      `INSERT INTO company_entries (company_id, entry_id, sort_order, is_visible)
       SELECT c.id, 'bio:' || c.id, 0, true
       FROM companies c
       ON CONFLICT DO NOTHING`,
    );
    console.log(`  ✓ company_entries: projects=${r1.length}, articles=${r2.length}, bios=${r3.length}`);
  } catch (err) {
    console.log(`  ~ company_entries links skipped (${err.message})`);
  }

  /* 6. Report */
  console.log('\n[6/6] Verification counts...');
  const counts = await sql`
    SELECT
      (SELECT count(*) FROM companies)         AS companies,
      (SELECT count(*) FROM warehouse_entries) AS entries,
      (SELECT count(*) FROM assets)            AS assets,
      (SELECT count(*) FROM entry_assets)      AS entry_assets,
      (SELECT count(*) FROM company_entries)   AS company_entries
  `;
  console.log(' ', counts[0]);
  const byType = await sql`SELECT type, count(*)::int AS n FROM warehouse_entries GROUP BY type ORDER BY type`;
  console.log('  entries by type:', byType.map((r) => `${r.type}=${r.n}`).join(', '));

  console.log(`\nMigration complete in ${((Date.now() - started) / 1000).toFixed(1)}s. Legacy tables were NOT modified.`);
}

main().catch((err) => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
