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
    resume: 'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs',
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

const shomiStory = [
  {
    type: 'intro',
    eyebrow: 'Shomi',
    heading: 'A product that was built, launched, and then stopped on purpose',
    text: 'I co-founded Kody and owned the product side of Shomi, exam practice for Cameroonian secondary-school students. With a two-person team and a $5,000 grant I ran the whole thing: discovery, backlog, launch, and the decision to stop.',
  },
  {
    type: 'photos',
    heading: 'Getting to know the students first',
    items: [
      {
        image: 'Untitled 1.png',
        caption: 'A research session with a student, working through the flow on a phone.',
      },
      {
        image: 'shomi_prexcel_classroom.png',
        caption: 'Students at the partner exam school who tested the product.',
      },
    ],
  },
  {
    type: 'gallery',
    heading: 'Prototypes and tests before any code',
    items: [
      {
        image: 'shomi_wireframes.png',
        title: 'Wireframes',
        description: 'The skeleton of the app, settled before any visual design started.',
      },
      {
        image: 'shomi_usability_testing.png',
        title: 'A finding worth acting on',
        description: 'Before and after the paper list, once testing showed the actions were hard to find.',
      },
      {
        image: 'Untitled 3.png',
        title: 'What students spent',
        description: 'One of the survey cuts that shaped the first backlog.',
      },
      {
        image: 'shomi_competitive_analysis.png',
        title: 'Other products',
        description: 'A board of similar products, used to work out where Shomi fit.',
      },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'file',
        title: 'A funded start',
        text: 'Won a $5,000 Tony Elumelu Foundation grant and spread the budget across the build.',
      },
      {
        icon: 'target',
        title: 'Saying no early',
        text: 'One platform, one audience, one real need. Two other ideas were dropped in the first month.',
      },
      {
        icon: 'shield',
        title: 'The sunset call',
        text: 'When retention showed the content model would not hold, I made the call to stop and wrote the post-mortem.',
      },
    ],
  },
  {
    type: 'quote',
    text: 'Can we keep this product fed sustainably at our team size? That question belonged in week one, not month six.',
    attribution: 'From the post-mortem',
    role: 'Shomi',
  },
  {
    type: 'richtext',
    markdown:
      'Shipping the MVP was the easy half. The harder lesson was that a product whose retention depends on a content stream you cannot afford is not a product yet, however well it is designed. I now ask the operational question while the scope is still being written.',
  },
];

const gefonaStory = [
  {
    type: 'intro',
    eyebrow: 'GEFONA',
    heading: 'Keeping research, communications and money on one timeline',
    text: 'At the GEFONA Digital Foundation I ran delivery between research, communications and finance, in a small non-profit where a dropped ball is expensive. I owned the timelines, the reporting and the finance records.',
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'route',
        title: 'One timeline',
        text: 'A research milestone, its announcement and its budget line moved together instead of surprising each other.',
      },
      {
        icon: 'message',
        title: 'A steady rhythm',
        text: 'Stakeholders and funders got current numbers on a fixed schedule, without having to chase status.',
      },
      {
        icon: 'file',
        title: 'Books you can audit',
        text: 'Budgeting and tracking kept clean enough to report against at any time.',
      },
    ],
  },
  {
    type: 'steps',
    heading: 'How I kept three teams aligned',
    items: [
      {
        title: 'Sequence the work in public',
        text: 'Work across contributors was ordered on one timeline, with status reported to stakeholders and funders.',
      },
      {
        title: 'Write for the audience',
        text: 'Communications ran on the same rhythm as the research, so announcements matched the evidence.',
      },
      {
        title: 'Make the budget readable',
        text: 'Finance tracking stayed tied to funder lines, so decisions were made on real numbers.',
      },
    ],
  },
  {
    type: 'gallery',
    heading: 'What the programmes produced',
    items: [
      {
        image: 'campaign-proposal.png',
        title: 'Sponsorship proposal',
        description: 'A bilingual campaign deck, from the problem to what partners get out of it.',
      },
      {
        image: 'onboarding-deck.png',
        title: 'Onboarding deck',
        description: 'The deck used to bring in new contributors and partners.',
      },
      {
        image: 'content-archive.png',
        title: 'Content archive',
        description: 'Posts, campaign frames and articles, kept in one place so the voice stayed consistent.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'In a small non-profit, communications and finance are not overhead, they are part of the delivery. Keeping them on the same timeline as the research is what stopped the surprises.',
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
    entry_id: 'project:crowdremit_fintech',
    sort_order: 1,
    metadata: {
      content_blocks: crowdremitStory,
      tagline: 'We talked to people before we drew anything.',
      description:
        'As UX Researcher and Product Designer I designed the whole CrowdRemit experience across iOS, Android, the web app and the admin dashboard, plus the marketing site, and built the design system the engineering team implemented from.',
    },
  },
  {
    entry_id: 'project:shomi_default',
    sort_order: 2,
    metadata: {
      content_blocks: shomiStory,
      tagline: 'A product taken from discovery to launch, and then stopped on purpose.',
      description:
        'Co-founder of Kody and product owner on Shomi, exam practice for Cameroonian secondary-school students. With a two-person team and a $5,000 grant I owned the full build: discovery, backlog, launch, and the decision to stop.',
    },
  },
  {
    entry_id: 'project:gefona_project-manager',
    sort_order: 3,
    metadata: {
      content_blocks: gefonaStory,
      image: 'gefona_logo.png',
      tagline: 'Programme delivery across research, communications and finance.',
      description:
        'At the GEFONA Digital Foundation I ran delivery between research, communications and finance, owning the timelines, the reporting and the finance records.',
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

const check = await sql`SELECT id, slug, name, is_active, layout FROM companies WHERE id = ${companyData.id}`;
const linkCount = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${companyData.id}`;
console.log('Company:', check[0]);
console.log(`Linked entries: ${linkCount[0].n}`);
