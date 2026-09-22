import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';
import { validateCompanyBody } from '../_lib/validate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = getDb();
    const { id } = req.query as { id: string };

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM companies WHERE id = ${id}`;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      const b = req.body ?? {};
      const validationError = validateCompanyBody(b);
      if (validationError) return res.status(400).json({ error: validationError });
      const companyId = b.id || id;
      const now = new Date().toISOString();
      const rows = await sql`
        INSERT INTO companies (
          id, name, slug, is_active, role, job_description, job_url, status, layout,
          theme_config, seo, tagline, hero_title, hero_subtitle, philosophy_title,
          philosophy_text, intro_expanded_text, badges, social_links, about_content,
          created_at, updated_at
        ) VALUES (
          ${companyId}, ${b.name}, ${b.slug || companyId}, ${b.is_active ?? true}, ${b.role ?? null},
          ${b.job_description ?? null}, ${b.job_url ?? null}, ${b.status ?? 'published'},
          ${b.layout ?? 'default'}, ${JSON.stringify(b.theme_config ?? {})}, ${JSON.stringify(b.seo ?? {})},
          ${b.tagline ?? null}, ${b.hero_title ?? null}, ${b.hero_subtitle ?? null},
          ${b.philosophy_title ?? null}, ${b.philosophy_text ?? null}, ${b.intro_expanded_text ?? null},
          ${b.badges ?? []}, ${JSON.stringify(b.social_links ?? {})}, ${JSON.stringify(b.about_content ?? {})},
          ${now}, ${now}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, slug = EXCLUDED.slug, is_active = EXCLUDED.is_active,
          role = EXCLUDED.role, job_description = EXCLUDED.job_description, job_url = EXCLUDED.job_url,
          status = EXCLUDED.status, layout = EXCLUDED.layout, theme_config = EXCLUDED.theme_config,
          seo = EXCLUDED.seo, tagline = EXCLUDED.tagline, hero_title = EXCLUDED.hero_title,
          hero_subtitle = EXCLUDED.hero_subtitle, philosophy_title = EXCLUDED.philosophy_title,
          philosophy_text = EXCLUDED.philosophy_text, intro_expanded_text = EXCLUDED.intro_expanded_text,
          badges = EXCLUDED.badges, social_links = EXCLUDED.social_links, about_content = EXCLUDED.about_content,
          updated_at = ${now}
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
      // company_entries rows cascade. Warehouse entries themselves are preserved.
      await sql`DELETE FROM companies WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).end();
  } catch (err) {
    console.error(`${req.method} /api/companies/${req.query.id} error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
