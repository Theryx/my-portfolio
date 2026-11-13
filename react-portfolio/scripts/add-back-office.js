// Ndouken shared two PaySika back-office screens he designed on 2026-11-13: the identity
// check (KYC) backlog and review screen, and campaign access codes. Screens use mock data
// and a specimen passport; they are bundled with the sunking site in
// src/assets/img/paysika/BackOffice/.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const LINE = 'Designed back-office tools for the team, including the identity check (KYC) backlog and review screen, and campaign access codes';
const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:paysika'`;
const md = row.metadata;
if (!md.highlights.includes(LINE)) md.highlights.push(LINE);
md.notes = [
  ...(md.notes ?? []).filter((n) => !n.startsWith('Back-office screens')),
  'Back-office screens (mock data): src/assets/img/paysika/BackOffice/ (bundled with the sunking site).',
];
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${new Date().toISOString()} WHERE id = 'experience:paysika'`;
console.log('ok');
