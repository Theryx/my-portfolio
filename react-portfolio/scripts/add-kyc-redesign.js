// Ndouken shared old and new PaySika identity-check screens on 2026-11-13 and confirmed
// that after the redesign users could start from any step and resume where they left off.
// Screens are bundled with the sunking site: src/assets/img/paysika/KYC/ (old: phone,
// email and profile QR blurred).
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const LINE = 'Redesigned the identity check into a summary of its steps (personal details, selfie, ID document, taxpayer number, address) that users could start in any order and resume later, each step showing its own status';
const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:paysika'`;
const md = row.metadata;
if (!md.highlights.includes(LINE)) md.highlights.push(LINE);
md.notes = [
  ...(md.notes ?? []).filter((n) => !n.startsWith('KYC screens')),
  'KYC screens, old and new: src/assets/img/paysika/KYC/ (bundled with the sunking site).',
];
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${new Date().toISOString()} WHERE id = 'experience:paysika'`;
console.log('ok');
