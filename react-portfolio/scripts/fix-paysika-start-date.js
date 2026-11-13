// Ndouken confirmed on 2026-11-13 that he started at PaySika in Dec 2021 (he left in Aug 2026).
// The usability session photo is from the June 2022 testing period.
// Align every PaySika period on that, and turn "nearly four years" into "nearly five years"
// (Dec 2021 to Aug 2026 is four years and eight months).
// Not changed: bio:brand-designer says he moved to Douala in 2022 when he joined PaySika;
// that needs his answer, not a guess.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();
const PERIOD = 'Dec 2021 - Aug 2026';

const fixYears = (v) =>
  typeof v === 'string' ? v.replace(/nearly four years/g, 'nearly five years').replace(/Nearly four years/g, 'Nearly five years')
    : Array.isArray(v) ? v.map(fixYears)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fixYears(x)]))
    : v;

const projects = [
  'project:paysika_default', 'project:paysika_fintech', 'project:paysika_brand-designer',
  'project:paysika-ds_design-engineer', 'project:paysika-growth_digital-marketing', 'project:paysika_project-manager',
];
for (const id of projects) {
  const [row] = await sql`SELECT content, metadata FROM warehouse_entries WHERE id = ${id}`;
  const md = fixYears(row.metadata);
  md.period = PERIOD;
  await sql`UPDATE warehouse_entries SET content = ${fixYears(row.content)}, metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = ${id}`;
  console.log(id, md.period);
}

{
  const [row] = await sql`SELECT content, metadata FROM warehouse_entries WHERE id = 'bio:product-design'`;
  await sql`UPDATE warehouse_entries SET content = ${fixYears(row.content)}, metadata = ${JSON.stringify(fixYears(row.metadata))}::jsonb, updated_at = ${now} WHERE id = 'bio:product-design'`;
  console.log('bio:product-design years ok');
}

{
  const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:paysika'`;
  const md = row.metadata;
  md.period = PERIOD;
  md.notes = (md.notes ?? []).map((n) =>
    n.startsWith('Usability session photo')
      ? 'Usability session photo (participant consented to it being shown), taken during usability testing in June 2022: src/assets/img/paysika/Research/paysika-usability-session.webp.'
      : n,
  );
  await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = 'experience:paysika'`;
  console.log('experience:paysika', md.period);
}
