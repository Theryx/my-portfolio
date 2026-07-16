// One-shot migration endpoint that converts the legacy `profile_id` columns on
// blog_posts and projects into the new `blog_post_profiles` /
// `project_profiles` join tables.
//
// Usage:
//   POST /api/admin/migrate-multi-profile
//   Headers: Cookie: admin_token=... (admin auth required)
//
// Behaviour:
//   1. Creates the join tables if they don't exist yet (CREATE TABLE IF NOT EXISTS).
//   2. Adds a profile_ids text[] column to blog_posts / projects if missing.
//   3. Backfills profile_ids from the legacy profile_id column for every row
//      that has it but no profile_ids yet.
//   4. Populates the join tables from profile_ids (one row per unnest).
//   5. Drops the legacy profile_id columns.
//
// The endpoint is gated by MIGRATIONS_ENABLED — set it to "true" in Vercel
// only while running the migration, then unset. This prevents accidental
// re-runs in production. Every step is idempotent.
//
// Note on Neon's HTTP SQL driver: it doesn't accept multi-statement strings
// or PL/pgSQL DO blocks through the tagged-template helper, so each step
// is a single statement. CREATE TABLE IF NOT EXISTS, ALTER TABLE ... IF
// [NOT] EXISTS, and INSERT ... ON CONFLICT are all single statements.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (process.env.MIGRATIONS_ENABLED !== 'true') {
    return res.status(403).json({ error: 'Migrations are not enabled' });
  }
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  const sql = getDb();
  const log: string[] = [];

  try {
    // 1. Make sure the join tables exist. Neon's HTTP driver handles these
    //    single statements fine when invoked individually.
    await sql`CREATE TABLE IF NOT EXISTS blog_post_profiles (blog_post_id text NOT NULL, profile_id text NOT NULL, PRIMARY KEY (blog_post_id, profile_id))`;
    await sql`CREATE TABLE IF NOT EXISTS project_profiles (project_id text NOT NULL, profile_id text NOT NULL, PRIMARY KEY (project_id, profile_id))`;
    log.push('Join tables ensured');

    // 2. Add the profile_ids text[] column to the content tables if missing.
    await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS profile_ids text[]`;
    await sql`ALTER TABLE projects   ADD COLUMN IF NOT EXISTS profile_ids text[]`;
    log.push('profile_ids columns ensured');

    // 3. Backfill profile_ids from the legacy profile_id column. We do it
    //    row-by-row with a single UPDATE that uses a subquery guarded by the
    //    column's existence (information_schema is queried separately so each
    //    statement is a single SQL string — Neon's HTTP driver requirement).
    const blogHasLegacy = await sql`SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'profile_id') AS has_col`;
    if (blogHasLegacy[0]?.has_col) {
      await sql`UPDATE blog_posts SET profile_ids = ARRAY[profile_id] WHERE profile_ids IS NULL AND profile_id IS NOT NULL`;
      log.push('blog_posts.profile_ids backfilled from profile_id');
    }
    const projectHasLegacy = await sql`SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'profile_id') AS has_col`;
    if (projectHasLegacy[0]?.has_col) {
      await sql`UPDATE projects SET profile_ids = ARRAY[profile_id] WHERE profile_ids IS NULL AND profile_id IS NOT NULL`;
      log.push('projects.profile_ids backfilled from profile_id');
    }

    // 4. Populate the join tables from the now-populated profile_ids arrays.
    //    INSERT ... SELECT with unnest is one statement. ON CONFLICT DO NOTHING
    //    makes it safe to re-run.
    await sql`INSERT INTO blog_post_profiles (blog_post_id, profile_id) SELECT bp.id, unnest(bp.profile_ids) FROM blog_posts bp WHERE bp.profile_ids IS NOT NULL ON CONFLICT DO NOTHING`;
    await sql`INSERT INTO project_profiles (project_id, profile_id) SELECT p.id, unnest(p.profile_ids) FROM projects p WHERE p.profile_ids IS NOT NULL ON CONFLICT DO NOTHING`;
    log.push('Join tables populated from profile_ids');

    // 5. Drop the legacy columns. Safe to re-run — IF EXISTS makes it a no-op.
    await sql`ALTER TABLE blog_posts DROP COLUMN IF EXISTS profile_id`;
    await sql`ALTER TABLE projects   DROP COLUMN IF EXISTS profile_id`;
    log.push('Legacy profile_id columns dropped');

    // Counts for verification.
    const bp = await sql`SELECT COUNT(*)::int AS n FROM blog_post_profiles`;
    const pp = await sql`SELECT COUNT(*)::int AS n FROM project_profiles`;
    const blogN = bp[0]?.n ?? 0;
    const projectN = pp[0]?.n ?? 0;

    return res.status(200).json({
      ok: true,
      blog_post_profiles: blogN,
      project_profiles: projectN,
      log,
    });
  } catch (err) {
    console.error('Migration failed:', err);
    return res.status(500).json({
      error: 'Migration failed',
      detail: err instanceof Error ? err.message : String(err),
      log,
    });
  }
}
