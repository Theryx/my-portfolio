import { Pool } from '@neondatabase/serverless';

const SUPABASE_URL = 'https://peheavvvckblmlqelbtn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlaGVhdnZ2Y2tibG1scWVsYnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODU3NzEsImV4cCI6MjA5MjE2MTc3MX0.4sFP0RWm5FFHnZl5ZA094SW8971qJ5hIG1reJqXkf_4';

async function fetchAll(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  // --- Profiles ---
  const profiles = await fetchAll('profiles');
  console.log(`Fetched ${profiles.length} profiles from Supabase`);
  for (const p of profiles) {
    await client.query(
      `INSERT INTO profiles (id, name, is_active, bio, tagline, hero_title, hero_subtitle,
        philosophy_title, philosophy_text, badges, social_links, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET
         name=$2, is_active=$3, bio=$4, tagline=$5, hero_title=$6, hero_subtitle=$7,
         philosophy_title=$8, philosophy_text=$9, badges=$10, social_links=$11, updated_at=$13`,
      [p.id, p.name, p.is_active, p.bio, p.tagline, p.hero_title, p.hero_subtitle,
       p.philosophy_title, p.philosophy_text, p.badges, JSON.stringify(p.social_links ?? {}),
       p.created_at, p.updated_at]
    );
    console.log(`  ✓ profile: ${p.id}`);
  }

  // --- Projects ---
  const projects = await fetchAll('projects');
  console.log(`\nFetched ${projects.length} projects from Supabase`);
  for (const p of projects) {
    await client.query(
      `INSERT INTO projects (id, profile_id, tag, title, tagline, image, description, impact,
        site, role, period, location, responsibilities, challenge, challenge_text, solution,
        solution_text, result, result_text, is_hidden, sort_order, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
       ON CONFLICT (id) DO UPDATE SET
         profile_id=$2, tag=$3, title=$4, tagline=$5, image=$6, description=$7, impact=$8,
         site=$9, role=$10, period=$11, location=$12, responsibilities=$13, challenge=$14,
         challenge_text=$15, solution=$16, solution_text=$17, result=$18, result_text=$19,
         is_hidden=$20, sort_order=$21, updated_at=$23`,
      [p.id, p.profile_id, p.tag, p.title, p.tagline, p.image, p.description, p.impact,
       p.site, p.role, p.period, p.location, p.responsibilities, p.challenge, p.challenge_text,
       p.solution, p.solution_text, p.result, p.result_text, p.is_hidden, p.sort_order,
       p.created_at, p.updated_at]
    );
    console.log(`  ✓ project: ${p.title}`);
  }

  // --- Blog Posts ---
  const posts = await fetchAll('blog_posts');
  console.log(`\nFetched ${posts.length} blog posts from Supabase`);
  for (const p of posts) {
    await client.query(
      `INSERT INTO blog_posts (id, profile_id, title, excerpt, content, date, author,
        read_time, tags, image, is_hidden, sort_order, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         profile_id=$2, title=$3, excerpt=$4, content=$5, date=$6, author=$7,
         read_time=$8, tags=$9, image=$10, is_hidden=$11, sort_order=$12, updated_at=$14`,
      [p.id, p.profile_id, p.title, p.excerpt, p.content, p.date, p.author,
       p.read_time, p.tags, p.image, p.is_hidden, p.sort_order, p.created_at, p.updated_at]
    );
    console.log(`  ✓ blog post: ${p.title}`);
  }

  console.log('\nImport complete.');
} finally {
  client.release();
  await pool.end();
}
