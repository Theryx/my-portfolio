// Facts Ndouken confirmed on 2026-11-13 about a PaySika usability session photo:
// the session covered the whole journey (discovery, onboarding, KYC, card creation),
// the sheet on the table is the test script, participants signed a consent form before
// entering, and the participant agreed to the photo being shown. He dates it to 2021,
// which conflicts with the PaySika start date on record, so the year is kept unconfirmed.
// The image is bundled with the sunking site: src/assets/img/paysika/Research/paysika-usability-session.webp
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();

const LINE = 'Ran moderated usability sessions on the whole journey, from discovery to onboarding, KYC and card creation, with a test script; participants signed a consent form before the session';
const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:paysika'`;
const md = row.metadata;
if (!md.highlights.includes(LINE)) md.highlights.push(LINE);
md.notes = [
  ...(md.notes ?? []).filter((n) => !n.startsWith('Usability session photo')),
  'Usability session photo (participant consented to it being shown): src/assets/img/paysika/Research/paysika-usability-session.webp. Ndouken dates it 2021, which conflicts with the Nov 2022 start; confirm the PaySika start date.',
];
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = 'experience:paysika'`;

const SK = 'skill:user-research-and-usability-testing';
const [s] = await sql`SELECT content FROM warehouse_entries WHERE id = ${SK}`;
if (!s.content.includes('moderated usability sessions')) {
  await sql`UPDATE warehouse_entries SET content = ${s.content.trimEnd() + '\nPaySika: moderated usability sessions on the whole journey (discovery, onboarding, KYC, card creation), run with a test script, with consent forms signed before each session.'}, updated_at = ${now} WHERE id = ${SK}`;
}
console.log('ok');
