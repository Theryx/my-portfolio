// Facts Ndouken confirmed on 2026-11-13: he designed the riders' app in Figma with Claude,
// prototyped it in Figma Make, PaySika engineers built it; designed and launched April to June 2026.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();
const ID = 'project:paysika-riders-app';
const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = ${ID}`;
const md = row.metadata;
md.period = 'Apr - Jun 2026';
delete md.unconfirmed;
md.todo = md.todo.filter((t) => !t.startsWith('Confirm who built'));
const line = 'Designed it in Figma with Claude and prototyped it in Figma Make; PaySika engineers built it';
if (!md.responsibilities.includes(line)) md.responsibilities.push(line);
md.content_blocks[0].eyebrow = 'PaySika, April to June 2026';
const steps = md.content_blocks.find((b) => b.type === 'steps');
if (!steps.items.some((i) => i.title === 'Prototyped before it was built')) {
  steps.items.push({ title: 'Prototyped before it was built', text: 'I designed it in Figma, using Claude to explore and write, and prototyped it in Figma Make before PaySika engineers built it.' });
}
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = ${ID}`;
const SK = 'skill:ai-in-design-workflow';
const [s] = await sql`SELECT content FROM warehouse_entries WHERE id = ${SK}`;
if (!s.content.includes('Figma Make')) {
  await sql`UPDATE warehouse_entries SET content = ${s.content.trimEnd() + '\nPaySika riders\' app (Apr to Jun 2026): designed in Figma with Claude and prototyped in Figma Make before engineers built it.'}, updated_at = ${now} WHERE id = ${SK}`;
}
console.log('ok');
