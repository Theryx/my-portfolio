import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth, verifyAuth } from '../_lib/auth.js';
import { validateBlogBody } from '../_lib/validate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return await handleRequest(req, res);
  } catch (err) {
    console.error(`${req.method} /api/blog error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleRequest(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  if (req.method === 'GET') {
    const { profile_id } = req.query as { profile_id?: string };
    const isAdmin = verifyAuth(req);

    if (profile_id) {
      // Join through blog_post_profiles so a post linked to multiple profiles
      // appears in each of their public lists. Admin path returns every row,
      // joined with its profile ids as a comma-separated string for display.
      const rows = await sql`
        SELECT bp.*, COALESCE(
          (
            SELECT string_agg(bpp.profile_id, ',' ORDER BY bpp.profile_id)
            FROM blog_post_profiles bpp
            WHERE bpp.blog_post_id = bp.id
          ),
          ''
        ) AS profile_ids_csv
        FROM blog_posts bp
        INNER JOIN blog_post_profiles bpp ON bpp.blog_post_id = bp.id
        WHERE bpp.profile_id = ${profile_id} AND bp.is_hidden = false
        ORDER BY bp.sort_order ASC
      `;
      const posts = rows.map(rowToBlogPost);
      return res.status(200).json(posts);
    }

    if (isAdmin) {
      const rows = await sql`
        SELECT bp.*, COALESCE(
          (
            SELECT string_agg(bpp.profile_id, ',' ORDER BY bpp.profile_id)
            FROM blog_post_profiles bpp
            WHERE bpp.blog_post_id = bp.id
          ),
          ''
        ) AS profile_ids_csv
        FROM blog_posts bp
        ORDER BY bp.sort_order ASC
      `;
      return res.status(200).json(rows.map(rowToBlogPost));
    }

    return res.status(400).json({ error: 'profile_id required' });
  }

  if (req.method === 'POST') {
    try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
    const b = req.body ?? {};
    const validationError = validateBlogBody(b);
    if (validationError) return res.status(400).json({ error: validationError });
    const now = new Date().toISOString();
    const profileIds: string[] = b.profile_ids;
    const rows = await sql`
      INSERT INTO blog_posts (
        id, title, excerpt, content, date, author, read_time, tags,
        image, is_hidden, sort_order, created_at, updated_at
      ) VALUES (
        ${b.id}, ${b.title}, ${b.excerpt}, ${b.content}, ${b.date},
        ${b.author}, ${b.read_time}, ${b.tags}, ${b.image},
        ${b.is_hidden ?? false}, ${b.sort_order ?? 0}, ${now}, ${now}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title, excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content, date = EXCLUDED.date, author = EXCLUDED.author,
        read_time = EXCLUDED.read_time, tags = EXCLUDED.tags, image = EXCLUDED.image,
        is_hidden = EXCLUDED.is_hidden, sort_order = EXCLUDED.sort_order, updated_at = ${now}
      RETURNING *
    `;
    const post = rows[0];
    // Replace the join rows so removed profiles stop showing the post.
    await sql`DELETE FROM blog_post_profiles WHERE blog_post_id = ${post.id}`;
    for (const pid of profileIds) {
      await sql`INSERT INTO blog_post_profiles (blog_post_id, profile_id) VALUES (${post.id}, ${pid})`;
    }
    return res.status(200).json({
      ...rowToBlogPost(post),
      profile_ids: profileIds,
    });
  }

  return res.status(405).end();
}

// Shared between the collection handler above and blog/[id].ts. Coerces the
// helper column produced by the join query into a real string[]; leaves rows
// that don't carry it (e.g. single-row updates) untouched.
function rowToBlogPost(row: Record<string, unknown>): Record<string, unknown> {
  const csv = row.profile_ids_csv;
  const profileIds = typeof csv === 'string' && csv.length > 0
    ? csv.split(',')
    : Array.isArray(row.profile_ids) ? row.profile_ids as string[] : [];
  const { profile_ids_csv: _csv, ...rest } = row;
  return { ...rest, profile_ids: profileIds };
}
