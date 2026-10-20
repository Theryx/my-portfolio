import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Read-only snapshot of the warehouse: every entry grouped by type (bio,
// experience, skill, education, project, research, testimonial, note, ...),
// the companies that exist, which entries each company links, and the asset
// library. Used by the tailored-portfolio skill to judge fit and pick projects.
//
//   node scripts/export-warehouse.js [out.json]
//
// Writes to stdout when no output path is given.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

const entries = await sql`
  SELECT id, type, title, tags, is_hidden, content, metadata
  FROM warehouse_entries
  ORDER BY type, sort_order, created_at`;

const companies = await sql`
  SELECT id, slug, name, role, layout, tagline, badges, created_at
  FROM companies
  ORDER BY created_at`;

const links = await sql`
  SELECT company_id, entry_id, sort_order, is_visible
  FROM company_entries
  ORDER BY company_id, sort_order`;

const assets = await sql`
  SELECT id, filename, url, description, tags
  FROM assets
  ORDER BY id`;

const byType = {};
for (const e of entries) (byType[e.type] ??= []).push(e);

const snapshot = {
  exported_at: new Date().toISOString(),
  entries: byType,
  companies: companies.map((c) => ({
    ...c,
    linked_entries: links.filter((l) => l.company_id === c.id).map((l) => l.entry_id),
  })),
  assets,
};

const json = JSON.stringify(snapshot, null, 2);
const out = process.argv[2];
if (out) {
  fs.writeFileSync(out, json);
  const counts = Object.entries(byType).map(([t, list]) => `${list.length} ${t}`).join(', ');
  console.log(
    `Wrote ${out}: ${counts || 'no entries'}; ` +
      `${snapshot.companies.length} companies, ${snapshot.assets.length} assets.`,
  );
} else {
  process.stdout.write(json);
}
