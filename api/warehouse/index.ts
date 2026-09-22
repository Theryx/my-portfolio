import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth, verifyAuth } from '../_lib/auth.js';
import { validateWarehouseEntryBody, isId } from '../_lib/validate.js';

// The warehouse is the single source of truth for everything "about me":
// bios, experience, skills, projects, articles, notes, assets, etc.
// Each entry can be linked to any number of companies (company_entries) with
// per-company overrides.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();

    if (req.method === 'GET') {
      return await handleGet(req, res, sql);
    }

    if (req.method === 'POST') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      return await handleUpsert(req, res, sql);
    }

    return res.status(405).end();
  } catch (err) {
    console.error(`${req.method} /api/warehouse error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function mapEntry(row: Record<string, unknown>): Record<string, unknown> {
  const { company_ids_csv, asset_ids_csv, ...rest } = row;
  const toIds = (v: unknown): string[] =>
    typeof v === 'string' && v.length > 0 ? v.split(',') : [];
  return { ...rest, company_ids: toIds(company_ids_csv), asset_ids: toIds(asset_ids_csv) };
}

const LINK_SUBSELECTS = `
  COALESCE((SELECT string_agg(x.company_id, ',' ORDER BY x.company_id) FROM company_entries x WHERE x.entry_id = w.id), '') AS company_ids_csv,
  COALESCE((SELECT string_agg(ea.asset_id, ',' ORDER BY ea.asset_id) FROM entry_assets ea WHERE ea.entry_id = w.id), '') AS asset_ids_csv,
  COALESCE((
    SELECT jsonb_agg(jsonb_build_object(
      'company_id', x.company_id,
      'sort_order', x.sort_order,
      'is_visible', x.is_visible,
      'override_content', x.override_content,
      'override_metadata', x.override_metadata
    ) ORDER BY x.sort_order, x.company_id)
    FROM company_entries x WHERE x.entry_id = w.id
  ), '[]'::jsonb) AS company_links
`;

async function handleGet(
  req: VercelRequest,
  res: VercelResponse,
  sql: ReturnType<typeof getDb>,
) {
  const { company_id, type, search, limit, include_hidden } =
    req.query as Record<string, string | undefined>;
  const isAdmin = verifyAuth(req);

  if (!company_id && !isAdmin) return res.status(400).json({ error: 'company_id required' });

  const showHidden = isAdmin && String(include_hidden) === 'true';
  const params: unknown[] = [];

  if (company_id) {
    let where = 'WHERE ce.company_id = $1';
    params.push(company_id);
    if (!showHidden) where += ' AND ce.is_visible = true AND w.is_hidden = false';
    if (type) { params.push(type); where += ` AND w.type = $${params.length}`; }
    if (search) {
      params.push(`%${search}%`);
      where += ` AND (w.title ILIKE $${params.length} OR w.content ILIKE $${params.length})`;
    }
    let tail = 'ORDER BY ce.sort_order ASC, w.sort_order ASC, w.created_at ASC';
    const lim = Number(limit);
    if (Number.isFinite(lim) && lim > 0) { params.push(Math.min(lim, 500)); tail += ` LIMIT $${params.length}`; }

    const rows = await sql.query(
      `SELECT w.id, w.type, w.title, w.tags, w.is_hidden, w.sort_order, w.created_at, w.updated_at,
              COALESCE(ce.override_content, w.content) AS content,
              (w.metadata || COALESCE(ce.override_metadata, '{}'::jsonb)) AS metadata,
              ce.sort_order AS company_sort_order,
              ${LINK_SUBSELECTS}
       FROM warehouse_entries w
       INNER JOIN company_entries ce ON ce.entry_id = w.id
       ${where}
       ${tail}`,
      params,
    );
    return res.status(200).json(rows.map(mapEntry));
  }

  // Admin, no company filter — full warehouse listing.
  const conds: string[] = [];
  if (type) { params.push(type); conds.push(`w.type = $${params.length}`); }
  if (search) {
    params.push(`%${search}%`);
    conds.push(`(w.title ILIKE $${params.length} OR w.content ILIKE $${params.length})`);
  }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  let tail = 'ORDER BY w.sort_order ASC, w.created_at ASC';
  const lim = Number(limit);
  if (Number.isFinite(lim) && lim > 0) { params.push(Math.min(lim, 500)); tail += ` LIMIT $${params.length}`; }

  const rows = await sql.query(
    `SELECT w.*, ${LINK_SUBSELECTS}
     FROM warehouse_entries w
     ${where}
     ${tail}`,
    params,
  );
  return res.status(200).json(rows.map(mapEntry));
}

async function handleUpsert(
  req: VercelRequest,
  res: VercelResponse,
  sql: ReturnType<typeof getDb>,
) {
  const b = req.body ?? {};
  const validationError = validateWarehouseEntryBody(b);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!isId(b.id)) return res.status(400).json({ error: 'Invalid id' });

  const now = new Date().toISOString();
  const rows = await sql`
    INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
    VALUES (
      ${b.id}, ${b.type}, ${b.title}, ${b.content ?? ''},
      ${JSON.stringify(b.metadata ?? {})}, ${b.tags ?? []},
      ${b.is_hidden ?? false}, ${b.sort_order ?? 0}, ${now}, ${now}
    )
    ON CONFLICT (id) DO UPDATE SET
      type = EXCLUDED.type, title = EXCLUDED.title, content = EXCLUDED.content,
      metadata = EXCLUDED.metadata, tags = EXCLUDED.tags,
      is_hidden = EXCLUDED.is_hidden, sort_order = EXCLUDED.sort_order,
      updated_at = ${now}
    RETURNING *
  `;
  const entry = rows[0] as Record<string, unknown>;

  // Company links. Two payload shapes:
  //  - company_links: full objects (sort_order, is_visible, overrides) → upsert
  //    each and drop links no longer listed.
  //  - company_ids:   plain id list → reconcile without touching existing
  //    overrides / ordering (the old delete-and-reinsert wiped both).
  if (Array.isArray(b.company_links)) {
    const links = b.company_links as Array<Record<string, unknown>>;
    const keep = links.map((l) => String(l.company_id));
    await sql.query(
      `DELETE FROM company_entries WHERE entry_id = $1 AND company_id <> ALL($2::text[])`,
      [b.id, keep],
    );
    for (const l of links) {
      await sql`
        INSERT INTO company_entries (company_id, entry_id, sort_order, override_content, override_metadata, is_visible)
        VALUES (
          ${l.company_id}, ${b.id}, ${l.sort_order ?? 0},
          ${l.override_content ?? null},
          ${l.override_metadata ? JSON.stringify(l.override_metadata) : null}::jsonb,
          ${l.is_visible ?? true}
        )
        ON CONFLICT (company_id, entry_id) DO UPDATE SET
          sort_order = EXCLUDED.sort_order,
          override_content = EXCLUDED.override_content,
          override_metadata = EXCLUDED.override_metadata,
          is_visible = EXCLUDED.is_visible
      `;
    }
  } else if (Array.isArray(b.company_ids)) {
    await sql.query(
      `DELETE FROM company_entries WHERE entry_id = $1 AND company_id <> ALL($2::text[])`,
      [b.id, b.company_ids],
    );
    for (const cid of b.company_ids as string[]) {
      await sql`INSERT INTO company_entries (company_id, entry_id, sort_order, is_visible)
                VALUES (${cid}, ${b.id}, 0, true)
                ON CONFLICT (company_id, entry_id) DO NOTHING`;
    }
  }

  if (Array.isArray(b.asset_ids)) {
    await sql`DELETE FROM entry_assets WHERE entry_id = ${b.id}`;
    for (const aid of b.asset_ids as string[]) {
      await sql`INSERT INTO entry_assets (entry_id, asset_id) VALUES (${b.id}, ${aid})
                ON CONFLICT (entry_id, asset_id) DO NOTHING`;
    }
  }

  // Re-read with links so callers get the canonical stored shape.
  const fresh = await sql.query(
    `SELECT w.*, ${LINK_SUBSELECTS} FROM warehouse_entries w WHERE w.id = $1`,
    [b.id],
  );
  return res.status(200).json(mapEntry((fresh[0] ?? entry) as Record<string, unknown>));
}
