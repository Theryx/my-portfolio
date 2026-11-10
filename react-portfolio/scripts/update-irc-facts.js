// Adds facts Ndouken confirmed on 2026-11-10 while preparing the IRC application:
// job targets, PaySika field research, and the GEFONA x UNESCO e-learning campaign.
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

// 1. Job targets note
const targets = {
  id: 'note:job-targets',
  type: 'note',
  title: 'Job targets',
  content:
    'Role families I apply for, and the ones I do not. Confirmed October 2026, UX research added November 2026.',
  metadata: {
    target_roles: [
      'UX design',
      'UX research',
      'Product design',
      'Product management',
      'Product owner',
      'Customer experience',
      'Service design',
    ],
    excluded_roles: [
      'Digital marketing',
      'Graphic design',
      'Video and motion',
      'Community management',
      'Communications',
      'Teaching',
      'Unpaid internships',
    ],
    notes: 'Brand design is a strength to sell inside UX and product roles, not a role family to apply for.',
  },
};
await sql`
  INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
  VALUES (${targets.id}, ${targets.type}, ${targets.title}, ${targets.content},
    ${JSON.stringify(cleanDeep(targets.metadata))}::jsonb, ${[]}, ${true}, ${0}, ${now}, ${now})
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content,
    metadata = EXCLUDED.metadata, updated_at = ${now}`;

// Read-modify-write helper for existing entries
async function patch(id, fn) {
  const [row] = await sql`SELECT content, metadata FROM warehouse_entries WHERE id = ${id}`;
  if (!row) throw new Error(`missing ${id}`);
  const { content, metadata } = fn(row.content || '', row.metadata || {});
  await sql`UPDATE warehouse_entries SET content = ${clean(content)},
    metadata = ${JSON.stringify(cleanDeep(metadata))}::jsonb, updated_at = ${now} WHERE id = ${id}`;
  console.log('updated', id);
}

// 2. PaySika field research
const paysikaField = [
  'Went into the field every Friday from 10:00 to 14:00 to talk with users and watch them use the app',
  'Attended every event PaySika took part in, such as trade fairs in Yaounde lasting 2 to 6 days, to observe users, take notes and collect feedback on the spot',
  'Wrote a report after each field operation, with improvements and product updates proposed from what was observed',
];
await patch('experience:paysika', (content, md) => ({
  content,
  metadata: {
    ...md,
    highlights: uniq([...(md.highlights || []), ...paysikaField]),
    unconfirmed: uniq([...(md.unconfirmed || []), 'name of the Yaounde event (Promote?)', 'years the Friday field sessions ran']),
  },
}));

await patch('skill:user-research-and-usability-testing', (content, md) => ({
  content: content.includes('Friday')
    ? content
    : content +
      '\nPaySika field research: every Friday from 10:00 to 14:00 in the field with users, watching them use the app; present at every event PaySika joined (2 to 6 days, for example in Yaounde) to observe and collect feedback; wrote a report after each field operation with proposed improvements.',
  metadata: md,
}));

// 3. GEFONA x UNESCO e-learning campaign
await patch('experience:gefona', (content, md) => ({
  content,
  metadata: {
    ...md,
    highlights: uniq([
      ...(md.highlights || []),
      'Worked with UNESCO on a humanitarian awareness campaign about the importance of e-learning during the COVID-19 period',
    ]),
    unconfirmed: uniq([...(md.unconfirmed || []), 'UNESCO campaign: year, my role, reach']),
  },
}));

console.log('done');
