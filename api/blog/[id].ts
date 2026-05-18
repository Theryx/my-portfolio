import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  const sql = getDb();
  const { id } = req.query as { id: string };

  if (req.method === 'PATCH') {
    const b = req.body;
    const now = new Date().toISOString();
    const rows = await sql`
      UPDATE blog_posts SET
        is_hidden = COALESCE(${b.is_hidden ?? null}, is_hidden),
        sort_order = COALESCE(${b.sort_order ?? null}, sort_order),
        updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (req.method === 'PUT') {
    const b = req.body;
    const now = new Date().toISOString();
    const rows = await sql`
      UPDATE blog_posts SET
        title = ${b.title}, excerpt = ${b.excerpt}, content = ${b.content},
        date = ${b.date}, author = ${b.author}, read_time = ${b.read_time},
        tags = ${b.tags}, image = ${b.image}, is_hidden = ${b.is_hidden},
        sort_order = ${b.sort_order}, updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;
    return res.status(204).end();
  }

  return res.status(405).end();
}
