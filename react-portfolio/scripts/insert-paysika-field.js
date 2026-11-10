// New warehouse project: PaySika field research. Built from confirmed facts only.
// Field photos from Ndouken are still to come; the placeholder photo block has empty images.
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
    eyebrow: 'PaySika, 2023 to 2026',
    heading: 'Monthly field visits',
    text: 'PaySika was a bank app for people in Douala and Yaounde, many of them holding a card for the first time. Our analytics showed where people dropped off but not why, so on the last Friday of every month, from 10:00 to 14:00, I went into the field to talk with users and watch them use the app.',
  },
  {
    type: 'stat-cards',
    variant: 'artifacts',
    cards: [
      { icon: 'route', title: 'Last Friday, every month', text: 'Four hours in the field with users, from 2023 to 2026.' },
      { icon: 'users', title: '2 to 6 days', text: 'The length of the Yaounde fairs I covered from start to finish: Promote, CITS and YAFE.' },
      { icon: 'file', title: 'A report every time', text: 'Each field operation ended in a written report with the changes I proposed.' },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'Method',
    heading: 'How a field visit went',
    items: [
      { title: 'Visit', text: 'I met users in the field and at the fairs.' },
      { title: 'Observe', text: 'I watched people use the app and noted what they did and what they told me.' },
      { title: 'Collect feedback', text: 'At the fairs I stayed for the whole event, collecting feedback from the users who came to the stand.' },
      { title: 'Report', text: 'Afterwards I wrote a report with what I saw and the improvements and updates I proposed to the team.' },
    ],
  },
  {
    type: 'two-col',
    image: 'paysika-packaging-v2.jpg',
    caption: 'The new packaging, with first-use instructions printed inside.',
    eyebrow: 'What people showed us',
    heading: 'Most of our users had never held a card',
    markdown:
      'We asked users to post a photo with their new card and their delivery agent. The photos showed two problems. The white envelope often arrived creased, dirty or torn. And some people did not know how to use the card at an ATM, a supermarket or a POS terminal, because most of them were first-time card holders. In version 2 we made a sleeve solid enough for the delivery chain and printed short instructions inside it, and the questions reaching customer service dropped with them.',
  },
  {
    type: 'compare',
    eyebrow: 'The packaging',
    heading: 'The envelope, before and after',
    left: { image: 'paysika-envelope-v1.jpg', label: 'Version 1', caption: 'It left the office fine and often arrived creased, dirty or torn.' },
    right: { image: 'paysika-packaging-v2.jpg', label: 'Version 2', caption: 'The redesigned sleeve, solid enough for the delivery chain.' },
  },
  {
    type: 'intro',
    eyebrow: 'Relay points',
    heading: 'Thirty minutes at the relay point',
    text: 'Customers collected their cards at relay points, where the handover ran on paper forms and manual signatures, and someone in the office typed the status in later. People waited about 30 minutes. I replaced the paperwork with QR-code validation in an app for our 15 delivery agents in Douala and Yaounde, so the handover was recorded the moment it happened. The wait dropped to about 10 minutes.',
  },
  {
    type: 'photos',
    heading: 'The app our agents used',
    text: 'The agents were not part of the product team, so the app had to be obvious on a phone in the middle of a shift: the order, the customer, the address, one button to confirm.',
    items: [
      { image: `${CDN}/v1789529537/glrqigcg6qhz79dqsqk6.png`, caption: 'The order list the agents worked from.' },
      { image: `${CDN}/v1789531743/pasd7qkl209hrk1gyej3.jpg`, caption: 'QR validation at the relay point, in place of the paper form.' },
      { image: 'paysika-relay-stand.jpg', caption: 'An activation stand in Douala, where cards are collected and the handover happens.' },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'How it was recorded',
    heading: 'Consent, scripts and reports',
    items: [
      {
        image: 'paysika-research-archive.png',
        title: 'Usability-testing archive',
        description: 'Consent forms, scripts, observer guides, reports and recordings from the sessions.',
      },
    ],
  },
];

const entry = {
  id: 'project:paysika-field',
  type: 'project',
  title: 'PaySika in the field',
  tags: ['Field research · Service design'],
  metadata: {
    tag: 'Field research · Service design',
    role: 'UX Design Lead',
    period: '2023 - 2026',
    location: 'Douala and Yaounde, Cameroon',
    site: 'https://www.paysika.co',
    image: 'paysika-relay-stand.jpg',
    tagline: 'Monthly visits with our users, the Yaounde fairs, and the changes that came out of them.',
    description:
      'At PaySika I spent the last Friday of every month in the field watching people use our app, and worked our stand at the Yaounde fairs. After each visit I wrote a report, and some of it led to changes such as new card packaging with instructions inside and a QR handover that cut relay-point waits from 30 to 10 minutes.',
    responsibilities: [
      'Field sessions with users on the last Friday of every month, 2023 to 2026, 10:00 to 14:00',
      'Observation and feedback collection at Promote, CITS and YAFE in Yaounde, 2 to 6 days each',
      'A written report after each field operation, with proposed improvements',
      'Redesigned the card packaging after user photos showed damage and first-time card confusion',
      'Replaced paper handover at relay points with QR validation in an app for 15 delivery agents',
    ],
    todo: ['Add field and event photos from Ndouken (blurred where needed)'],
    content_blocks: blocks,
    source_project_id: 'paysika-field',
  },
};

await sql`
  INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
  VALUES (${entry.id}, ${entry.type}, ${entry.title}, ${''},
    ${JSON.stringify(cleanDeep(entry.metadata))}::jsonb, ${entry.tags}, ${false}, ${0}, ${now}, ${now})
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, metadata = EXCLUDED.metadata,
    tags = EXCLUDED.tags, updated_at = ${now}`;
console.log('upserted', entry.id);
