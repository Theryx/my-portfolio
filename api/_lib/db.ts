import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Schema bootstrap. Idempotent CREATE TABLE statements run once per cold start
// so every serverless instance self-heals without a per-request round-trip.
//
// Two eras live here:
//  - Legacy persona model: profile↔content join tables (blog_post_profiles,
//    project_profiles). Kept so the old endpoints keep working.
//  - Warehouse model: companies + the warehouse (entries, assets, links).

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

  CREATE TABLE IF NOT EXISTS companies (
    id                  text PRIMARY KEY,
    name                text NOT NULL,
    slug                text UNIQUE NOT NULL,
    is_active           boolean DEFAULT true,
    role                text,
    job_description     text,
    job_url             text,
    status              text DEFAULT 'published',
    layout              text DEFAULT 'default',
    theme_config        jsonb DEFAULT '{}'::jsonb,
    seo                 jsonb DEFAULT '{}'::jsonb,
    tagline             text,
    hero_title          text,
    hero_subtitle       text,
    philosophy_title    text,
    philosophy_text     text,
    intro_expanded_text text,
    badges              text[] DEFAULT '{}',
    social_links        jsonb DEFAULT '{}'::jsonb,
    about_content       jsonb DEFAULT '{}'::jsonb,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS warehouse_entries (
    id         text PRIMARY KEY,
    type       text NOT NULL,
    title      text NOT NULL,
    content    text,
    metadata   jsonb DEFAULT '{}'::jsonb,
    tags       text[] DEFAULT '{}',
    is_hidden  boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS assets (
    id          text PRIMARY KEY,
    filename    text NOT NULL,
    url         text NOT NULL,
    mime_type   text,
    size        integer,
    description text,
    tags        text[] DEFAULT '{}',
    created_at  timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS entry_assets (
    entry_id text NOT NULL REFERENCES warehouse_entries(id) ON DELETE CASCADE,
    asset_id text NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, asset_id)
  );

  CREATE TABLE IF NOT EXISTS company_entries (
    company_id        text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    entry_id          text NOT NULL REFERENCES warehouse_entries(id) ON DELETE CASCADE,
    sort_order        integer DEFAULT 0,
    override_content  text,
    override_metadata jsonb,
    is_visible        boolean DEFAULT true,
    PRIMARY KEY (company_id, entry_id)
  );

  CREATE INDEX IF NOT EXISTS idx_warehouse_entries_type ON warehouse_entries(type);
  CREATE INDEX IF NOT EXISTS idx_company_entries_company ON company_entries(company_id);
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

// Exposed so migration endpoints can await the schema bootstrap before
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
