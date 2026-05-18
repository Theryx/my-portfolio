import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth, verifyAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  if (req.method === 'GET') {
    const { profile_id } = req.query as { profile_id?: string };
    const isAdmin = verifyAuth(req);

    if (profile_id && !isAdmin) {
      const rows = await sql`
        SELECT * FROM blog_posts
        WHERE profile_id = ${profile_id} AND is_hidden = false
        ORDER BY sort_order ASC
      `;
      return res.status(200).json(rows);
    }

    if (isAdmin) {
      const rows = profile_id
        ? await sql`SELECT * FROM blog_posts WHERE profile_id = ${profile_id} ORDER BY sort_order ASC`
        : await sql`SELECT * FROM blog_posts ORDER BY sort_order ASC`;
      return res.status(200).json(rows);
    }

    return res.status(400).json({ error: 'profile_id required' });
  }

  if (req.method === 'POST') {
    try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
    const b = req.body;
    const now = new Date().toISOString();
    const rows = await sql`
      INSERT INTO blog_posts (
        id, profile_id, title, excerpt, content, date, author, read_time, tags,
        image, is_hidden, sort_order, created_at, updated_at
      ) VALUES (
        ${b.id}, ${b.profile_id}, ${b.title}, ${b.excerpt}, ${b.content}, ${b.date},
        ${b.author}, ${b.read_time}, ${b.tags}, ${b.image},
        ${b.is_hidden ?? false}, ${b.sort_order ?? 0}, ${now}, ${now}
      )
      ON CONFLICT (id) DO UPDATE SET
        profile_id = EXCLUDED.profile_id, title = EXCLUDED.title, excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content, date = EXCLUDED.date, author = EXCLUDED.author,
        read_time = EXCLUDED.read_time, tags = EXCLUDED.tags, image = EXCLUDED.image,
        is_hidden = EXCLUDED.is_hidden, sort_order = EXCLUDED.sort_order, updated_at = ${now}
      RETURNING *
    `;
    return res.status(200).json(rows[0]);
  }

  return res.status(405).end();
}
