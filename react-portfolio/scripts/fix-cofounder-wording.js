// Ndouken was the product designer on Shomi (built under Kody), not a
// co-founder (confirmed 2026-11-10). Rewords every co-founder claim in the
// database. Run with --apply to write; without it, it only reports.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const APPLY = process.argv.includes('--apply');

const RULES = [
  ['Co-founding Kody:', 'Building Kody:'],
  ['What co-founding taught me about Product Management', 'What building Kody taught me about Product Management'],
  ['Co-founding compressed essential PM lessons', 'Building Kody compressed essential PM lessons'],
  ['co-founder of Kody, leading business case development', 'product designer at Kody, leading business case development'],
  ['Co-founder of Kody (the company) and product owner on Shomi (the product)', 'Product designer and product owner on Shomi (the product), built under Kody (the company)'],
  ['Co-founder of Kody and Product Owner on Shomi', 'Product Designer and Product Owner on Shomi at Kody'],
  ['Co-founder of Kody and product owner on Shomi', 'Product designer and product owner on Shomi at Kody'],
  ['Co-founder & Product Manager', 'Product Designer & Product Manager'],
  ['Co-founder & Product Owner', 'Product Designer & Product Owner'],
  ['As Product Lead & Co-founder,', 'As Product Designer,'],
  ['Product Lead & Co-founder', 'Product Designer'],
  ['end to end as co-founder,', 'end to end as its product designer,'],
  ['my co-founder on engineering', 'my teammate on engineering'],
  ['My co-founder and I', 'My teammate and I'],
  ['I co-founded Kody and owned', 'I was the product designer at Kody and owned'],
  ['Earlier I co-founded an ed-tech product', 'Earlier I designed an ed-tech product'],
  ['Before that I co-founded an education product and designed', 'Before that I was the product designer on an education product, and designed'],
  ['co-founded ventures, and build in the open', 'designed for early-stage ventures, and build in the open'],
  ['co-founding ventures and shipping', 'designing for early-stage ventures and shipping'],
  ['the loneliest part of founding work', 'the loneliest part of early-stage work'],
];
const fix = (s) => RULES.reduce((t, [a, b]) => t.split(a).join(b), s);
const hits = (s) => s.match(/.{0,80}co-?found.{0,80}/gi) || [];

const TABLES = [
  ['warehouse_entries', ['id']],
  ['company_entries', ['company_id', 'entry_id']],
  ['companies', ['id']],
  ['profiles', ['id']],
  ['projects', ['id']],
  ['blog_posts', ['id']],
];

let changed = 0;
for (const [tb, keys] of TABLES) {
  const cols = await sql.query(
    `SELECT column_name, data_type FROM information_schema.columns
     WHERE table_name = $1 AND data_type IN ('text', 'jsonb', 'json', 'character varying')`,
    [tb],
  );
  for (const row of await sql.query(`SELECT * FROM ${tb}`)) {
    const label = `${tb}:${keys.map((k) => row[k]).join('/')}`;
    for (const { column_name: c, data_type: dt } of cols) {
      const v = row[c];
      if (v == null) continue;
      const before = typeof v === 'string' ? v : JSON.stringify(v);
      if (!/co-?found/i.test(before)) continue;
      const after = fix(before);
      for (const h of hits(after)) console.log('LEFT', label, c, '::', h);
      if (after === before) continue;
      changed++;
      if (APPLY) {
        const where = keys.map((k, i) => `${k} = $${i + 2}`).join(' AND ');
        const cast = dt === 'jsonb' ? '::jsonb' : dt === 'json' ? '::json' : '';
        await sql.query(`UPDATE ${tb} SET ${c} = $1${cast} WHERE ${where}`, [after, ...keys.map((k) => row[k])]);
      }
    }
  }
}
console.log(APPLY ? 'updated' : 'would update', changed, 'fields');
