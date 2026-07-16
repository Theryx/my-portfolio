import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';
import { validateProfileBody, isId } from '../_lib/validate.js';

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
      const body = req.body ?? {};
      const validationError = validateProfileBody(body);
      if (validationError) return res.status(400).json({ error: validationError });
      const profileId = body.id || id;
      if (!isId(profileId)) return res.status(400).json({ error: 'Invalid id' });
      const now = new Date().toISOString();
      const rows = await sql`
        INSERT INTO profiles (
          id, name, is_active, bio, tagline, hero_title, hero_subtitle,
          philosophy_title, philosophy_text, intro_expanded_text, badges, social_links, about_content, created_at, updated_at
        ) VALUES (
          ${profileId}, ${body.name}, ${body.is_active ?? true}, ${body.bio},
          ${body.tagline}, ${body.hero_title}, ${body.hero_subtitle},
          ${body.philosophy_title}, ${body.philosophy_text}, ${body.intro_expanded_text}, ${body.badges ?? []},
          ${JSON.stringify(body.social_links ?? {})}, ${JSON.stringify(body.about_content ?? {})}, ${now}, ${now}
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
          intro_expanded_text = EXCLUDED.intro_expanded_text,
          badges = EXCLUDED.badges,
          social_links = EXCLUDED.social_links,
          about_content = EXCLUDED.about_content,
          updated_at = ${now}
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      // Many-to-many: only drop the join rows. The blog posts and projects
      // themselves stay (they may still belong to other profiles).
      await sql`DELETE FROM blog_post_profiles WHERE profile_id = ${id}`;
      await sql`DELETE FROM project_profiles WHERE profile_id = ${id}`;
      await sql`DELETE FROM profiles WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).end();
  } catch (err) {
    console.error(`GET/PUT /api/profiles/${req.query.id} error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
