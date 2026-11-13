// Company site /c/sunking: Senior Product Designer (UX Designer) application (Sun King).
// Facts come from the warehouse only. No em or en dashes.
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

const JOB_DESCRIPTION = fs.readFileSync(path.join(__dirname, '../../applications/sunking/job.md'), 'utf8');

// ── Blocks reused from the warehouse stories ──
async function blocksOf(id) {
  const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = ${id}`;
  return row.metadata.content_blocks ?? [];
}
const byHeading = (blocks, heading) => {
  const b = blocks.find((x) => x.heading === heading);
  if (!b) throw new Error(`Block not found: ${heading}`);
  return structuredClone(b);
};

const paysika = await blocksOf('project:paysika_fintech');
const riders = await blocksOf('project:paysika-riders-app');

// ── The riders' app: the rider photo, bundled with this site ──
const RIDER_PHOTO = { image: 'paysika-rider-app.webp', caption: 'One of our riders going through the app.' };
const ridersStory = riders.map((b) =>
  b.type === 'photos' && b.heading === 'The app our riders used'
    ? { ...b, items: [RIDER_PHOTO, ...b.items.filter((i) => i.image !== RIDER_PHOTO.image)] }
    : b,
);
const field = await blocksOf('project:paysika-field');

// ── PaySika, the customer side ──
const outcomes = structuredClone(paysika.find((b) => b.type === 'stat-cards'));
outcomes.cards = outcomes.cards.filter((c) => c.title !== 'Design team lead');
const leak = byHeading(paysika, 'Where the funnel was leaking');
const twoMarkets = byHeading(paysika, 'One product, two sets of rules');
twoMarkets.text = twoMarkets.text.replace('I led the design across', 'I worked on the design across');
if (/\bled\b/.test(twoMarkets.text)) throw new Error('twoMarkets still says led');
const behind = byHeading(paysika, 'The work behind the screens');
behind.items = behind.items.map((it) =>
  it.title === 'Design system and team process'
    ? { ...it, title: 'UI standards', description: 'The UI standards and the way design and engineering handed work to each other.' }
    : it,
);
const system = byHeading(paysika, 'One design system, every surface');
system.eyebrow = 'Design system';
system.text =
  'Colour, type, components, card states, icons and illustrations lived in one Figma library, as semantic tokens with the same names developers used in code. I documented each component with do and don\'t notes and reviewed builds so nothing drifted between Figma and production.';
const trust = byHeading(paysika, 'Trust is designed one screen at a time');
const pickup = byHeading(paysika, 'The pickup code');
pickup.text = 'At the relay point, customers scanned a QR code with the PaySika app. It brought up their pickup code and details, so they could show they had ordered the card.';

const customerStory = [
  {
    type: 'intro',
    eyebrow: 'PaySika, 2021 to 2026',
    heading: 'A bank app for people new to banking',
    text: 'I worked on PaySika for nearly five years, from the first version to a bank app used by thousands of people in Cameroon and Gabon. Many of them were holding a card for the first time. This page covers the customer side: onboarding, identity checks, transactions, the card and the design system.',
  },
  outcomes,
  leak,
  pickup,
  twoMarkets,
  behind,
  system,
  trust,
];

// ── PaySika in the field: the agents' app photos stay on the riders' app page ──
const usabilitySession = {
  type: 'photos',
  eyebrow: 'Usability testing, June 2022',
  heading: 'A usability session',
  text: 'Besides the field visits, I ran moderated usability sessions. Participants signed a consent form before coming in, then went through the whole journey, from discovering the app to onboarding, identity checks and creating a card, while I followed a test script.',
  items: [
    {
      image: 'paysika-usability-session.webp',
      caption: 'A participant going through the app, with the test script on the table.',
    },
  ],
};
const fieldStory = field.flatMap((b) => {
  if (b.heading === 'The app our agents used') return [];
  if (b.heading === 'Consent, scripts and reports') return [usabilitySession, b];
  return [b];
});

// ── The company row ──
// Copy kept plain on purpose: it should read as a portfolio, not an answer to one job.
const company = {
  id: 'sun-king',
  slug: 'sunking',
  name: 'Sun King',
  role: 'Senior Product Designer (UX Designer)',
  job_url: '',
  job_description: JOB_DESCRIPTION,
  layout: 'daylight-v1',
  tagline: 'Product designer from Cameroon.',
  hero_title: "I'm Ndouken, a product designer from Cameroon. Most of my work has been in fintech.",
  hero_subtitle:
    'I spent nearly five years at PaySika, a bank app in Cameroon and Gabon. I worked on the customer app, the app our delivery riders used, and a lot of what happened between the app and the customer. I also like to get out and watch people use what I design.',
  philosophy_title: 'A few habits',
  philosophy_text: '',
  intro_expanded_text: [
    'At PaySika I worked on the app from its first version until 2026: onboarding, identity checks, card activation and the design system. I also worked on the parts of the card journey that happened away from the app, like home delivery, relay-point pickup and the app our delivery riders used. When PaySika opened in Gabon, I reworked onboarding and identity checks for the local rules.',
    'From 2023 to 2026 I spent the last Friday of every month in the field with our users, and I covered the Yaounde fairs we took part in. After each visit I wrote a report with the changes I wanted to propose.',
    'Before PaySika I was UX researcher and product designer at CrowdRemit, a money transfer product, and product designer at Kody, where we built an exam-prep app. I also helped maintain Jobsika, an open-source job board in Cameroon.',
  ].join('\n\n'),
  badges: [],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/file/d/19ETN9pIDDzj5cUs61Sr7aQOlcrZQvUqX/view',
    role_line: 'Product designer',
  },
  about_content: {
    lede: "I'm a product designer from Cameroon, and I work in English and French. Most of my work has been in fintech. My background is in land surveying engineering, so I came to design from the technical side.",
    location: 'Douala, Cameroon',
    languages: 'English and French',
    tools: [
      { label: 'Design', items: ['Figma', 'Figma Make'] },
      { label: 'AI', items: ['Claude, for ideas, copy, variations, prototypes and research'] },
      { label: 'Data and code', items: ['Mixpanel', 'HTML, CSS and some React'] },
      { label: 'Motion', items: ['Icon and illustration animation', 'Video editing'] },
    ],
    experience: [
      { role: 'Senior Product Designer', org: 'PaySika', place: 'Douala', period: 'Dec 2021 to Aug 2026' },
      { role: 'Customer Success Consultant', org: 'Loving Tech', place: 'Douala', period: 'Jan to Apr 2026' },
      { role: 'UI/UX Consultant, part-time', org: 'Matanga Agency', place: 'Remote', period: 'Dec 2023 to Feb 2024' },
      { role: 'Co-maintainer', org: 'Jobsika, OSS Cameroon', place: 'Cameroon', period: '2022 to 2024' },
      { role: 'UX Researcher and Product Designer', org: 'CrowdRemit', place: 'Remote', period: 'Jan to Jun 2021' },
      { role: 'Product Designer', org: 'Kody (Shomi)', place: 'Cameroon', period: 'Dec 2019 to Dec 2020' },
    ],
    skills: [
      'User research and usability testing',
      'Journeys and service design',
      'Mobile and web interfaces',
      'Prototyping',
      'Design systems',
      'Accessibility',
      'Product analytics',
      'Motion for icons and illustrations',
    ],
    education: [
      { degree: 'Masters in Engineering, Land Survey', school: 'National Advanced School of Public Works, Yaounde', period: '2015 to 2020' },
    ],
    certifications: [
      { name: 'Google Project Management Certificate', meta: 'In progress, since Aug 2026' },
      { name: 'Empathy in UX Design', meta: 'Feb 2020' },
      { name: 'Human-Product Interaction Design', meta: 'Feb 2020' },
      { name: 'Visual Elements of User Interface Design', meta: 'California Institute of the Arts, Mar 2020' },
    ],
    faqs: [
      {
        question: 'What did the field visits look like?',
        answer: 'On the last Friday of the month, from 10:00 to 14:00, I went out to talk with users and watch them use the app. I also stayed for the whole of the Yaounde fairs we took part in. A few things came out of it, like the new card packaging with instructions inside.',
      },
      {
        question: 'Do you use AI when you design?',
        answer: 'Yes, for ideas, copy, variations, prototypes, research and A/B tests. The riders\' app was designed in Figma with Claude and prototyped in Figma Make before the engineers built it.',
      },
    ],
  },
  theme_config: {
    concept: 'daylight',
    bg: '#FAFAF7',
    surface: '#FFFFFF',
    ink: '#0B0B0C',
    muted: '#4A4A50',
    rule: '#D9D9D4',
    accent: '#1E3BD6',
    accent_soft: '#E1E6FF',
    dark_bg: '#0E0F12',
    dark_accent: '#8FA3FF',
    work_title: 'Selected work',
    practice: [
      {
        title: 'Watching people use it',
        text: 'Our analytics showed where people dropped off but not why. The monthly field visits were how we found out.',
      },
      {
        title: 'Trying it before building it',
        text: 'I like to put a prototype in front of people early. The riders\' app was a Figma Make prototype before the engineers started on it.',
      },
      {
        title: 'Checking afterwards',
        text: 'I set up tracking in Mixpanel before a release, so we can see whether a change actually helped.',
      },
    ],
    projects: {
      'paysika-riders-app': {
        side: 'Internal app',
        field: [
          { label: 'Who', value: 'Our delivery riders, Douala and Yaounde' },
          { label: 'Device', value: 'Cheap smartphones' },
          { label: 'Network', value: 'Often weak' },
          { label: 'Languages', value: 'French and English' },
          { label: 'Training', value: 'A few hours' },
        ],
      },
      paysika_fintech: {
        title: 'PaySika',
        side: 'Fintech',
        field: [
          { label: 'Who', value: 'Customers, many new to cards' },
          { label: 'Markets', value: 'Cameroon and Gabon' },
          { label: 'Languages', value: 'French and English' },
          { label: 'Outcome', value: '+40% retention, -60% support tickets' },
        ],
      },
      'paysika-field': {
        side: 'Research',
        field: [
          { label: 'Who', value: 'Customers and delivery agents' },
          { label: 'Where', value: 'Douala and Yaounde' },
          { label: 'How often', value: 'Last Friday of the month' },
        ],
      },
      crowdremit_fintech: {
        side: 'Money transfers',
        field: [
          { label: 'Who', value: 'People sending money abroad' },
          { label: 'Surfaces', value: 'iOS, Android, web, dashboard' },
          { label: 'Method', value: 'Interviews, journey maps, A/B tests' },
        ],
      },
    },
  },
  seo: {
    title: 'Ndouken Theryx, product designer',
    description: 'Portfolio of Ndouken Theryx, product designer from Cameroon.',
  },
};

const ROLE = 'Senior Product Designer';

const links = [
  {
    entry_id: 'project:paysika_fintech',
    sort_order: 0,
    metadata: {
      tag: 'Fintech',
      tagline: 'A bank app in Cameroon and Gabon, for people who were often getting their first card.',
      role: ROLE,
      period: '2021 to 2026',
      location: 'Douala, Cameroon',
      content_blocks: customerStory,
    },
  },
  {
    entry_id: 'project:paysika-riders-app',
    sort_order: 1,
    metadata: {
      role: ROLE,
      tagline: 'The app our delivery riders used to get new orders and find customers, on cheap phones with weak connections.',
      image: 'paysika-rider-app.webp',
      content_blocks: ridersStory,
    },
  },
  { entry_id: 'project:paysika-field', sort_order: 2, metadata: { role: ROLE, content_blocks: fieldStory } },
  { entry_id: 'project:crowdremit_fintech', sort_order: 3, metadata: null },
];

const c = cleanDeep(company);

await sql`
  INSERT INTO companies (
    id, name, slug, is_active, role, job_description, job_url, status, layout,
    theme_config, seo, tagline, hero_title, hero_subtitle, philosophy_title,
    philosophy_text, intro_expanded_text, badges, social_links, about_content,
    created_at, updated_at
  ) VALUES (
    ${c.id}, ${c.name}, ${c.slug}, false, ${c.role},
    ${c.job_description}, ${c.job_url}, 'published', ${c.layout},
    ${JSON.stringify(c.theme_config)}, ${JSON.stringify(c.seo)},
    ${c.tagline}, ${c.hero_title}, ${c.hero_subtitle},
    ${c.philosophy_title}, ${c.philosophy_text}, ${c.intro_expanded_text},
    ${c.badges}, ${JSON.stringify(c.social_links)},
    ${JSON.stringify(c.about_content)}, ${now}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, slug = EXCLUDED.slug, is_active = false,
    role = EXCLUDED.role, job_description = EXCLUDED.job_description,
    job_url = EXCLUDED.job_url, status = EXCLUDED.status, layout = EXCLUDED.layout,
    theme_config = EXCLUDED.theme_config, seo = EXCLUDED.seo,
    tagline = EXCLUDED.tagline, hero_title = EXCLUDED.hero_title,
    hero_subtitle = EXCLUDED.hero_subtitle, philosophy_title = EXCLUDED.philosophy_title,
    philosophy_text = EXCLUDED.philosophy_text, intro_expanded_text = EXCLUDED.intro_expanded_text,
    badges = EXCLUDED.badges, social_links = EXCLUDED.social_links,
    about_content = EXCLUDED.about_content, updated_at = ${now}
`;

await sql`
  UPDATE companies
  SET application = ${JSON.stringify({ kind: 'application', stage: 'ready', fit_score: 93 })}::jsonb
  WHERE id = ${c.id}`;

for (const l of links) {
  await sql`
    INSERT INTO company_entries (company_id, entry_id, sort_order, override_content, override_metadata, is_visible)
    VALUES (${c.id}, ${l.entry_id}, ${l.sort_order}, null,
      ${l.metadata ? JSON.stringify(cleanDeep(l.metadata)) : null}::jsonb, true)
    ON CONFLICT (company_id, entry_id) DO UPDATE SET
      sort_order = EXCLUDED.sort_order, override_content = EXCLUDED.override_content,
      override_metadata = EXCLUDED.override_metadata, is_visible = EXCLUDED.is_visible
  `;
}

const check = await sql`SELECT id, slug, is_active, layout, application FROM companies WHERE id = ${c.id}`;
const count = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${c.id}`;
console.log('Company:', check[0]);
console.log('Linked entries:', count[0].n);
