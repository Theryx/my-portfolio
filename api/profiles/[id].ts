import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    const { id } = req.query as { id: string };

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM profiles WHERE id = ${id}`;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
    try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
    const body = req.body;
    const now = new Date().toISOString();
    const rows = await sql`
      UPDATE profiles SET
        name = ${body.name},
        is_active = ${body.is_active},
        bio = ${body.bio},
        tagline = ${body.tagline},
        hero_title = ${body.hero_title},
        hero_subtitle = ${body.hero_subtitle},
        philosophy_title = ${body.philosophy_title},
        philosophy_text = ${body.philosophy_text},
        badges = ${body.badges},
        social_links = ${JSON.stringify(body.social_links)},
        updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
    return res.status(200).json(rows[0]);
  }

  return res.status(405).end();
  } catch (err) {
    console.error(`GET/PUT /api/profiles/${req.query.id} error:`, err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
  }
}
