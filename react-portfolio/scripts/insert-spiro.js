import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lovingTechBlocks } from './lovingtech-blocks.js';
import { gefonaStory } from './gefona-blocks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

// No em dashes or en dashes anywhere. Collapse them to a plain hyphen.
const clean = (s) => (s == null ? s : String(s).replace(/[\u2013\u2014]/g, '-'));
const cleanDeep = (v) =>
  typeof v === 'string' ? clean(v)
    : Array.isArray(v) ? v.map(cleanDeep)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)]))
    : v;

const JOB_DESCRIPTION = `Design end-to-end customer journeys and experiences across every touchpoint, physical (swap stations), digital, and human, ensuring the experience is intentional as the business scales.
Map and design customer journeys across the lifecycle: acquisition, onboarding, swap/service usage, support, retention.
Capture the as-is journeys and design journeys that match customer expectations and business value.
Identify friction points and design solutions with Service Excellence, Operations and Product.
Own the design of customer-facing processes, scripts, and self-service experiences across channels.
Lead human-centred design initiatives using VOC and insights data.
Prototype and test new experience concepts before wider rollout across countries.
Run workshops with varied teams for awareness, knowledge, capability development and buy-in.
Ensure design consistency and localisation balance across the country footprint.
Co-create with Product and Tech on App, IVR, and digital touchpoint design where CX is impacted.
Partner with the CX Digital and AI lead and country teams on change management and adoption.
Ensure adoption improves customer experience and cost-to-serve, with clear success metrics tied to the Analytics KPI framework.
Fluency in English and French is required.`;

// Neutral portfolio copy. Plain, human sentences. No tailoring language, no em dashes.
const company = {
  id: 'spiro',
  slug: 'spiro',
  name: 'Spiro',
  role: 'Global Customer Experience Lead',
  job_url: 'https://www.spiro.net',
  job_description: JOB_DESCRIPTION,
  layout: 'spiro-portfolio-v1',
  tagline: 'UX Design Lead. I design the product and the parts around it, from the app to the field.',
  hero_title: 'Ndouken Theryx',
  hero_subtitle:
    'I am a UX Design Lead. For four years I designed PaySika, an African neo-bank, from the first screen to the card people pick up at a relay point. I like the messy half of the work: delivery, support, and the small decisions that make a product feel safe to use.',
  philosophy_title: 'A flow that only works on a good day is not finished.',
  philosophy_text:
    'Most of the problems I have fixed were not visual. A camera step failed on cheap Android phones, so people gave up on sign-up. A handover took half an hour because of a paper form. I start by watching how something is actually used, then change the thing that causes the problem.',
  intro_expanded_text:
    'I have spent the last few years designing fintech in Cameroon, mostly at PaySika. I built the design team there, owned the mobile and web product, and later took on the physical card: ordering, delivery, pickup and activation. Before that I co-founded an education product and designed a cross-border money transfer app. I work in English and French, and I try to stay close to the people who use what I make.',
  badges: ['UX design', 'Product design', 'User research', 'Design systems'],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/open?id=1YaPoFPM99oGFvA4fChx-QOSarJ2GGHI_&usp=drive_fs',
    company_name: 'Spiro',
    role_target: 'Global Customer Experience Lead',
    job_url: 'https://www.spiro.net',
    now: 'Open to UX design roles',
    metric_label: 'years designing fintech products',
  },
  about_content: {
    location: 'Douala, Cameroon',
    location_label: 'Douala, Cameroon',
    languages: 'English and French',
    languages_label: 'Bilingual, fully fluent',
    fun_fact: 'I value direct opinions, simple language, and a good plate of fish.',
    education: [
      {
        degree: 'Masters in Engineering, Land Survey',
        school: 'National Advanced School of Public Works',
        period: '08.2015 - 09.2020',
      },
    ],
    skills: [
      'Product, interaction design',
      'Design system',
      'User research, usability testing',
      'User journey map',
      'Brand identity and marketing',
      'Spec writing and refinement',
      'Product analysis',
      'AI assisted development (Claude, Gemini)',
    ],
    certifications: [
      { name: 'Google PMP Certification', meta: 'In progress, since August 2026' },
      { name: 'Empathy in UX Design', meta: 'Issued February 2020' },
      { name: 'Graphic Design Foundations: Typography', meta: 'Issued February 2020' },
      { name: 'Human-Product Interaction Design', meta: 'Issued February 2020' },
      { name: 'Fundamentals of Digital Marketing', meta: 'Issued October 2019' },
      { name: 'Growth-Driven Design Certification', meta: 'Issued February 2020' },
    ],
    faqs: [
      {
        question: 'How do you start a new project?',
        answer:
          'By watching people use the current one, if there is one. Support tickets, interviews, and time with the team that runs it. The first problem I hear is usually not the real one, so I try not to jump straight to a fix.',
      },
      {
        question: 'How do you work with engineering and operations?',
        answer:
          'I keep one shared picture of what we are changing and why, and I write down the details engineers need before they start. Operations usually knows where things break, so I bring them in early instead of handing them a finished design.',
      },
      {
        question: 'Which languages do you work in?',
        answer:
          'English and French. I have written product copy, support replies and campaign text in both, and I check that a screen reads the same way in each.',
      },
    ],
  },
  theme_config: {
    concept: 'loop',
    accent: '#1b3a6b',
    accent_text: '#152c50',
    paper: '#f2f0e9',
    ink: '#12150f',
  },
  seo: {
    title: 'Ndouken Theryx, UX Design Lead',
    description:
      'UX Design Lead working on fintech products, design systems and the field work around them.',
  },
};

// Cloudinary stills from the PaySika card service (real assets).
const IMG = {
  ordering: 'https://res.cloudinary.com/duzedercz/image/upload/v1789530915/kvmciqxtxgjmy3ofyhxs.png',
  homeDelivery: 'https://res.cloudinary.com/duzedercz/image/upload/v1789530984/yjkbnsgaehonfiz8japv.png',
  relayQr: 'https://res.cloudinary.com/duzedercz/image/upload/v1789532584/kevdnzwpid0nqotsx38c.jpg',
  activation: 'https://res.cloudinary.com/duzedercz/image/upload/v1789531364/mjoi7juw2pfuywmeafup.png',
};

// ── Per-project stories. Each project gets its own block sequence, so no two
// read the same. Built only from facts already in the warehouse. ──

const paysikaStory = [
  {
    type: 'intro',
    eyebrow: 'PaySika',
    heading: 'The card that leaves the app',
    text: 'I led design at PaySika for four years, from the first version to a bank with several products. I designed the app, the internal tools and the physical card people collect at a relay point. I measured the work the way the business did: whether people stayed, how many asked for help, and how long they waited.',
  },
  {
    type: 'metrics',
    heading: 'What changed',
    text: 'Three numbers moved after the redesign.',
    items: [
      { value: '40%', label: 'more people stayed', note: 'Tracked in Mixpanel against the old sign-up and KYC flow.' },
      { value: '60%', label: 'fewer support tickets', note: 'Most of the drop came from screens that now explain themselves.' },
      { value: '30 to 10', label: 'minutes to hand over a card', note: 'We replaced the paper form with a QR code.' },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'The card, step by step',
    heading: 'Order, deliver, hand over, activate',
    text: 'Four moments, and only one of them happens in the app.',
    items: [
      {
        title: 'Ordering',
        text: 'The delivery choice, the fee and the timing sit on the same screen, so nothing about the card is a surprise later.',
        image: IMG.ordering,
      },
      {
        title: 'Home delivery',
        text: 'Our agents worked from an app I designed: the order, the customer, the address, and one button to confirm.',
        image: IMG.homeDelivery,
      },
      {
        title: 'Relay-point pickup',
        text: 'A QR code records the handover the moment it happens. The wait dropped from 30 minutes to 10.',
        image: IMG.relayQr,
      },
      {
        title: 'Activation',
        text: 'Back in the app the card goes live, with the controls to block it, replace it or use it abroad.',
        image: IMG.activation,
      },
    ],
  },
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
  {
    type: 'two-col',
    heading: 'One app, two countries',
    imageSide: 'left',
    image: 'paysika-design-requirements.png',
    caption: 'Part of the requirements set for the dashboard, branding, KYC and fees work.',
    markdown:
      'When PaySika opened in Gabon, KYC in Cameroon was not KYC in Gabon. Different documents, different checks, different rules from the partner bank. I redesigned the flow for the mobile app and the back office so we kept one product with a local sign-up, instead of two apps that slowly drift apart.',
  },
  {
    type: 'gallery',
    eyebrow: 'Behind the work',
    heading: 'What held it together',
    items: [
      {
        image: 'design-system.png',
        title: 'One design system',
        description: 'Tokens, components and text styles in Figma, used by every PaySika screen.',
      },
      {
        image: 'card-states.png',
        title: 'Card states',
        description: 'Every physical and virtual card state, active, locked, expired or inactive, drawn once and reused.',
      },
      {
        image: 'icon-library.png',
        title: 'Icons',
        description: 'One icon set for card settings, mobile money and bank partners, so the product reads the same everywhere.',
      },
      {
        image: 'illustration-library.png',
        title: 'Illustrations',
        description: 'Drawings for sign-up, KYC, empty screens and success moments.',
      },
      {
        image: 'paysika-research-archive.png',
        title: 'Testing notes',
        description: 'The consent forms, scripts and reports from the sessions that drove the redesign.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'The changes that moved the numbers were small. Every screen said what something cost, why we needed an input, and what had just happened. A calm confirmation and a scary error screen do different jobs, but they answer the same question: is my money safe here?',
  },
];

const crowdremitStory = [
  {
    type: 'intro',
    eyebrow: 'CrowdRemit',
    heading: 'We talked to people before we drew anything',
    text: 'CrowdRemit let people send money between countries with clear fees. Before any screen was designed I wanted to know how a transfer really happens, what people trust, and what they check twice. That research shaped the whole app.',
  },
  {
    type: 'gallery',
    eyebrow: 'First',
    heading: 'What we heard from people',
    items: [
      {
        image: 'crowdremit_user_interviews.png',
        title: 'Interviews',
        description: 'Remote sessions with senders and recipients, about how transfers actually happen.',
      },
      {
        image: 'crowdremit_journey_map.png',
        title: 'The map',
        description: 'Every step from wanting to send money to the confirmation that it arrived, and the worry in between.',
      },
      {
        image: 'crowdremit_user_stories.png',
        title: 'User stories',
        description: 'What we heard, turned into scenarios the team could design against.',
      },
    ],
  },
  {
    type: 'compare',
    eyebrow: 'Accessibility',
    heading: 'A contrast test made us rebrand',
    left: {
      label: 'The problem',
      image: 'crowdremit_error_page_contrast.png',
      caption: 'The original error and network screens, next to the accessible version.',
    },
    right: {
      label: 'The new brand',
      image: 'crowdremit_brand_guidelines.png',
      caption: 'The new palette and type, written down so product and marketing stayed consistent.',
    },
  },
  {
    type: 'gallery',
    eyebrow: 'What we shipped',
    heading: 'The system and the screens',
    items: [
      {
        image: 'crowdremit_design_system.png',
        title: 'Design system',
        description: 'Tokens, components and UI kits, so four different surfaces looked like one product.',
      },
      {
        image: 'crowdremit_receiving_money.png',
        title: 'Send money',
        description: 'The amount received is the main input, with fees and rate on the same screen.',
      },
      {
        image: 'crowdremit_wireframe_screens.png',
        title: 'Wireframes',
        description: 'We settled the structure before colour or copy could get in the way.',
      },
      {
        image: 'crowdremit_landing_page.png',
        title: 'Website',
        description: 'The public landing page, with the same look as the product.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'The idea that shaped the flow was simple. People care about the amount that lands, not the exchange rate. Once the amount received became the main input, the rest of the screen had a clear job and the fees stopped feeling hidden.',
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

const links = [
  {
    entry_id: 'project:paysika_fintech',
    sort_order: 0,
    metadata: {
      content_blocks: paysikaStory,
      tagline: 'The card that leaves the app.',
      description:
        'As UX Design Lead and a founding-team member I led design at PaySika from the first version to a multi-product bank. I owned the mobile and web product, then the physical card: ordering, home delivery, relay-point pickup and activation.',
    },
  },
  {
    entry_id: 'project:lovingtech-cx',
    sort_order: 1,
    metadata: {
      content_blocks: lovingTechBlocks,
      tagline: 'An internal support system and an order journey that run on WhatsApp.',
      description:
        'For four months I worked as a customer success consultant at Loving Tech, an online tech shop in Cameroon. I designed a WhatsApp support system with a bot and a bank of prepared answers that escalates to the right team, and the order journey from product discovery and cart to payment on delivery and order tracking.',
    },
  },
  {
    entry_id: 'project:crowdremit_fintech',
    sort_order: 2,
    metadata: {
      content_blocks: crowdremitStory,
      tagline: 'We talked to people before we drew anything.',
      description:
        'As UX Researcher and Product Designer I designed the whole CrowdRemit experience across iOS, Android, the web app and the admin dashboard, plus the marketing site, and built the design system the engineering team implemented from.',
    },
  },
  {
    entry_id: 'project:gefona_project-manager',
    sort_order: 3,
    metadata: {
      content_blocks: gefonaStory,
      image: 'gefona-reports.png',
      tagline: 'Programme delivery across research, communications and finance.',
      description:
        'At the GEFONA Digital Foundation I ran delivery between research, communications and finance, and led the research itself: the 2020 report on application security in Cameroon and the 2021 edition across West and Central Africa.',
    },
  },
];

for (const l of links) {
  await sql`
    INSERT INTO company_entries (company_id, entry_id, sort_order, override_content, override_metadata, is_visible)
    VALUES (
      ${companyData.id}, ${l.entry_id}, ${l.sort_order},
      null,
      ${l.metadata ? JSON.stringify(cleanDeep(l.metadata)) : null}::jsonb,
      true
    )
    ON CONFLICT (company_id, entry_id) DO UPDATE SET
      sort_order = EXCLUDED.sort_order,
      override_content = EXCLUDED.override_content,
      override_metadata = EXCLUDED.override_metadata,
      is_visible = EXCLUDED.is_visible
  `;
}

// The profile has no blog section, so drop any article links for this company.
const removed = await sql`
  DELETE FROM company_entries
  WHERE company_id = ${companyData.id} AND entry_id LIKE 'article:%'
  RETURNING entry_id`;
console.log('Removed article links:', removed.map((r) => r.entry_id));

// Shomi was removed from this profile.
const removedShomi = await sql`
  DELETE FROM company_entries
  WHERE company_id = ${companyData.id} AND entry_id = 'project:shomi_default'
  RETURNING entry_id`;
console.log('Removed shomi link:', removedShomi.map((r) => r.entry_id));

const check = await sql`SELECT id, slug, name, is_active, layout FROM companies WHERE id = ${companyData.id}`;
const linkCount = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${companyData.id}`;
console.log('Company:', check[0]);
console.log(`Linked entries: ${linkCount[0].n}`);
