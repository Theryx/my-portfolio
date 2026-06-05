import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    const { id } = req.query as { id: string };

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM profiles WHERE id = ${id}`;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      const body = req.body;
      const profileId = body.id || id;
      const now = new Date().toISOString();
      const rows = await sql`
        INSERT INTO profiles (
          id, name, is_active, bio, tagline, hero_title, hero_subtitle,
          philosophy_title, philosophy_text, badges, social_links, created_at, updated_at
        ) VALUES (
          ${profileId}, ${body.name}, ${body.is_active ?? true}, ${body.bio},
          ${body.tagline}, ${body.hero_title}, ${body.hero_subtitle},
          ${body.philosophy_title}, ${body.philosophy_text}, ${body.badges ?? []},
          ${JSON.stringify(body.social_links ?? {})}, ${now}, ${now}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          is_active = EXCLUDED.is_active,
          bio = EXCLUDED.bio,
          tagline = EXCLUDED.tagline,
          hero_title = EXCLUDED.hero_title,
          hero_subtitle = EXCLUDED.hero_subtitle,
          philosophy_title = EXCLUDED.philosophy_title,
          philosophy_text = EXCLUDED.philosophy_text,
          badges = EXCLUDED.badges,
          social_links = EXCLUDED.social_links,
          updated_at = ${now}
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
