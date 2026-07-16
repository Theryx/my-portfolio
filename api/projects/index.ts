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
        SELECT p.*, COALESCE(
          (
            SELECT string_agg(pp.profile_id, ',' ORDER BY pp.profile_id)
            FROM project_profiles pp
            WHERE pp.project_id = p.id
          ),
          ''
        ) AS profile_ids_csv
        FROM projects p
        INNER JOIN project_profiles pp ON pp.project_id = p.id
        WHERE pp.profile_id = ${profile_id} AND p.is_hidden = false
        ORDER BY p.sort_order ASC
      `;
      return res.status(200).json(rows.map(rowToProject));
    }

    if (isAdmin) {
      const rows = profile_id
        ? await sql`
            SELECT p.*, COALESCE(
              (
                SELECT string_agg(pp.profile_id, ',' ORDER BY pp.profile_id)
                FROM project_profiles pp
                WHERE pp.project_id = p.id
              ),
              ''
            ) AS profile_ids_csv
            FROM projects p
            INNER JOIN project_profiles pp ON pp.project_id = p.id
            WHERE pp.profile_id = ${profile_id}
            ORDER BY p.sort_order ASC
          `
        : await sql`
            SELECT p.*, COALESCE(
              (
                SELECT string_agg(pp.profile_id, ',' ORDER BY pp.profile_id)
                FROM project_profiles pp
                WHERE pp.project_id = p.id
              ),
              ''
            ) AS profile_ids_csv
            FROM projects p
            ORDER BY p.sort_order ASC
          `;
      return res.status(200).json(rows.map(rowToProject));
    }

    return res.status(400).json({ error: 'profile_id required' });
  }

  if (req.method === 'POST') {
    try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }
    const b = req.body ?? {};
    const validationError = validateProjectBody(b);
    if (validationError) return res.status(400).json({ error: validationError });
    const now = new Date().toISOString();
    const profileIds: string[] = b.profile_ids;
    const rows = await sql`
      INSERT INTO projects (
        id, tag, title, tagline, image, description, impact, site, role, period,
        location, responsibilities, challenge, challenge_text, solution, solution_text,
        result, result_text, is_hidden, sort_order, content, created_at, updated_at
      ) VALUES (
        ${b.id}, ${b.tag}, ${b.title}, ${b.tagline}, ${b.image},
        ${b.description}, ${b.impact}, ${b.site}, ${b.role}, ${b.period}, ${b.location},
        ${b.responsibilities}, ${b.challenge}, ${b.challenge_text}, ${b.solution},
        ${b.solution_text}, ${b.result}, ${b.result_text}, ${b.is_hidden ?? false},
        ${b.sort_order ?? 0}, ${b.content ?? ''}, ${now}, ${now}
      )
      ON CONFLICT (id) DO UPDATE SET
        tag = EXCLUDED.tag, title = EXCLUDED.title,
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
    const project = rows[0];
    await sql`DELETE FROM project_profiles WHERE project_id = ${project.id}`;
    for (const pid of profileIds) {
      await sql`INSERT INTO project_profiles (project_id, profile_id) VALUES (${project.id}, ${pid})`;
    }
    return res.status(200).json({
      ...rowToProject(project),
      profile_ids: profileIds,
    });
  }

  return res.status(405).end();
}

function rowToProject(row: Record<string, unknown>): Record<string, unknown> {
  const csv = row.profile_ids_csv;
  const profileIds = typeof csv === 'string' && csv.length > 0
    ? csv.split(',')
    : Array.isArray(row.profile_ids) ? row.profile_ids as string[] : [];
  const { profile_ids_csv: _csv, ...rest } = row;
  return { ...rest, profile_ids: profileIds };
}
