// Company site /c/wave: Product Designer (Remote) application (Wave).
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

const JOB_DESCRIPTION = fs.readFileSync(path.join(__dirname, '../../applications/wave/job.md'), 'utf8');

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
const field = await blocksOf('project:paysika-field');

// ── 1. PaySika: consumer mobile app, KYC, cards, back office, and design system ──
const outcomes = structuredClone(paysika.find((b) => b.type === 'stat-cards'));
outcomes.cards = outcomes.cards.filter((c) => c.title !== 'Design team lead');
const leak = byHeading(paysika, 'Where the funnel was leaking');
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
const backOffice = {
  type: 'gallery',
  eyebrow: 'Back office',
  heading: 'The tools behind the app',
  text: 'I also designed the back office the team worked in. Identity checks arrived in a backlog that operators could search and filter, and each request opened on the same sections as the app, with a box to tick once a section had been checked. When we soft-launched in Gabon, marketing used it to hand out access codes gradually, in controlled numbers.',
  items: [
    { image: 'paysika-bo-kyc-review.webp', title: 'Identity check backlog', description: 'Requests filtered by status, minors and date, with the personal details next to the ID document. The data and passport are samples.' },
    { image: 'paysika-bo-access-codes.webp', title: 'Access codes for the Gabon soft launch', description: 'Marketing created each code with a volume: the number of people who could use it, 450 for the active one. Past codes show whether they are active or expired.' },
  ],
};
const pickup = byHeading(paysika, 'The pickup code');
pickup.text = 'At the relay point, customers scanned a QR code with the PaySika app. It brought up their pickup code and details, so they could show they had ordered the card.';
const twoMarkets = byHeading(paysika, 'One product, two sets of rules');
const behind = byHeading(paysika, 'The work behind the screens');
const system = byHeading(paysika, 'One design system, every surface');
system.eyebrow = 'Design system';
system.text =
  'Colour, type, components, card states, icons, illustrations and motion (using Rive, Figma motion and Lottie) lived in one Figma library, as semantic tokens with the same names developers used in code. I documented each component with do and don\'t notes and reviewed builds so nothing drifted between Figma and production.';
const trust = byHeading(paysika, 'Trust is designed one screen at a time');

const customerStory = [
  {
    type: 'intro',
    eyebrow: 'PaySika, 2021 to 2026',
    heading: 'A bank app for people new to banking',
    text: 'For nearly five years I led UX at PaySika, from the first version to a multi-product bank app serving thousands of people in Cameroon and Gabon. Many of them were holding a card for the first time. This case focuses on the consumer mobile experience: onboarding, guided-camera KYC, transactions, the back office and the design system.',
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

// ── 2. PaySika delivery riders' app ──
const RIDER_PHOTO = { image: 'paysika-rider-app.webp', caption: 'One of our riders going through the app.' };
const ridersStory = riders.map((b) =>
  b.type === 'photos' && b.heading === 'The app our riders used'
    ? { ...b, items: [RIDER_PHOTO, ...b.items.filter((i) => i.image !== RIDER_PHOTO.image)] }
    : b,
);

// ── 3. PaySika in the field ──
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

const company = {
  id: 'wave',
  slug: 'wave',
  name: 'Wave',
  role: 'Product Designer',
  job_url: 'https://www.wave.com/en/careers/',
  job_description: JOB_DESCRIPTION,
  layout: 'ledger-v1',
  tagline: 'Product designer from Cameroon.',
  hero_title: "I'm Ndouken, a product designer in Douala. I design mobile money and fintech flows people can trust on the first tap.",
  hero_subtitle:
    'I led UX at PaySika across Cameroon and Gabon, designing consumer mobile flows, a field riders app and our semantic design system. I prototype Android apps with Claude and Expo, animate with Rive, Figma motion and Lottie, and work in English and French.',
  philosophy_title: 'How I work on mobile',
  philosophy_text: '',
  intro_expanded_text: [
    'For nearly five years at PaySika I worked on the mobile app from its first version to a multi-product neobank in Cameroon and Gabon: onboarding, guided-camera KYC, card activation, back-office tools and the design system. I also designed the delivery riders app for cheap Android phones and weak connections, and spent the last Friday of every month in the field watching real users.',
    'Before PaySika I was UX researcher and product designer at CrowdRemit, a cross-border money transfer product, and product designer at Kody (Shomi), an exam-prep app funded by a Tony Elumelu Foundation grant. I also co-maintained Jobsika, an open-source job board in Cameroon.',
  ].join('\n\n'),
  badges: [],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/file/d/1eilbUVOuof7vj9V-FusFyccTjcQQkr3K/view?usp=drivesdk',
    role_line: 'Product designer',
  },
  about_content: {
    lede: "I'm a product designer based in Douala, Cameroon, working fluently in English and French. Most of my career has focused on consumer mobile apps and fintech.",
    location: 'Douala, Cameroon',
    languages: 'English and French',
    tools: [
      { label: 'Design', items: ['Figma', 'Figma Make', 'Material Design', 'Apple HIG'] },
      { label: 'Motion', items: ['Rive', 'Figma motion', 'Lottie'] },
      { label: 'AI & Prototyping', items: ['Claude', 'Expo Android APKs', 'Figma Make'] },
      { label: 'Data & Code', items: ['Mixpanel', 'HTML', 'CSS', 'React'] },
    ],
    experience: [
      { role: 'UX Design Lead (founding-team member)', org: 'PaySika', place: 'Douala, Cameroon', period: 'Dec 2021 - Aug 2026' },
      { role: 'Customer Success Consultant', org: 'Loving Tech', place: 'Douala, Cameroon', period: 'Jan 2026 - Apr 2026' },
      { role: 'Senior UI/UX Consultant (part-time)', org: 'Matanga Agency', place: 'Remote', period: 'Dec 2023 - Feb 2024' },
      { role: 'Co-maintainer and Design Lead', org: 'Jobsika, OSS Cameroon', place: 'Cameroon', period: '2022 - 2024' },
      { role: 'UX Researcher and Product Designer', org: 'CrowdRemit', place: 'Remote', period: 'Jan 2021 - Jun 2021' },
      { role: 'Product Designer', org: 'Kody (Shomi)', place: 'Cameroon', period: 'Dec 2019 - Dec 2020' },
    ],
    skills: [
      'Mobile product design (Android and iOS)',
      'Prototyping with Claude and Expo APKs',
      'Figma systems and semantic tokens',
      'Rive, Figma motion and Lottie',
      'Field research and usability testing',
      'Product analytics (Mixpanel)',
      'Service and journey design',
      'Bilingual EN/FR UX copy',
    ],
    education: [
      { degree: 'Masters in Engineering, Land Survey', school: 'National Advanced School of Public Works, Yaounde', period: 'Aug 2015 - Sep 2020' },
    ],
    certifications: [
      { name: 'Google Project Management Certificate', meta: 'In progress, since Aug 2026' },
      { name: 'Visual Elements of User Interface Design', meta: 'California Institute of the Arts, Mar 2020' },
      { name: 'Empathy in UX Design', meta: 'Feb 2020' },
      { name: 'Human-Product Interaction Design', meta: 'Feb 2020' },
    ],
    faqs: [
      {
        question: 'How do you prototype mobile flows with LLMs?',
        answer: 'I use Claude alongside Figma Make to pressure-test flow decisions in HTML first, then build and test installable Android APK prototypes with Claude and Expo so I can check real device behaviour before engineering builds.',
      },
      {
        question: 'How did you handle motion and illustration?',
        answer: 'At PaySika I did icon animations, illustration animations and video editing using Rive, Figma motion and Lottie, alongside the motion designer our team later hired.',
      },
    ],
  },
  theme_config: {
    concept: 'ledger',
    bg: '#F6F4EF',
    surface: '#FFFFFF',
    ink: '#161514',
    muted: '#5D5953',
    rule: '#E2DDD4',
    accent: '#C84B31',
    accent_soft: '#F7E3DC',
    dark_bg: '#131211',
    dark_accent: '#E87A64',
    work_title: 'Selected work',
    practice: [
      {
        title: 'Watch real people first',
        text: 'Mixpanel showed where users dropped off; monthly field visits in Douala and Yaounde fairs showed why.',
      },
      {
        title: 'Prototype on real Android hardware',
        text: 'I pair Figma Make with Claude and Expo Android APKs so flows are tested on real phones before engineering.',
      },
      {
        title: 'Keep one token language',
        text: 'Semantic tokens in Figma match CSS and code variables, paired with PR reviews so shipped screens stay crisp.',
      },
      {
        title: 'Motion with purpose',
        text: 'I build icon and illustration animations in Rive, Figma motion and Lottie to clarify state changes and feedback.',
      },
    ],
    ai: {
      title: 'Prototyping with Claude and Expo',
      lede: 'How I move from messy product specs to Figma Make screens and installable Android APK prototypes.',
      steps: [
        {
          title: 'Lock decisions before screens',
          text: 'I review specs with Claude to surface edge cases and tradeoffs, keeping an explicit decision log before opening Figma.',
        },
        {
          title: 'Test flows in Figma Make and HTML',
          text: 'I prompt Figma Make frame by frame using our semantic design tokens, and check multi-step journeys in quick prototypes.',
        },
        {
          title: 'Verify on Android APKs via Expo',
          text: 'For personal apps like Louci and Cici, I prototype and build Android APK builds with Claude and Expo to test real-device ergonomics.',
        },
      ],
      notes: [
        {
          title: 'What stays human',
          text: 'I sketch layouts by hand before AI sees anything, own every interaction call, and edit every line of copy.',
        },
        {
          title: 'What I verify with users',
          text: 'Prototypes never replace field observation or usability scripts with real customers on patchy networks.',
        },
      ],
    },
    projects: {
      paysika_fintech: {
        title: 'PaySika',
        side: 'Consumer fintech',
        receipt: [
          { label: 'Markets', value: 'Cameroon and Gabon' },
          { label: 'Surfaces', value: 'Android, iOS, Back office' },
          { label: 'Outcome', value: '+40% retention, -60% tickets' },
        ],
      },
      'paysika-riders-app': {
        side: 'Field Android PWA',
        receipt: [
          { label: 'Device', value: 'Cheap Android phones' },
          { label: 'Network', value: 'Offline QR + online sync' },
          { label: 'Outcome', value: '30 to 10 min handover' },
        ],
      },
      'paysika-field': {
        side: 'Field research',
        receipt: [
          { label: 'Cadence', value: 'Last Friday monthly' },
          { label: 'Methods', value: 'Usability scripts & fairs' },
          { label: 'Outcome', value: 'Card sleeve v2 & QR flow' },
        ],
      },
      'ai-side-projects': {
        side: 'Claude & Expo APKs',
        receipt: [
          { label: 'Stack', value: 'Claude, Expo, React' },
          { label: 'Build', value: 'Android APK prototypes' },
          { label: 'Focus', value: 'XAF finance & ops' },
        ],
      },
    },
  },
  seo: {
    title: 'Ndouken Theryx, product designer',
    description: 'Mobile product design portfolio of Ndouken Theryx: fintech, field research, design systems and Android prototyping.',
  },
};

const ROLE = 'Product Designer';

const links = [
  {
    entry_id: 'project:paysika_fintech',
    sort_order: 0,
    metadata: {
      tag: 'Fintech',
      tagline: 'A bank app in Cameroon and Gabon, for people who were often getting their first card.',
      role: 'UX Design Lead',
      period: 'Dec 2021 - Aug 2026',
      location: 'Douala, Cameroon',
      content_blocks: customerStory,
    },
  },
  {
    entry_id: 'project:paysika-riders-app',
    sort_order: 1,
    metadata: {
      role: 'UX Design Lead',
      tagline: 'The app our delivery riders used to get new orders and find customers, on cheap phones with weak connections.',
      image: 'paysika-rider-app.webp',
      content_blocks: ridersStory,
    },
  },
  {
    entry_id: 'project:paysika-field',
    sort_order: 2,
    metadata: { role: 'UX Design Lead', content_blocks: fieldStory },
  },
  {
    entry_id: 'project:ai-side-projects',
    sort_order: 3,
    metadata: { role: ROLE },
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
  SET application = ${JSON.stringify({ kind: 'application', stage: 'ready', fit_score: 100 })}::jsonb
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

await sql`
  DELETE FROM company_entries
  WHERE company_id = ${c.id} AND NOT (entry_id = ANY(${links.map((l) => l.entry_id)}))
`;

const check = await sql`SELECT id, slug, is_active, layout, application FROM companies WHERE id = ${c.id}`;
const count = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${c.id}`;
console.log('Company:', check[0]);
console.log('Linked entries:', count[0].n);
