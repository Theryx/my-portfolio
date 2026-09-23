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

const clean = (s) => (s == null ? s : String(s).replace(/[\u2013\u2014]/g, '-'));
const cleanDeep = (v) =>
  typeof v === 'string' ? clean(v)
    : Array.isArray(v) ? v.map(cleanDeep)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)]))
    : v;

// New assets, bundled with the app and resolved through projectImageMap.
const assets = [
  {
    id: 'asset:paysika-envelope-v1',
    filename: 'paysika-envelope-v1.jpg',
    description: 'Version 1 of the PaySika card envelope, handed over in the field.',
    tags: ['paysika', 'card', 'packaging', 'v1'],
  },
  {
    id: 'asset:paysika-packaging-v2',
    filename: 'paysika-packaging-v2.jpg',
    description: 'Version 2 of the PaySika card packaging, a solid branded sleeve.',
    tags: ['paysika', 'card', 'packaging', 'v2'],
  },
  {
    id: 'asset:paysika-relay-stand',
    filename: 'paysika-relay-stand.jpg',
    description: 'A PaySika activation stand in Douala, where cards are collected.',
    tags: ['paysika', 'card', 'relay point', 'field'],
  },
];

const now = new Date().toISOString();
for (const a of assets) {
  await sql`
    INSERT INTO assets (id, filename, url, mime_type, description, tags, created_at)
    VALUES (${a.id}, ${a.filename}, ${a.filename}, 'image/jpeg', ${a.description}, ${a.tags}, ${now})
    ON CONFLICT (id) DO UPDATE SET
      filename = EXCLUDED.filename, url = EXCLUDED.url, mime_type = EXCLUDED.mime_type,
      description = EXCLUDED.description, tags = EXCLUDED.tags`;
}

// Append the packaging and first-use findings to the shared PaySika warehouse
// entry so every profile that shows the project gets them.
const newBlocks = [
  {
    type: 'compare',
    eyebrow: 'The packaging',
    heading: 'The envelope, before and after',
    left: {
      label: 'Version 1',
      image: 'paysika-envelope-v1.jpg',
      caption: 'The first white envelope, handed over in the field. It left the office fine and often arrived creased, dirty or torn.',
    },
    right: {
      label: 'Version 2',
      image: 'paysika-packaging-v2.jpg',
      caption: 'The redesigned sleeve, solid enough for the delivery chain.',
    },
  },
  {
    type: 'two-col',
    heading: 'Most of our users had never held a card',
    image: 'paysika-packaging-v2.jpg',
    caption: 'The new packaging, with first-use instructions printed inside.',
    markdown:
      'In version 1, some people did not know how to use the card at an ATM, a supermarket or a POS terminal. Most of them were first-time card holders, so there was no habit to fall back on. We found this out when we asked users to post a photo with their card and their delivery agent, and the replies showed both the damaged envelopes and the confusion. In version 2 we printed short instructions inside the packaging, and the questions reaching customer service dropped with them.',
  },
  {
    type: 'photos',
    heading: 'At the relay point',
    items: [
      {
        image: 'paysika-relay-stand.jpg',
        caption: 'An activation stand in Douala, where cards are collected and the handover happens.',
      },
    ],
  },
];

const rows = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'project:paysika_fintech'`;
if (!rows.length) {
  console.error('project:paysika_fintech not found');
  process.exit(1);
}
const meta = rows[0].metadata || {};
const blocks = Array.isArray(meta.content_blocks) ? meta.content_blocks : [];
if (blocks.some((b) => b && b.heading === 'The envelope, before and after')) {
  console.log('Warehouse blocks already present, skipping append.');
} else {
  meta.content_blocks = [...blocks, ...newBlocks];
  await sql`
    UPDATE warehouse_entries
    SET metadata = ${JSON.stringify(cleanDeep(meta))}::jsonb, updated_at = ${now}
    WHERE id = 'project:paysika_fintech'`;
  console.log(`Appended ${newBlocks.length} blocks to project:paysika_fintech.`);
}

console.log(`Upserted ${assets.length} assets.`);
