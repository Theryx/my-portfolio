import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';
import { validateProjectBody } from '../_lib/validate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  try {
    return await handleRequest(req, res);
  } catch (err) {
    console.error(`${req.method} /api/projects/${req.query.id} error:`, err);
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
      UPDATE projects SET
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
    const validationError = validateProjectBody(b, { requireId: false });
    if (validationError) return res.status(400).json({ error: validationError });
    const now = new Date().toISOString();
    const rows = await sql`
      UPDATE projects SET
        tag = ${b.tag}, title = ${b.title}, tagline = ${b.tagline}, image = ${b.image},
        description = ${b.description}, impact = ${b.impact}, site = ${b.site},
        role = ${b.role}, period = ${b.period}, location = ${b.location},
        responsibilities = ${b.responsibilities}, challenge = ${b.challenge},
        challenge_text = ${b.challenge_text}, solution = ${b.solution},
        solution_text = ${b.solution_text}, result = ${b.result},
        result_text = ${b.result_text}, is_hidden = ${b.is_hidden},
        sort_order = ${b.sort_order}, content = ${b.content ?? ''},
        updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return res.status(204).end();
  }

  return res.status(405).end();
}
