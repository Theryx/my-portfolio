// Corrections and details Ndouken gave on 2026-11-10 (second pass):
// field sessions were the last Friday of each month (2023 to 2026), the events were
// Promote, CITS and YAFE in Yaounde, the UNESCO campaign details, and Shomi outreach.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

const clean = (s) => (s == null ? s : String(s).replace(/[–—]/g, '-'));
const cleanDeep = (v) =>
  typeof v === 'string' ? clean(v)
    : Array.isArray(v) ? v.map(cleanDeep)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)]))
    : v;
const now = new Date().toISOString();
const uniq = (arr) => [...new Set(arr)];

async function patch(id, fn) {
  const [row] = await sql`SELECT content, metadata FROM warehouse_entries WHERE id = ${id}`;
  if (!row) throw new Error(`missing ${id}`);
  const { content, metadata } = fn(row.content || '', row.metadata || {});
  await sql`UPDATE warehouse_entries SET content = ${clean(content)},
    metadata = ${JSON.stringify(cleanDeep(metadata))}::jsonb, updated_at = ${now} WHERE id = ${id}`;
  console.log('updated', id);
}

const FRIDAY =
  'Went into the field on the last Friday of every month, from 2023 to 2026, from 10:00 to 14:00, to talk with users and watch them use the app';
const EVENTS =
  'Was present for the full length of the Yaounde fairs PaySika took part in, including Promote, CITS and YAFE (Yaounde en Fete), each lasting 2 to 6 days, to observe users, take notes and collect feedback on the spot';
const REPORTS =
  'Wrote a report after each field operation, with improvements and product updates proposed from what was observed';

await patch('experience:paysika', (content, md) => ({
  content,
  metadata: {
    ...md,
    highlights: uniq([
      ...(md.highlights || []).filter(
        (h) => !h.startsWith('Went into the field every Friday') && !h.startsWith('Attended every event PaySika'),
      ),
      FRIDAY,
      EVENTS,
      REPORTS,
    ]),
    unconfirmed: (md.unconfirmed || []).filter(
      (u) => !u.startsWith('name of the Yaounde event') && !u.startsWith('years the Friday'),
    ),
  },
}));

await patch('skill:user-research-and-usability-testing', (content, md) => ({
  content: content
    .split('\n')
    .filter((l) => !l.startsWith('PaySika field research:'))
    .concat(
      'PaySika field research: on the last Friday of every month from 2023 to 2026, 10:00 to 14:00 in the field with users, watching them use the app; present for the full length of the Yaounde fairs PaySika joined (Promote, CITS, YAFE, 2 to 6 days each) to observe and collect feedback; wrote a report after each field operation with proposed improvements.',
    )
    .join('\n'),
  metadata: md,
}));

await patch('experience:gefona', (content, md) => ({
  content,
  metadata: {
    ...md,
    highlights: uniq([
      ...(md.highlights || []).filter((h) => !h.startsWith('Worked with UNESCO')),
      'In 2020, worked with UNESCO on a humanitarian awareness campaign about the importance of e-learning during COVID-19, reaching about 5,000 people through organic Facebook and Twitter posts, Facebook ads and WhatsApp groups',
    ]),
    unconfirmed: uniq([
      ...(md.unconfirmed || []).filter((u) => !u.startsWith('UNESCO campaign')),
      'UNESCO campaign: my role',
    ]),
  },
}));

await patch('experience:shomi-kody', (content, md) => ({
  content,
  metadata: {
    ...md,
    highlights: uniq([
      ...(md.highlights || []),
      'Aimed outreach for secondary-school students at their parents and teachers, and spoke directly only to pre-university students preparing for university entrance',
    ]),
  },
}));

console.log('done');
