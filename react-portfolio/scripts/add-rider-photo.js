// Ndouken sent the photo of a rider using the app on 2026-11-13. It is bundled with the
// sunking site (src/assets/img/paysika/Riders/paysika-rider-app.webp); this records it
// on the warehouse entry and clears the to-do.
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
md.todo = (md.todo ?? []).filter((t) => !t.startsWith('Add the photo of a rider'));
if (md.todo.length === 0) delete md.todo;
md.notes = [
  ...(md.notes ?? []).filter((n) => !n.startsWith('Rider photo')),
  'Rider photo: src/assets/img/paysika/Riders/paysika-rider-app.webp (bundled with the sunking site; add it to the project image map to use it elsewhere).',
];
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${new Date().toISOString()} WHERE id = ${ID}`;
console.log('ok', md.todo ?? 'no todo left');
