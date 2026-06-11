import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth, verifyAuth } from '../_lib/auth.js';
import { validateProjectBody } from '../_lib/validate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return await handleRequest(req, res);
  } catch (err) {
    console.error(`${req.method} /api/projects error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleRequest(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  if (req.method === 'GET') {
    const { profile_id } = req.query as { profile_id?: string };
    const isAdmin = verifyAuth(req);

    if (profile_id && !isAdmin) {
      const rows = await sql`
        SELECT * FROM projects
        WHERE profile_id = ${profile_id} AND is_hidden = false
        ORDER BY sort_order ASC
      `;
      return res.status(200).json(rows);
    }

    if (isAdmin) {
      const rows = profile_id
        ? await sql`SELECT * FROM projects WHERE profile_id = ${profile_id} ORDER BY sort_order ASC`
        : await sql`SELECT * FROM projects ORDER BY sort_order ASC`;
      return res.status(200).json(rows);
    }

    return res.status(400).json({ error: 'profile_id required' });
  }

  if (req.method === 'POST') {
    try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
    const b = req.body ?? {};
    const validationError = validateProjectBody(b);
    if (validationError) return res.status(400).json({ error: validationError });
    const now = new Date().toISOString();
    const rows = await sql`
      INSERT INTO projects (
        id, profile_id, tag, title, tagline, image, description, impact, site, role, period,
        location, responsibilities, challenge, challenge_text, solution, solution_text,
        result, result_text, is_hidden, sort_order, content, created_at, updated_at
      ) VALUES (
        ${b.id}, ${b.profile_id}, ${b.tag}, ${b.title}, ${b.tagline}, ${b.image},
        ${b.description}, ${b.impact}, ${b.site}, ${b.role}, ${b.period}, ${b.location},
        ${b.responsibilities}, ${b.challenge}, ${b.challenge_text}, ${b.solution},
        ${b.solution_text}, ${b.result}, ${b.result_text}, ${b.is_hidden ?? false},
        ${b.sort_order ?? 0}, ${b.content ?? ''}, ${now}, ${now}
      )
      ON CONFLICT (id) DO UPDATE SET
        profile_id = EXCLUDED.profile_id, tag = EXCLUDED.tag, title = EXCLUDED.title,
        tagline = EXCLUDED.tagline, image = EXCLUDED.image, description = EXCLUDED.description,
        impact = EXCLUDED.impact, site = EXCLUDED.site, role = EXCLUDED.role,
        period = EXCLUDED.period, location = EXCLUDED.location,
        responsibilities = EXCLUDED.responsibilities, challenge = EXCLUDED.challenge,
        challenge_text = EXCLUDED.challenge_text, solution = EXCLUDED.solution,
        solution_text = EXCLUDED.solution_text, result = EXCLUDED.result,
        result_text = EXCLUDED.result_text, is_hidden = EXCLUDED.is_hidden,
        sort_order = EXCLUDED.sort_order, content = EXCLUDED.content, updated_at = ${now}
      RETURNING *
    `;
    return res.status(200).json(rows[0]);
  }

  return res.status(405).end();
}
