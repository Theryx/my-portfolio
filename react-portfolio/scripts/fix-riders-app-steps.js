// Keep two riders' app steps to Ndouken's own words (2026-11-13).
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const ID = 'project:paysika-riders-app';
const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = ${ID}`;
const md = row.metadata;
const steps = md.content_blocks.find((b) => b.type === 'steps');
steps.items = steps.items.map((i) => {
  if (i.title === 'Nothing to install from a store') return { title: 'A web app', text: 'It was a progressive web app, running on the riders\' cheap smartphones.' };
  if (i.title === 'Prototyped before it was built') return { ...i, text: 'I designed it in Figma with Claude and prototyped it in Figma Make before PaySika engineers built it.' };
  return i;
});
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${new Date().toISOString()} WHERE id = ${ID}`;
console.log(steps.items.map((i) => i.title));
