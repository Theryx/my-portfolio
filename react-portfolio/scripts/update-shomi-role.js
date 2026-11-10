// Confirmed by Ndouken on 2026-11-10: on Shomi he was the product designer, not a co-founder.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);

await sql`
  UPDATE warehouse_entries SET
    title = 'Product Designer, Kody (Shomi)',
    content = 'Product designer of Shomi, interactive exam prep for Cameroonian secondary-school students, built under Kody by a two-person team (design and engineering).',
    metadata = metadata || ${JSON.stringify({ role: 'Product Designer', period: '12.2019 - 12.2020' })}::jsonb,
    updated_at = now()
  WHERE id = 'experience:shomi-kody'`;
await sql`
  UPDATE warehouse_entries SET metadata = metadata || ${JSON.stringify({ role: 'Product Designer' })}::jsonb, updated_at = now()
  WHERE id = 'project:shomi_default'`;
console.log(await sql`select id, metadata->>'role' role from warehouse_entries where id in ('experience:shomi-kody','project:shomi_default')`);
