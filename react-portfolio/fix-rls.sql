-- RLS policies for portfolio database
-- Run this in the Supabase SQL editor.

-- ── Drop old policies ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public read projects" ON projects;
DROP POLICY IF EXISTS "Allow public read blog_posts" ON blog_posts;
DROP POLICY IF EXISTS " profiles_public_read" ON profiles;
DROP POLICY IF EXISTS " projects_public_read" ON projects;
DROP POLICY IF EXISTS " blog_posts_public_read" ON blog_posts;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "blog_posts_public_read" ON blog_posts;
DROP POLICY IF EXISTS "admin_write_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_write_projects" ON projects;
DROP POLICY IF EXISTS "admin_write_blog_posts" ON blog_posts;

-- ── Public read (anon key — no auth required) ─────────────────────────────
-- Only active/visible records are exposed to unauthenticated callers.
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "projects_public_read" ON projects
  FOR SELECT USING (is_hidden = false);

CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT USING (is_hidden = false);

-- ── Authenticated writes (requires Supabase Auth session) ─────────────────
-- Replace <YOUR_ADMIN_UUID> with the UUID from Supabase Auth > Users for your account.
-- This restricts all writes to exactly one admin user instead of any authenticated user.
CREATE POLICY "admin_write_profiles" ON profiles
  FOR ALL USING (auth.uid() = '<YOUR_ADMIN_UUID>'::uuid)
  WITH CHECK (auth.uid() = '<YOUR_ADMIN_UUID>'::uuid);

CREATE POLICY "admin_write_projects" ON projects
  FOR ALL USING (auth.uid() = '<YOUR_ADMIN_UUID>'::uuid)
  WITH CHECK (auth.uid() = '<YOUR_ADMIN_UUID>'::uuid);

CREATE POLICY "admin_write_blog_posts" ON blog_posts
  FOR ALL USING (auth.uid() = '<YOUR_ADMIN_UUID>'::uuid)
  WITH CHECK (auth.uid() = '<YOUR_ADMIN_UUID>'::uuid);
