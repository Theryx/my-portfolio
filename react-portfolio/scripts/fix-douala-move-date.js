// Ndouken confirmed on 2026-11-13 that he moved to Douala in Dec 2021, when he joined PaySika.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const OLD = 'moved to Douala in 2022 when I joined PaySika';
const NEW = 'moved to Douala in December 2021 when I joined PaySika';
const rows = await sql`SELECT id, content FROM warehouse_entries WHERE content LIKE ${'%' + OLD + '%'}`;
for (const r of rows) {
  await sql`UPDATE warehouse_entries SET content = ${r.content.replaceAll(OLD, NEW)}, updated_at = ${new Date().toISOString()} WHERE id = ${r.id}`;
  console.log('fixed', r.id);
}
const left = await sql`SELECT id FROM warehouse_entries WHERE content LIKE '%Douala in 2022%' OR metadata::text LIKE '%Douala in 2022%'`;
console.log('still mentioning Douala in 2022:', left.map((r) => r.id));
