import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lovingTechBlocks } from './lovingtech-blocks.js';

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
  typeof v === 'string'
    ? clean(v)
    : Array.isArray(v)
      ? v.map(cleanDeep)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)]))
        : v;

const JOB_DESCRIPTION = fs.readFileSync(
  path.join(__dirname, '../../applications/sweed/job.md'),
  'utf8',
);

const company = {
  id: 'sweed',
  slug: 'sweed',
  name: 'Sweed',
  role: 'Product Owner (eCommerce)',
  job_url: 'https://sweedpos.com/#/',
  job_description: JOB_DESCRIPTION,
  layout: 'sweed-spec-sheet-v1',
  tagline: 'Product Owner and Product Manager focused on clear backlogs, operational tools, and flows that work on the ground.',
  hero_title: 'Ndouken Theryx',
  hero_subtitle:
    'I have spent the past four years owning digital products from rough idea to rollout. Most of that time was at PaySika, a neo-bank serving Cameroon and Gabon, where I ran the Shortcut backlog for mobile, web, and our internal operations tools. Earlier this year I also helped Loving Tech tighten their online store checkout, order tracking, and WhatsApp support.',
  philosophy_title: 'Most bugs start as an unanswered question.',
  philosophy_text:
    'Before a ticket reaches sprint planning, I map what happens when a payment hangs, a relay point closes, or a delivery skips a step. Writing those rules down early saves weeks of back-and-forth with engineering and QA.',
  intro_expanded_text:
    'At PaySika I worked daily with a 15-person team across engineering, design, QA, compliance, and operations, and later took on the Gabon launch and card logistics. Before that I managed a cross-border transfer build at CrowdRemit and ran multi-country research programs at GEFONA Digital Foundation. I work comfortably in both English and French.',
  badges: [
    'Product Ownership',
    'Shortcut & PRDs',
    'Payments & eCommerce',
    'Operations Tooling',
    'Mixpanel',
  ],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/file/d/1X9sS-padAOELU1LMV3r8hfPKDsdZ11mJ/view?usp=sharing',
    company_name: 'Sweed',
    role_target: 'Product Owner (eCommerce)',
    job_url: 'https://sweedpos.com/#/',
    now: 'Open to remote Product Owner & PM roles',
    metric_label: 'years shipping fintech & digital products',
  },
  about_content: {
    location: 'Douala, Cameroon',
    location_label: 'Douala, Cameroon (UTC+1)',
    languages: 'English and French',
    languages_label: 'Fluent in both',
    fun_fact: 'I value direct feedback, plain language, and watching real users before touching a spec.',
    education: [
      {
        degree: 'Masters in Engineering, Land Survey',
        school: 'National Advanced School of Public Works, Yaounde',
        period: 'Aug 2015 - Sep 2020',
      },
    ],
    skills: [
      'Backlog prioritization & roadmaps (Shortcut)',
      'PRDs, user stories & acceptance criteria',
      'Checkout, cart & order-tracking flows',
      'QA collaboration, bug triage & UAT',
      'Internal back-office & multi-city tooling',
      'Mixpanel & Google Analytics funnels',
      'Customer discovery & VOC tracking',
      'Regulated fintech & KYC flows',
    ],
    certifications: [
      { name: 'Google Project Management Certificate', meta: 'Completed 2 Nov 2026' },
      { name: 'Empathy in UX Design', meta: 'Feb 2020' },
      { name: 'Human-Product Interaction Design', meta: 'Feb 2020' },
    ],
    faqs: [
      {
        question: 'How do you run your backlog in Shortcut?',
        answer:
          'Everything goes into one prioritized backlog instead of scattered chats or side docs. Before a story enters a sprint, I write out the user flow, edge cases, and acceptance criteria so engineers and QA are testing against the same expectations.',
      },
      {
        question: 'How do you work with QA and operations during a release?',
        answer:
          'I review test scenarios with QA while features are still in flight, help triage bugs, and run UAT before launch. On the operations side, I prefer giving teams self-serve controls in the back office, like our multi-city fee and zone config at PaySika, so routine updates do not wait on a code deploy.',
      },
      {
        question: 'What changed your mind most after launching a feature?',
        answer:
          'At PaySika, Mixpanel showed people dropping off right after receiving their card, even though the app flow looked fine. Calling users and visiting pickup points showed the plain white envelope was arriving torn and had no activation steps inside. Fixing the sleeve and adding QR handover validation moved the needle more than another UI tweak.',
      },
      {
        question: 'Which languages do you work in?',
        answer:
          'English and French. I have written product specs, UI copy, and support playbooks in both languages across Cameroon and Gabon.',
      },
    ],
  },
  theme_config: {
    concept: 'spec-sheet',
    bg: '#F8F9FB',
    surface: '#FFFFFF',
    ink: '#0F172A',
    muted: '#526074',
    border: '#E2E6EE',
    accent: '#5B46F6',
    accent_text: '#4332C7',
    accent_soft: '#EEECFE',
    dark_bg: '#0F1420',
    dark_accent: '#9A8CFF',
  },
  seo: {
    title: 'Ndouken Theryx | Product Owner & Product Manager',
    description:
      'Product Owner and Product Manager building fintech, operations tooling, and eCommerce experiences across West and Central Africa.',
  },
};

const IMG = {
  ordering: 'https://res.cloudinary.com/duzedercz/image/upload/v1789530915/kvmciqxtxgjmy3ofyhxs.png',
  homeDelivery: 'https://res.cloudinary.com/duzedercz/image/upload/v1789530984/yjkbnsgaehonfiz8japv.png',
  relayQr: 'https://res.cloudinary.com/duzedercz/image/upload/v1789532584/kevdnzwpid0nqotsx38c.jpg',
  activation: 'https://res.cloudinary.com/duzedercz/image/upload/v1789531364/mjoi7juw2pfuywmeafup.png',
  ridersList: 'https://res.cloudinary.com/duzedercz/image/upload/v1789529537/glrqigcg6qhz79dqsqk6.png',
  relayStand: 'https://res.cloudinary.com/duzedercz/image/upload/v1789531743/pasd7qkl209hrk1gyej3.jpg',
};

const paysikaPmStory = [
  {
    type: 'intro',
    eyebrow: 'Product Management · Neo-bank',
    heading: 'One Shortcut backlog from rough idea to QA release',
    text: 'As PaySika grew, feature requests came in from Slack threads, compliance reviews, partner banks, and support chats. I moved everything into one prioritized backlog in Shortcut so the 15-person squad shared the same scope, edge cases, and release dates.',
  },
  {
    type: 'metrics',
    heading: 'Measured results',
    text: 'Tracked in Mixpanel and support logs after rolling out the updated onboarding and self-service flows.',
    items: [
      { value: '+40%', label: 'User retention lift', note: 'Driven by resumable KYC and clearer onboarding.' },
      { value: '-60%', label: 'Support ticket reduction', note: 'Turned recurring complaint trends into self-service fixes.' },
      { value: '15', label: 'Team members aligned', note: 'Engineering, design, QA, compliance, and operations.' },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'clipboard',
        title: 'Shortcut specs & scoping',
        text: 'Turned quarterly goals into epics, user stories, edge cases, and acceptance criteria before sprint planning.',
      },
      {
        icon: 'shield',
        title: 'QA & bank-rail releases',
        text: 'Reviewed test cases, triaged bugs, and ran UAT with QA across KYC, Visa card, and mobile-money flows.',
      },
      {
        icon: 'layers',
        title: 'Multi-city back office',
        text: 'Scoped internal tooling with 13 no-deploy parameters for pricing, delivery fees, discounts, and city coverage.',
      },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'Inside the work',
    heading: 'Specs, back-office rules, and field notes',
    items: [
      {
        image: 'paysika-design-requirements.png',
        title: 'Product requirements & edge cases',
        description: 'Acceptance criteria connecting KYC steps, fee rules, and dashboard status states.',
      },
      {
        image: 'paysika-design-docs.png',
        title: 'Team handoff docs',
        description: 'Shared spec and handoff standards keeping design, engineering, and QA aligned.',
      },
      {
        image: 'paysika-research-archive.png',
        title: 'Field & usability archive',
        description: 'Test scripts, session notes, and field reports feeding directly into backlog priorities.',
      },
    ],
  },
];

const lovingTechEcomBlocks = [
  {
    type: 'intro',
    eyebrow: 'eCommerce · Electronics retail',
    heading: 'From storefront to order tracking and WhatsApp support',
    text: 'Loving Tech sells electronics online in Cameroon. Over four months I mapped out the shopping and post-purchase experience: browsing the catalog, adding to the cart drawer, choosing online payment or pay-on-delivery after inspection, picking home delivery or relay pickup, and tracking every order with a status code backed by WhatsApp support.',
  },
  lovingTechBlocks[4], // Find, order, pay, track
  lovingTechBlocks[6], // From the shelf to the door
  lovingTechBlocks[5], // The last mile had no API
  lovingTechBlocks[2], // A message, a bot, then a human
  lovingTechBlocks[3], // The support system gallery
  lovingTechBlocks[7], // Handover
  lovingTechBlocks[8], // Stat cards
  lovingTechBlocks[9], // Closing richtext
];

const paysikaJourneyStory = [
  {
    type: 'intro',
    eyebrow: 'Ordering, operations & multi-market rollout',
    heading: 'Designing the ordering flow, internal back office, and Gabon expansion',
    text: 'Beyond the mobile app, I owned the physical card ordering and fulfillment experience end to end: fee transparency at checkout, an internal back-office tool enforcing strict order state transitions and multi-city parameters, an offline-ready app for 15 delivery riders, and adapting onboarding/KYC for the Gabon launch.',
  },
  {
    type: 'metrics',
    heading: 'Operational impact',
    items: [
      { value: '30 to 10', label: 'Minutes per card handover', note: 'Replaced paper forms with QR-code validation.' },
      { value: '13', label: 'No-deploy config parameters', note: 'Pricing, delivery fees, city/quarter coverage, and relay points.' },
      { value: '2', label: 'Markets shipped', note: 'Cameroon and Gabon sharing one core product with local rules.' },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'Fulfillment lifecycle',
    heading: 'Order, deliver, hand over, activate',
    items: [
      {
        title: 'Ordering & fee clarity',
        text: 'Delivery options, pricing, and expected timing appear together at checkout so nothing surprises the customer.',
        image: IMG.ordering,
      },
      {
        title: 'Home delivery & rider app',
        text: 'Delivery riders work from an offline-capable PWA displaying customer details and one-tap confirmation.',
        image: IMG.homeDelivery,
      },
      {
        title: 'Relay-point QR validation',
        text: 'QR validation records the handover instantly in the back office, cutting customer wait time from 30 minutes to 10.',
        image: IMG.relayQr,
      },
      {
        title: 'Activation & post-launch tracking',
        text: 'Mixpanel funnels and proactive follow-up calls caught drop-offs across onboarding, KYC, and card activation.',
        image: IMG.activation,
      },
    ],
  },
  {
    type: 'photos',
    heading: 'In the field & internal tooling',
    items: [
      { image: IMG.ridersList, caption: 'Order queue inside the internal delivery riders application.' },
      { image: IMG.relayStand, caption: 'Relay-point pickup stand in Douala where QR validation happens.' },
    ],
  },
  {
    type: 'compare',
    eyebrow: 'Post-launch iteration',
    heading: 'Fixing onboarding friction discovered in the field',
    left: {
      image: 'paysika-envelope-v1.jpg',
      label: 'Before',
      caption: 'Original white envelope arrived damaged and left first-time cardholders unsure how to use the card.',
    },
    right: {
      image: 'paysika-packaging-v2.jpg',
      label: 'After',
      caption: 'Redesigned mailer sleeve with clear activation and first-use steps printed inside.',
    },
  },
];

const now = new Date().toISOString();
const companyData = cleanDeep(company);

await sql`
  INSERT INTO companies (
    id, name, slug, is_active, role, job_description, job_url, status, layout,
    theme_config, seo, tagline, hero_title, hero_subtitle, philosophy_title,
    philosophy_text, intro_expanded_text, badges, social_links, about_content,
    created_at, updated_at
  ) VALUES (
    ${companyData.id}, ${companyData.name}, ${companyData.slug}, false, ${companyData.role},
    ${companyData.job_description}, ${companyData.job_url}, 'published', ${companyData.layout},
    ${JSON.stringify(companyData.theme_config)}, ${JSON.stringify(companyData.seo)},
    ${companyData.tagline}, ${companyData.hero_title}, ${companyData.hero_subtitle},
    ${companyData.philosophy_title}, ${companyData.philosophy_text}, ${companyData.intro_expanded_text},
    ${companyData.badges}, ${JSON.stringify(companyData.social_links)},
    ${JSON.stringify(companyData.about_content)}, ${now}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, slug = EXCLUDED.slug, is_active = EXCLUDED.is_active,
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
  SET application = ${JSON.stringify({ kind: 'application', stage: 'applied', fit_score: 92, applied_on: '2026-11-20' })}::jsonb
  WHERE id = ${companyData.id}`;

const links = [
  {
    entry_id: 'project:paysika_project-manager',
    sort_order: 0,
    metadata: {
      title: 'PaySika: Product & Backlog Delivery',
      tag: 'Product Management · Fintech',
      role: 'Product Manager',
      period: 'Dec 2021 - Aug 2026',
      image: 'paysika_mockup.png',
      tagline: 'Ran the Shortcut backlog, QA alignment, and multi-city back-office rules across Cameroon and Gabon.',
      description:
        'Owned the product backlog, specs, and release coordination for PaySika across mobile, web, and internal operations.',
      content_blocks: paysikaPmStory,
    },
  },
  {
    entry_id: 'project:lovingtech-cx',
    sort_order: 1,
    metadata: {
      title: 'Loving Tech',
      tag: 'eCommerce · Storefront & Support',
      role: 'Customer Success Consultant',
      period: 'Jan 2026 - Apr 2026',
      image: 'lovingtech-storefront.png',
      tagline: 'Storefront checkout, payment-on-delivery, order tracking, and WhatsApp support for a Cameroon electronics shop.',
      description:
        'Defined the shopping, checkout, and order-tracking journey alongside a WhatsApp support workflow.',
      content_blocks: lovingTechEcomBlocks,
    },
  },
  {
    entry_id: 'project:paysika_fintech',
    sort_order: 2,
    metadata: {
      title: 'PaySika Card Ordering & Gabon Launch',
      tag: 'Product & Operations · Multi-Market',
      role: 'Product Manager & UX Design Lead',
      period: 'Dec 2021 - Aug 2026',
      image: 'paysika_mockup.png',
      tagline: 'Card ordering, offline rider app, QR relay handover (30 to 10 min), and launching Gabon.',
      description:
        'Owned physical card ordering, delivery logistics, back-office state rules, and KYC localization for Gabon.',
      content_blocks: paysikaJourneyStory,
    },
  },
];

for (const l of links) {
  await sql`
    INSERT INTO company_entries (company_id, entry_id, sort_order, override_content, override_metadata, is_visible)
    VALUES (
      ${companyData.id}, ${l.entry_id}, ${l.sort_order},
      null,
      ${JSON.stringify(cleanDeep(l.metadata))}::jsonb,
      true
    )
    ON CONFLICT (company_id, entry_id) DO UPDATE SET
      sort_order = EXCLUDED.sort_order,
      override_content = EXCLUDED.override_content,
      override_metadata = EXCLUDED.override_metadata,
      is_visible = EXCLUDED.is_visible
  `;
}

const check = await sql`SELECT id, slug, name, is_active, layout FROM companies WHERE id = ${companyData.id}`;
const linkCount = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${companyData.id}`;
console.log('Company:', check[0]);
console.log(`Linked entries: ${linkCount[0].n}`);
