// New warehouse project: the PaySika delivery riders' app. Built from facts Ndouken
// confirmed on 2026-11-13. Still open: what the rider saw when a scan waited for the
// network, who built the PWA, the exact launch window, and the photo of a rider.
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
const CDN = 'https://res.cloudinary.com/duzedercz/image/upload';

const blocks = [
  {
    type: 'intro',
    eyebrow: 'PaySika, 2026',
    heading: 'Thirty minutes at the relay point',
    text: 'PaySika delivered cards to customers at home and at relay points in Douala and Yaounde. The handover ran on paper forms and manual signatures, and someone in the office typed the status in later. A customer waited about 30 minutes. I designed an app for our 15 delivery riders that replaced the paper with a QR-code scan, so the handover was recorded the moment it happened.',
  },
  {
    type: 'stat-cards',
    cards: [
      { icon: 'users', title: '15 riders', text: 'Delivery riders in Douala and Yaounde, most of them on cheap smartphones with weak connections.' },
      { icon: 'route', title: '30 to 10 minutes', text: 'The wait at the relay point once QR validation replaced the paper form.' },
      { icon: 'target', title: 'A few hours', text: 'The time it took to train riders before they could work with the app.' },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'Constraints',
    heading: 'Designed for a phone in the middle of a shift',
    items: [
      { title: 'Works without internet where it counts', text: 'The customer address and the QR scan worked offline. Receiving new orders needed a connection, because new orders come from the server.' },
      { title: 'Readable outdoors', text: 'Big buttons, icons with labels, and high contrast for riders working in the street.' },
      { title: 'Two languages', text: 'The app ran in French and English.' },
      { title: 'Nothing to install from a store', text: 'A progressive web app, opened from the phone the rider already had.' },
    ],
  },
  {
    type: 'intro',
    eyebrow: 'Rollout',
    heading: 'Trained in a few hours',
    text: 'The riders were not part of the product team. The operations team trained them, and I assisted, in a session of a few hours. After that they worked with the app on their own.',
  },
  {
    type: 'photos',
    heading: 'The app our riders used',
    items: [
      { image: `${CDN}/v1789529537/glrqigcg6qhz79dqsqk6.png`, caption: 'The order list the riders worked from.' },
      { image: `${CDN}/v1789531743/pasd7qkl209hrk1gyej3.jpg`, caption: 'QR validation at the relay point, in place of the paper form.' },
    ],
  },
];

const entry = {
  id: 'project:paysika-riders-app',
  type: 'project',
  title: "PaySika delivery riders' app",
  tags: ['Field app · Offline · Service design'],
  metadata: {
    tag: 'Field app · Offline · Service design',
    role: 'UX Design Lead',
    period: '2026',
    location: 'Douala and Yaounde, Cameroon',
    site: 'https://www.paysika.co',
    image: `${CDN}/v1789531743/pasd7qkl209hrk1gyej3.jpg`,
    tagline: 'A progressive web app for 15 delivery riders on cheap phones, which cut the relay-point handover from 30 minutes to 10.',
    description:
      'I designed the app PaySika delivery riders used to hand cards over to customers. It replaced paper forms with a QR scan, kept the address and the scan working without internet, and was readable outdoors in French and English. Riders were trained in a few hours.',
    responsibilities: [
      'Designed a progressive web app for 15 delivery riders in Douala and Yaounde',
      'Replaced paper handover forms with QR-code validation, cutting the relay-point wait from about 30 to 10 minutes',
      'Kept the customer address and the QR scan working offline; receiving new orders needed a connection',
      'Designed for outdoor use: big buttons, icons with labels, high contrast, French and English',
      'Assisted the operations team in training riders, in a few hours',
    ],
    unconfirmed: ['period detail (designed and launched in the second term of 2026)'],
    todo: [
      'Add the photo of a rider using the app (from Ndouken)',
      'Confirm what the rider saw when a scan was waiting for the network, and how it synced',
      'Confirm who built the PWA',
    ],
    content_blocks: blocks,
    source_project_id: 'paysika-riders-app',
  },
};

await sql`
  INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
  VALUES (${entry.id}, ${entry.type}, ${entry.title}, ${''},
    ${JSON.stringify(cleanDeep(entry.metadata))}::jsonb, ${entry.tags}, ${false}, ${0}, ${now}, ${now})
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, metadata = EXCLUDED.metadata,
    tags = EXCLUDED.tags, updated_at = ${now}`;
console.log('upserted', entry.id);

const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:paysika'`;
const md = row.metadata;
const line = 'Assisted the operations team in training the delivery riders on their app, in a few hours';
if (!md.highlights.includes(line)) md.highlights.push(line);
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = 'experience:paysika'`;
console.log('experience:paysika ok');
