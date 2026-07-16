// One-shot migration endpoint that converts the legacy `profile_id` columns on
// blog_posts and projects into the new `blog_post_profiles` /
// `project_profiles` join tables.
//
// Usage:
//   POST /api/admin/migrate-multi-profile
//   Headers: Cookie: admin_token=... (admin auth required)
//
// Behaviour:
//   1. Adds `profile_ids text[]` to blog_posts / projects if missing.
//   2. Backfills profile_ids from profile_id for every row.
//   3. Populates the join tables.
//   4. Drops the legacy profile_id columns.
//
// The endpoint is gated by MIGRATIONS_ENABLED — set it to "true" in Vercel
// only while running the migration, then unset. This prevents accidental
// re-runs in production.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (process.env.MIGRATIONS_ENABLED !== 'true') {
    return res.status(403).json({ error: 'Migrations are not enabled' });
  }
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  try {
    await ensureSchema();
    const sql = getDb();

    // 1. Add profile_ids columns if they don't exist yet.
    await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS profile_ids text[]`;
    await sql`ALTER TABLE projects   ADD COLUMN IF NOT EXISTS profile_ids text[]`;

    // 2. Backfill from the legacy profile_id column, where it still exists.
    //    If the column was already dropped in a previous run, this is a no-op.
    await sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'blog_posts' AND column_name = 'profile_id'
        ) THEN
          UPDATE blog_posts
          SET profile_ids = ARRAY[profile_id]
          WHERE profile_ids IS NULL AND profile_id IS NOT NULL;
        END IF;
      END $$;
    `;
    await sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'projects' AND column_name = 'profile_id'
        ) THEN
          UPDATE projects
          SET profile_ids = ARRAY[profile_id]
          WHERE profile_ids IS NULL AND profile_id IS NOT NULL;
        END IF;
      END $$;
    `;

    // 3. Populate join tables from the now-populated profile_ids arrays.
    await sql`
      INSERT INTO blog_post_profiles (blog_post_id, profile_id)
      SELECT bp.id, unnest(bp.profile_ids)
      FROM blog_posts bp
      WHERE bp.profile_ids IS NOT NULL
      ON CONFLICT DO NOTHING
    `;
    await sql`
      INSERT INTO project_profiles (project_id, profile_id)
      SELECT p.id, unnest(p.profile_ids)
      FROM projects p
      WHERE p.profile_ids IS NOT NULL
      ON CONFLICT DO NOTHING
    `;

    // 4. Drop the legacy columns if they still exist.
    await sql`ALTER TABLE blog_posts DROP COLUMN IF EXISTS profile_id`;
    await sql`ALTER TABLE projects   DROP COLUMN IF EXISTS profile_id`;

    // Counts for verification.
    const [bp] = await sql`SELECT COUNT(*)::int AS n FROM blog_post_profiles`;
    const [pp] = await sql`SELECT COUNT(*)::int AS n FROM project_profiles`;

    return res.status(200).json({
      ok: true,
      blog_post_profiles: bp?.n ?? 0,
      project_profiles: pp?.n ?? 0,
    });
  } catch (err) {
    console.error('Migration failed:', err);
    return res.status(500).json({ error: 'Migration failed', detail: err instanceof Error ? err.message : 'unknown' });
  }
}
