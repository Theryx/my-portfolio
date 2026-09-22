import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth, verifyAuth } from '../_lib/auth.js';
import { validateWarehouseEntryBody } from '../_lib/validate.js';

const LINK_SELECT = `
  COALESCE((SELECT string_agg(x.company_id, ',' ORDER BY x.company_id) FROM company_entries x WHERE x.entry_id = w.id), '') AS company_ids_csv,
  COALESCE((SELECT string_agg(ea.asset_id, ',' ORDER BY ea.asset_id) FROM entry_assets ea WHERE ea.entry_id = w.id), '') AS asset_ids_csv
`;

function toIds(v: unknown): string[] {
  return typeof v === 'string' && v.length ? v.split(',') : [];
}

function mapRow(row: Record<string, unknown>): Record<string, unknown> {
  const { company_ids_csv, asset_ids_csv, ...rest } = row;
  return { ...rest, company_ids: toIds(company_ids_csv), asset_ids: toIds(asset_ids_csv) };
}

async function fetchLinked(sql: ReturnType<typeof getDb>, id: string) {
  const rows = await sql.query(
    `SELECT w.*, ${LINK_SELECT} FROM warehouse_entries w WHERE w.id = $1`,
    [id],
  );
  return rows[0] ? mapRow(rows[0] as Record<string, unknown>) : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    const { id } = req.query as { id: string };

    if (req.method === 'GET') {
      const row = await fetchLinked(sql, id);
      if (!row) return res.status(404).json({ error: 'Not found' });
      if (row.is_hidden && !verifyAuth(req)) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(row);
    }

    if (req.method === 'PATCH') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      const b = req.body ?? {};
      const now = new Date().toISOString();
      const rows = await sql`
        UPDATE warehouse_entries SET
          is_hidden = COALESCE(${b.is_hidden ?? null}, is_hidden),
          sort_order = COALESCE(${b.sort_order ?? null}, sort_order),
          type = COALESCE(${b.type ?? null}, type),
          title = COALESCE(${b.title ?? null}, title),
          content = COALESCE(${b.content ?? null}, content),
          metadata = COALESCE(${b.metadata ? JSON.stringify(b.metadata) : null}::jsonb, metadata),
          tags = COALESCE(${b.tags ?? null}, tags),
          updated_at = ${now}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(await fetchLinked(sql, id));
    }

    if (req.method === 'PUT') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      const b = req.body ?? {};
      const validationError = validateWarehouseEntryBody(b);
      if (validationError) return res.status(400).json({ error: validationError });
      const now = new Date().toISOString();
      const rows = await sql`
        UPDATE warehouse_entries SET
          type = ${b.type}, title = ${b.title}, content = ${b.content ?? ''},
          metadata = ${JSON.stringify(b.metadata ?? {})}, tags = ${b.tags ?? []},
          is_hidden = ${b.is_hidden ?? false}, sort_order = ${b.sort_order ?? 0},
          updated_at = ${now}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });

      if (Array.isArray(b.company_ids)) {
        await sql`DELETE FROM company_entries WHERE entry_id = ${id}`;
        let order = 0;
        for (const cid of b.company_ids as string[]) {
          await sql`INSERT INTO company_entries (company_id, entry_id, sort_order, is_visible)
                    VALUES (${cid}, ${id}, ${order}, true) ON CONFLICT DO NOTHING`;
          order += 1;
        }
      }
      if (Array.isArray(b.asset_ids)) {
        await sql`DELETE FROM entry_assets WHERE entry_id = ${id}`;
        for (const aid of b.asset_ids as string[]) {
          await sql`INSERT INTO entry_assets (entry_id, asset_id) VALUES (${id}, ${aid})
                    ON CONFLICT DO NOTHING`;
        }
      }
      return res.status(200).json(await fetchLinked(sql, id));
    }

    if (req.method === 'DELETE') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      await sql`DELETE FROM warehouse_entries WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).end();
  } catch (err) {
    console.error(`${req.method} /api/warehouse/${req.query.id} error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
