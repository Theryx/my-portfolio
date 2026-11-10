// Ndouken was the product designer on Shomi, not a co-founder of Kody
// (confirmed 2026-11-10). Rewords the two Kody articles and the MTN override.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();

const fix = (t) =>
  (t ?? '')
    .replace(/Co-founding Kody:/g, 'Building Kody:')
    .replace(/My co-founder and I won/g, 'My teammate and I won')
    .replace(/the loneliest part of founding work/g, 'the loneliest part of early-stage work');

for (const r of await sql`SELECT id, title, content FROM warehouse_entries WHERE id IN ('article:pm_kody', 'article:pm_kody_5k_to_mvp')`) {
  await sql`UPDATE warehouse_entries SET title = ${fix(r.title)}, content = ${fix(r.content)}, updated_at = ${now} WHERE id = ${r.id}`;
  console.log('entry', r.id, '->', fix(r.title));
}
for (const r of await sql`SELECT company_id, entry_id, override_content FROM company_entries WHERE entry_id IN ('article:pm_kody', 'article:pm_kody_5k_to_mvp') AND override_content IS NOT NULL`) {
  await sql`UPDATE company_entries SET override_content = ${fix(r.override_content)} WHERE company_id = ${r.company_id} AND entry_id = ${r.entry_id}`;
  console.log('override', r.company_id, r.entry_id);
}
const left = await sql`SELECT count(*)::int AS n FROM warehouse_entries WHERE id LIKE 'article:pm_kody%' AND (title ~* 'co-?found' OR content ~* 'co-?found')`;
const leftO = await sql`SELECT count(*)::int AS n FROM company_entries WHERE entry_id LIKE 'article:pm_kody%' AND override_content ~* 'co-?found'`;
console.log('remaining co-founder mentions:', left[0].n, leftO[0].n);
