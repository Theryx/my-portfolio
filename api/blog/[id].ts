import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';
import { validateBlogBody } from '../_lib/validate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  try {
    return await handleRequest(req, res);
  } catch (err) {
    console.error(`${req.method} /api/blog/${req.query.id} error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleRequest(req: VercelRequest, res: VercelResponse) {
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
    const b = req.body ?? {};
    const validationError = validateBlogBody(b, { requireId: false });
    if (validationError) return res.status(400).json({ error: validationError });
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
    const profileIds: string[] = Array.isArray(b.profile_ids) ? b.profile_ids : [];
    await sql`DELETE FROM blog_post_profiles WHERE blog_post_id = ${id}`;
    for (const pid of profileIds) {
      await sql`INSERT INTO blog_post_profiles (blog_post_id, profile_id) VALUES (${id}, ${pid})`;
    }
    return res.status(200).json({ ...rows[0], profile_ids: profileIds });
  }

  if (req.method === 'DELETE') {
    // Drop join rows first so there's no chance of an orphaned reference
    // surviving if the FK is added later. ON DELETE CASCADE would do this
    // automatically but no FK is currently declared.
    await sql`DELETE FROM blog_post_profiles WHERE blog_post_id = ${id}`;
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;
    return res.status(204).end();
  }

  return res.status(405).end();
}
