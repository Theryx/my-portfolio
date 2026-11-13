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
// The old identity check, from screenshots Ndouken sent (phone, email and profile QR blurred).
const oldKyc = {
  type: 'gallery',
  eyebrow: 'Before',
  heading: 'The old identity check',
  text: 'Four screens from the identity check before the redesign, from the first screen to a profile still waiting for verification.',
  items: [
    { image: 'paysika-kyc-old-1-start.webp', title: 'Start', description: 'Why we ask, and a promise that it takes a few minutes.' },
    { image: 'paysika-kyc-old-2-details.webp', title: 'Personal details', description: 'Name, neighbourhood, city and country.' },
    { image: 'paysika-kyc-old-3-document.webp', title: 'Choosing a document', description: 'One option still showed an untranslated key, driver_license.' },
    { image: 'paysika-kyc-old-4-profile.webp', title: 'Unverified profile', description: 'The profile while the account waited for verification.' },
  ],
};
// Back-office screens Ndouken designed (mock data and a specimen passport).
const backOffice = {
  type: 'gallery',
  eyebrow: 'Back office',
  heading: 'The tools behind the app',
  text: 'I also designed the back office the team worked in. Identity checks arrived in a backlog that operators could search and filter, and each request opened on the same sections as the app, with a box to tick once a section had been checked.',
  items: [
    { image: 'paysika-bo-kyc-review.webp', title: 'Identity check backlog', description: 'Requests filtered by status, minors and date, with the personal details next to the ID document. The data and passport are samples.' },
    { image: 'paysika-bo-access-codes.webp', title: 'Campaign access codes', description: 'Create a code with a volume of keys, and see past codes and whether they are active or expired.' },
  ],
};
const newKyc = {
  type: 'gallery',
  eyebrow: 'After',
  heading: 'The new identity check',
  text: 'After the redesign, the identity check became a summary of its steps: personal details, selfie, ID document, taxpayer number and address. People could start from any step and come back later to finish where they left off, and each step showed its own status.',
  items: [
    { image: 'paysika-kyc-new-1-summary.webp', title: 'Start anywhere', description: 'Every step waiting for information, in any order.' },
    { image: 'paysika-kyc-new-2-review.webp', title: 'Under review', description: 'Submitted steps marked as under review.' },
    { image: 'paysika-kyc-new-3-ui-update.webp', title: 'A later UI update', description: 'The same flow after a visual update, with an info icon on each step that explains what it asks for.' },
  ],
};
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
  oldKyc,
  newKyc,
  backOffice,
  pickup,
  twoMarkets,
  behind,
  system,
  trust,
];

// ── Louci and Cici: side projects where the AI is part of the product ──
// Screens and captions come from scripts/add-app-screenshots.js (demo data only).
const DEMO = 'Every screen below runs on invented demo data.';
const louciStory = [
  {
    type: 'intro',
    eyebrow: 'Louci, 2026',
    heading: 'What can I safely spend today?',
    text: `Louci puts cash, mobile money and bank accounts in one place, in XAF, and works out what is safe to spend before the next income. Expected income that has not arrived is never counted as spendable. I designed it and built it with AI-assisted development. ${DEMO}`,
  },
  {
    type: 'steps',
    eyebrow: 'The assistant',
    heading: 'Where the AI stops',
    items: [
      { title: 'It never calculates a number', text: 'The assistant answers questions about your own data, but the forecast and every figure come from tested code, not from the model.' },
      { title: 'Nothing changes without a yes', text: 'Any change it proposes waits on a card that shows each field until you confirm it. Deleting was left out on purpose.' },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'The screens',
    heading: 'From balances to a safe daily amount',
    items: [
      { image: 'louci-dashboard.png', title: 'Dashboard', description: 'Available money, upcoming bills and what is left to spend today.' },
      { image: 'louci-accounts.png', title: 'Accounts', description: 'Cash, Orange Money, MTN MoMo, bank and savings in one view.' },
      { image: 'louci-cash-flow.png', title: 'Cash flow', description: 'A 7, 30 and 90 day forecast that shows the lowest projected balance.' },
      { image: 'louci-assistant.png', title: 'The assistant', description: 'Answers questions about your own data. It never calculates a number or changes anything without a confirmation.' },
    ],
  },
];
const ciciStory = [
  {
    type: 'intro',
    eyebrow: 'Cici, 2026',
    heading: 'One list of what needs my attention',
    text: `Cici pulls what matters from my finance app, my estate app and the Loving Tech shop into a single list, and suggests what to do next. The first screen is a short list of urgent items instead of charts. I designed it and built it with AI-assisted development. ${DEMO}`,
  },
  {
    type: 'steps',
    eyebrow: 'How it works',
    heading: 'Detect, suggest, confirm, execute, audit',
    items: [
      { title: 'Detect', text: 'Rules spot things like overdue rent, orders ready for delivery, low stock or a budget limit.' },
      { title: 'Suggest', text: 'Each one becomes a task with a suggested action.' },
      { title: 'Confirm', text: 'Anything that carries a risk or a cost waits for my confirmation.' },
      { title: 'Execute', text: 'Once I confirm, Cici writes back to the app the task came from.' },
      { title: 'Audit', text: 'Every action is logged, with the state before and after.' },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'The screens',
    heading: 'From the list to the log',
    items: [
      { image: 'cici-01-plate.png', title: 'The Plate', description: 'Everything that needs attention, from my apps and my own tasks, in one list.' },
      { image: 'cici-03-cici-suggestions.png', title: 'Suggestions', description: 'Cici suggests actions based on rules, such as an overdue rent or low stock.' },
      { image: 'cici-04-suggestion-awaiting-confirm.png', title: 'Nothing happens until I say yes', description: 'A suggestion waits for my confirmation before anything changes.' },
      { image: 'cici-06-audit-what-cici-did.png', title: 'What Cici did', description: 'A plain-language log of every sync, suggestion and action.' },
    ],
  },
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
const atTheFair = {
  type: 'photos',
  heading: 'At the fairs',
  items: [{ image: 'paysika-fair-talk.webp', caption: 'At our stand, talking visitors through the PaySika app.' }],
};
const fieldStory = field.flatMap((b) => {
  if (b.heading === 'The app our agents used') return [];
  if (b.heading === 'Consent, scripts and reports') return [usabilitySession, b];
  if (b.heading === 'How a field visit went') return [b, atTheFair];
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
    // From article "How I Use Claude + Figma Make to Ship Mobile Screens Faster" and
    // article "AI in the loop, taste in the driver's seat".
    ai: {
      title: 'How I design with AI',
      lede: "I started working this way on the PaySika card feature, which touched the customer app, the back office and the riders' app at once, with a spec that needed a lot of rewriting first.",
      steps: [
        {
          title: 'Work out the decisions first',
          text: 'I go through the spec with Claude and list every open design question in a flow. For each one Claude suggests two or three options with its reasoning, and I make the call. I keep the answers in a decision log.',
        },
        {
          title: 'Check them in a rough HTML mockup',
          text: "Claude builds a quick HTML mockup of the whole flow, so I can see whether the decisions hold together on screen. On the card feature it showed that the rider needed to see the customer's name and date of birth after the check, to compare with their ID.",
        },
        {
          title: 'Generate the screens in Figma Make',
          text: 'I write each Figma Make prompt as the story of the flow, frame by frame, with our design tokens in it, so the screens come out on brand. The card back office alone took 17 prompts.',
        },
      ],
      notes: [
        {
          title: 'What I keep for myself',
          text: 'I sketch the layouts before AI sees anything, I make every decision, and I read everything it writes.',
        },
        {
          title: 'Where it falls short',
          text: 'It does not replace testing with real users. Requirements that arrive late still mean rework, and some prompts take two or three tries.',
        },
      ],
    },
    practice: [
      {
        title: 'Watching people use it',
        text: 'Our analytics showed where people dropped off but not why. The monthly field visits were how we found out.',
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
      'louci-finance': {
        title: 'Louci',
        side: 'Side project',
        field: [
          { label: 'Market', value: 'Cameroon, in XAF' },
          { label: 'Platforms', value: 'Web app, and an Android app that reads mobile-money SMS' },
          { label: 'Built with', value: 'AI-assisted development' },
        ],
      },
      'cici-command-center': {
        title: 'Cici',
        side: 'Side project',
        field: [
          { label: 'What', value: 'My finance, estate and shop apps in one list' },
          { label: 'Platforms', value: 'Web app and a mobile companion' },
          { label: 'Built with', value: 'AI-assisted development' },
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
  {
    entry_id: 'project:louci-finance',
    sort_order: 4,
    metadata: { period: '2026', image: 'louci-dashboard.png', content_blocks: louciStory },
  },
  {
    entry_id: 'project:cici-command-center',
    sort_order: 5,
    metadata: { period: '2026', image: 'cici-01-plate.png', content_blocks: ciciStory },
  },
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
