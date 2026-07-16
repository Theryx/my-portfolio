import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Many-to-many join tables for blogs and projects. Each row of blog_posts /
// projects can be linked to one or more profiles via these tables. Profiles
// are deleted in api/profiles/[id].ts and only the join rows are dropped —
// the content itself is preserved.
//
// These CREATE TABLE statements are idempotent. The schema is bootstrapped
// once per cold start so every serverless instance self-heals without adding
// a per-request round-trip.

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS blog_post_profiles (
    blog_post_id text NOT NULL,
    profile_id   text NOT NULL,
    PRIMARY KEY (blog_post_id, profile_id)
  );

  CREATE TABLE IF NOT EXISTS project_profiles (
    project_id text NOT NULL,
    profile_id text NOT NULL,
    PRIMARY KEY (project_id, profile_id)
  );
`;

let schemaReady: Promise<void> | null = null;

export function getDb(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const sql = neon(url);
  if (!schemaReady) {
    schemaReady = sql`${SCHEMA_SQL}`.then(() => undefined);
  }
  return sql;
}

// Exposed so the migration endpoint can await the schema bootstrap before
// touching the join tables.
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    const sql = neon(url);
    schemaReady = sql`${SCHEMA_SQL}`.then(() => undefined);
  }
  return schemaReady;
}
