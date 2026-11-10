// Ndouken's role on the 2020 GEFONA x UNESCO e-learning campaign: content and editorial.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();
const LINE =
  'In 2020, handled content and editorial for a humanitarian awareness campaign with UNESCO on the importance of e-learning during COVID-19. It reached about 5,000 people through organic Facebook and Twitter posts, Facebook ads and WhatsApp groups';
const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:gefona'`;
const md = row.metadata;
md.highlights = [...md.highlights.filter((h) => !h.includes('UNESCO')), LINE];
md.unconfirmed = (md.unconfirmed || []).filter((u) => u !== 'UNESCO campaign: my role');
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = 'experience:gefona'`;
console.log(md.highlights.filter((h) => h.includes('UNESCO')));
