import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Adds job-application tracking to companies: one jsonb column holding
// { kind, stage, outcome, fit_score, applied_at, notes }. Additive and
// idempotent, safe to run more than once.
//
// It also classifies the existing rows once, so Studio can split them into
// Applications and Main site profiles: a company with a target role, a job
// description or a job link is an application, everything else is a persona.
// Rows that already have a kind are left alone.
//
//   node scripts/migrate-applications.mjs            # dry run, prints the plan
//   node scripts/migrate-applications.mjs --apply    # writes the changes

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);
const apply = process.argv.includes('--apply');

const cols = await sql`
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'companies' AND column_name = 'application'`;
const hasColumn = cols.length > 0;

const companies = hasColumn
  ? await sql`SELECT id, name, role, job_description, job_url, application FROM companies ORDER BY created_at`
  : await sql`SELECT id, name, role, job_description, job_url, NULL::jsonb AS application FROM companies ORDER BY created_at`;

const isApplication = (c) => Boolean((c.role ?? '').trim() || (c.job_description ?? '').trim() || (c.job_url ?? '').trim());
const plan = companies
  .filter((c) => !c.application?.kind)
  .map((c) => ({
    id: c.id,
    name: c.name,
    application: isApplication(c) ? { kind: 'application', stage: 'building' } : { kind: 'persona' },
  }));

console.log(hasColumn ? 'Column companies.application already exists.' : 'Will add column companies.application (jsonb).');
console.table(plan.map((p) => ({ id: p.id, name: p.name, kind: p.application.kind, stage: p.application.stage ?? '' })));

if (!apply) {
  console.log('Dry run. Re-run with --apply to write these changes.');
  process.exit(0);
}

await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS application jsonb NOT NULL DEFAULT '{}'::jsonb`;
for (const p of plan) {
  await sql`
    UPDATE companies SET application = application || ${JSON.stringify(p.application)}::jsonb
    WHERE id = ${p.id}`;
}
console.log(`Done: column ready, ${plan.length} companies classified.`);
