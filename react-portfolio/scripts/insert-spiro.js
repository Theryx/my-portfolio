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

// Neutral portfolio copy. No tailoring language, no em dashes.
const company = {
  id: 'spiro',
  slug: 'spiro',
  name: 'Spiro',
  role: 'Global Customer Experience Lead',
  job_url: 'https://www.spiro.net',
  job_description: JOB_DESCRIPTION,
  layout: 'spiro-portfolio-v1',
  tagline: 'Experience and service design across digital, physical and human touchpoints.',
  hero_title: 'Ndouken Theryx',
  hero_subtitle:
    'I design experiences end to end: the digital screens, the physical moments and the people in between. Most of that work has been at PaySika, an African neo-bank, where I mapped and rebuilt a card journey that runs from the app to a relay point.',
  philosophy_title: 'A journey is only real if it holds up in the field.',
  philosophy_text:
    'The best journeys are decided in the details: what a screen promises, what a person at a counter can actually do, and what happens when the network drops. I design with the field in the room, because that is where the friction shows up.',
  intro_expanded_text:
    'I have spent the last years designing fintech experiences in Cameroon, from the first tap in an app to a card handed over at a relay point. I map the journey as it is, find where it leaks, and design the fix with the teams who run it. I work in English and French, and I like staying close to the people who use what we ship.',
  badges: ['Journey mapping', 'Service design', 'Research and insights', 'Multi-market delivery'],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs',
    company_name: 'Spiro',
    role_target: 'Global Customer Experience Lead',
    job_url: 'https://www.spiro.net',
    now: 'Open to experience and service design roles',
    metric_label: 'years designing services across digital and field touchpoints',
  },
  about_content: {
    location: 'Douala, Cameroon',
    location_label: 'Douala, Cameroon',
    languages: 'English and French',
    languages_label: 'Bilingual, fully fluent',
    fun_fact: 'I value direct opinions, simple language, and a good plate of fish.',
    faqs: [
      {
        question: 'How do you map a journey?',
        answer:
          'I start with the as-is: interviews, support tickets and time with the people who run the service. Then I put the steps on one page, mark where it leaks, and take the map back to the teams who own each step. The map only matters if it changes a decision.',
      },
      {
        question: 'How do you work with operations and product?',
        answer:
          'Operations knows where the journey breaks and product knows what can ship. I sit between them, turn the friction into a clear problem, and keep one shared view of the fix so nobody is working from a different version.',
      },
      {
        question: 'Which languages do you work in?',
        answer:
          'Both French and English. I have written product copy, support content and campaigns in each, and I check that a journey reads the same way in both.',
      },
    ],
  },
  theme_config: {
    concept: 'loop',
    accent: '#0f7a3d',
    accent_text: '#0b6b34',
    paper: '#f2f0e9',
    ink: '#12150f',
  },
  seo: {
    title: 'Ndouken Theryx, experience and service design',
    description:
      'Experience and service designer working on journeys, field operations and multi-market delivery.',
  },
};

// Cloudinary stills from the PaySika card service (real assets).
const IMG = {
  ordering: 'https://res.cloudinary.com/duzedercz/image/upload/v1789530915/kvmciqxtxgjmy3ofyhxs.png',
  homeDelivery: 'https://res.cloudinary.com/duzedercz/image/upload/v1789530984/yjkbnsgaehonfiz8japv.png',
  relayQr: 'https://res.cloudinary.com/duzedercz/image/upload/v1789532584/kevdnzwpid0nqotsx38c.jpg',
  activation: 'https://res.cloudinary.com/duzedercz/image/upload/v1789531364/mjoi7juw2pfuywmeafup.png',
  agentList: 'https://res.cloudinary.com/duzedercz/image/upload/v1789529537/glrqigcg6qhz79dqsqk6.png',
  qrValidation: 'https://res.cloudinary.com/duzedercz/image/upload/v1789531743/pasd7qkl209hrk1gyej3.jpg',
};

// ── Per-project stories. Each project gets its own block sequence, so no two
// read the same. Built only from facts already in the warehouse. ──

const paysikaJourney = [
  {
    type: 'intro',
    eyebrow: 'Service design case study',
    heading: 'A card journey that runs past the app',
    text: 'At PaySika I led design from the MVP to a multi-product neo-bank. I owned the experience end to end: mobile, web, back office and the physical card. I measured it the way the business did, in retention, in support tickets, and in the minutes a customer spends at a relay point.',
  },
  {
    type: 'metrics',
    heading: 'What the journey had to answer',
    text: 'Three numbers decided whether the redesign worked.',
    items: [
      { value: '40%', label: 'Retention lift after the journey redesign', note: 'Measured in Mixpanel against the previous onboarding and KYC flow.' },
      { value: '60%', label: 'Fewer support tickets', note: 'Most of the drop came from states that now explain themselves in the app.' },
      { value: '30 to 10', label: 'Minutes for a relay-point handover', note: 'QR-code validation replaced the paper form and manual signature.' },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'Four touchpoints',
    heading: 'Order, deliver, hand over, activate',
    text: 'Four moments in one experience, and three of them happen away from a screen.',
    items: [
      {
        title: 'Ordering',
        text: 'The delivery method, the fees and the timing sit on the same screen as the decision, so nothing about the card is a surprise later.',
        image: IMG.ordering,
      },
      {
        title: 'Home delivery',
        text: 'The delivery agent works from an internal app I designed: the order, the customer, the address, and one button to confirm the handover.',
        image: IMG.homeDelivery,
      },
      {
        title: 'Relay-point pickup',
        text: 'At the pickup point, QR validation records the handover the moment it happens and takes the queue from 30 minutes to 10.',
        image: IMG.relayQr,
      },
      {
        title: 'Activation',
        text: 'Back in the app the card goes live, with the controls to block, replace or travel with it.',
        image: IMG.activation,
      },
    ],
  },
  {
    type: 'two-col',
    heading: 'One product, two sets of rules',
    imageSide: 'left',
    image: 'paysika-design-requirements.png',
    caption: 'Part of the requirements set for the dashboard, branding, KYC and fees work.',
    markdown:
      'When PaySika opened in Gabon, KYC in Cameroon was not KYC in Gabon: different documents, different checks, different expectations from the partner bank. I led the design across the mobile app and the back office so we kept one product with market-specific onboarding, rather than two apps that drift apart.',
  },
  {
    type: 'gallery',
    eyebrow: 'Behind the process',
    heading: 'The systems behind the shipped screens',
    items: [
      {
        image: 'design-system.png',
        title: 'One design system',
        description: 'Tokens, components and text styles in Figma, the source every PaySika surface builds from.',
      },
      {
        image: 'card-states.png',
        title: 'Card state library',
        description: 'Every physical and virtual card state, active, locked, expired or inactive, designed once and reused.',
      },
      {
        image: 'icon-library.png',
        title: 'Icon library',
        description: 'A shared icon set for card settings, mobile-money and bank partners, and card actions.',
      },
      {
        image: 'illustration-library.png',
        title: 'Illustration library',
        description: 'Reusable illustrations for onboarding, KYC, empty states and success moments.',
      },
      {
        image: 'paysika-research-archive.png',
        title: 'Usability-testing archive',
        description: 'The consent forms, scripts, observer guides and reports from the sessions that drove the redesign.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'The work that moved the numbers was not the visual layer. It was making every screen state what it costs, why an input is needed, and what just happened. A calm confirmation and a scary error state do different jobs, but they answer the same question for the user: is my money safe here?',
  },
];

const crowdremitResearch = [
  {
    type: 'intro',
    eyebrow: 'Research and journey mapping',
    heading: 'Map the journey before touching the pixels',
    text: 'CrowdRemit let people send money between countries with clear fees. Before any screen was drawn I mapped how transfers actually happen, what people trust, what they fear, and what they check twice. The journey map came first; the interface followed it.',
  },
  {
    type: 'gallery',
    eyebrow: 'Research before pixels',
    heading: 'Starting from real behaviour',
    items: [
      {
        image: 'crowdremit_user_interviews.png',
        title: 'Remote user interviews',
        description: 'Moderated sessions with senders and recipients, focused on how transfers really happen.',
      },
      {
        image: 'crowdremit_journey_map.png',
        title: 'Customer journey map',
        description: 'Every step from intent to the received-money confirmation, and the anxiety at each one.',
      },
      {
        image: 'crowdremit_user_stories.png',
        title: 'User stories',
        description: 'Research turned into concrete scenarios the whole team could design and build against.',
      },
    ],
  },
  {
    type: 'compare',
    eyebrow: 'An accessibility call',
    heading: 'A contrast test made us rebrand',
    left: {
      label: 'The contrast problem',
      image: 'crowdremit_error_page_contrast.png',
      caption: 'The original error and network screens, side by side with the accessible version.',
    },
    right: {
      label: 'The documented brand',
      image: 'crowdremit_brand_guidelines.png',
      caption: 'The new palette and type, written down so product and marketing stayed consistent.',
    },
  },
  {
    type: 'gallery',
    eyebrow: 'The deliverables',
    heading: 'The system and the surfaces',
    items: [
      {
        image: 'crowdremit_design_system.png',
        title: 'Design system',
        description: 'Tokens, components and UI kits, so the teams built consistent screens across four surfaces.',
      },
      {
        image: 'crowdremit_receiving_money.png',
        title: 'Receive-first send flow',
        description: 'The receive amount is the main input, with fees and rate on the same screen.',
      },
      {
        image: 'crowdremit_wireframe_screens.png',
        title: 'Low-fidelity first',
        description: 'Wireframes settled the skeleton before colour or copy could distract from it.',
      },
      {
        image: 'crowdremit_landing_page.png',
        title: 'Marketing site',
        description: 'The public landing page, carrying the same identity as the product.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'The insight that shaped the flow was simple: people think in the amount that lands, not the exchange rate. Once the receive amount became the primary input, the rest of the screen had a job to do, and the fees stopped feeling hidden.',
  },
];

const shomiLifecycle = [
  {
    type: 'intro',
    eyebrow: 'Discovery and lifecycle',
    heading: 'A product that was built, launched, and then stopped on purpose',
    text: 'I co-founded Kody and owned the product side of Shomi, interactive exam preparation for Cameroonian secondary-school students. With a two-person team and a $5,000 grant I ran the full lifecycle: discovery, backlog, launch, and the decision to stop.',
  },
  {
    type: 'photos',
    heading: 'Discovery with the students it was for',
    items: [
      {
        image: 'Untitled 1.png',
        caption: 'A research session with a student, working through the flow on a phone.',
      },
      {
        image: 'shomi_prexcel_classroom.png',
        caption: 'Students at the partner exam-preparation school who tested the product.',
      },
    ],
  },
  {
    type: 'gallery',
    heading: 'Prototypes and tests before production code',
    items: [
      {
        image: 'shomi_wireframes.png',
        title: 'Wireframe flow',
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
        title: 'Competitive landscape',
        description: 'A board of adjacent products and patterns, used to place Shomi.',
      },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'file',
        title: 'A funded start',
        text: 'Won a $5,000 Tony Elumelu Foundation grant and directed the budget across the product lifecycle.',
      },
      {
        icon: 'target',
        title: 'Scope as the strategy',
        text: 'One platform, one audience, one validated need. Two adjacent ideas were turned down in the first month.',
      },
      {
        icon: 'shield',
        title: 'The sunset call',
        text: 'When retention data showed the content model would not sustain, I owned the sunset and wrote the post-mortem.',
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

const gefonaDelivery = [
  {
    type: 'intro',
    eyebrow: 'Programme delivery',
    heading: 'One timeline for research, communications and money',
    text: 'At the GEFONA Digital Foundation I ran delivery as the link between research, communications and finance, in a lean non-profit where a dropped ball is expensive. I owned the timelines, the reporting and the finance records.',
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'route',
        title: 'One shared timeline',
        text: 'A research milestone, its announcement and its budget line moved together instead of surprising each other.',
      },
      {
        icon: 'message',
        title: 'A steady reporting rhythm',
        text: 'Stakeholders and funders got current numbers on a fixed cadence, without having to chase status.',
      },
      {
        icon: 'file',
        title: 'Finance you can audit',
        text: 'Budgeting and tracking kept clean enough to report against at any time.',
      },
    ],
  },
  {
    type: 'steps',
    heading: 'How I kept three functions aligned',
    items: [
      {
        title: 'Sequence the work in public',
        text: 'Deliverables across contributors were ordered on one timeline, with status reported to stakeholders and funders.',
      },
      {
        title: 'Write for the audience',
        text: 'External communications ran on the same rhythm as the research, so announcements matched the evidence.',
      },
      {
        title: 'Make the budget readable',
        text: 'Finance tracking stayed tied to funder lines, so every decision was made on real numbers.',
      },
    ],
  },
  {
    type: 'gallery',
    heading: 'Deliverables from the programmes',
    items: [
      {
        image: 'campaign-proposal.png',
        title: 'Sponsorship proposal',
        description: 'A bilingual campaign proposal deck, from the problem statement to the advantages for partners.',
      },
      {
        image: 'onboarding-deck.png',
        title: 'Onboarding deck',
        description: 'The introduction deck used with new contributors and partners.',
      },
      {
        image: 'content-archive.png',
        title: 'Content archive',
        description: 'Social posts, campaign frames and articles, kept in one archive so communications stayed consistent.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'In a small non-profit, communications and finance are not overhead, they are part of the delivery. Keeping them on the same timeline as the research is what stopped the surprises.',
  },
];

// ── Article overrides: keep the original text, swap the placeholder notes for
// real, existing images. Applied per company only. ──

async function overrideArticle(entryId, imageList, metaImage, excerpt, signatureFrom) {
  const rows = await sql`SELECT content FROM warehouse_entries WHERE id = ${entryId}`;
  if (!rows.length) throw new Error(`Entry not found: ${entryId}`);
  let content = rows[0].content || '';
  let i = 0;
  const noteRe = /^> \*\*\[[^\n]*\]\*\*[ \t]*$/gm;
  const before = (content.match(noteRe) || []).length;
  content = content.replace(noteRe, () => (i < imageList.length ? imageList[i++] : ''));
  content = content.replace(/\n*> \*\*Images to add before publishing[\s\S]*$/m, '\n');
  if (signatureFrom) {
    content = content.replace(signatureFrom, '*Ndouken Theryx is a product and service designer based in Douala, Cameroon.*');
  }
  content = clean(content);
  if (before !== imageList.length) {
    console.warn(`  note: ${entryId} had ${before} image notes, ${imageList.length} images provided`);
  }
  const meta = { excerpt: excerpt || null };
  if (metaImage) meta.image = metaImage;
  return { content, meta };
}

const backOffice = await overrideArticle(
  'article:designing-a-back-office-for-physical-card-delivery-in-cameroon',
  [
    `![The delivery agent app: the order list agents worked from in Douala and Yaounde](${IMG.agentList})`,
    `![QR validation at the relay point, in place of the paper form](${IMG.qrValidation})`,
    `![An agent order detail in the field, with the customer and address on one screen](${IMG.homeDelivery})`,
    `![The customer card flow, where delivery method, fees and timing sit on one screen](${IMG.ordering})`,
    `![The card flow, from order to activation](${IMG.activation})`,
    '![Part of the requirements and process documentation for the back office](paysika-design-docs.png)',
  ],
  IMG.agentList,
  'Status enforcement, agent workflows, and two delivery models sharing one back office.',
  '*Theryx Lanvin is Lead Product Designer at PaySika, a Francophone African neo-bank. He contributes to OSS Cameroon as a frontend developer and designer.*'
);

const supportTickets = await overrideArticle(
  'article:how-i-design-features-that-reduce-customer-support-tickets',
  [
    '![Card states and the in-app explanations that answer user questions](paysika-product-assets.png)',
    '![The card state library, including the blocked state](card-states.png)',
    '![The icon library used across the product](icon-library.png)',
    '![The requirements and process documentation behind the error states](paysika-design-requirements.png)',
    '![The design system the flows are built from](design-system.png)',
    '![The illustration library used for empty and success moments](illustration-library.png)',
  ],
  null,
  null,
  '*Theryx Lanvin is Lead Product Designer at PaySika, a Francophone African neo-bank. He contributes to OSS Cameroon as a frontend developer and designer.*'
);

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
      content_blocks: paysikaJourney,
      tagline: 'Mapping and rebuilding a card journey that runs from the app to a relay point.',
      description:
        'As UX Design Lead and a founding-team member I led design at PaySika from MVP to a multi-product neo-bank. I owned the core mobile and web journeys, then the half of the experience that happens outside the app: the physical card, from ordering and home delivery to relay-point pickup and activation.',
    },
  },
  {
    entry_id: 'project:crowdremit_fintech',
    sort_order: 1,
    metadata: {
      content_blocks: crowdremitResearch,
      tagline: 'Research-led UX for cross-border transfers, built on a customer journey map.',
      description:
        'As UX Researcher and Product Designer I designed the whole CrowdRemit experience across iOS, Android, the web app and the admin dashboard, plus the marketing site, and built the design system the engineering team implemented from.',
    },
  },
  {
    entry_id: 'project:shomi_default',
    sort_order: 2,
    metadata: {
      content_blocks: shomiLifecycle,
      tagline: 'An ed-tech product taken from discovery to launch, and then stopped on purpose.',
      description:
        'Co-founder of Kody and product owner on Shomi: interactive exam preparation for Cameroonian secondary-school students. With a two-person team and a $5,000 grant I owned the full lifecycle: discovery, backlog, launch, and the decision to stop.',
    },
  },
  {
    entry_id: 'project:gefona_project-manager',
    sort_order: 3,
    metadata: {
      content_blocks: gefonaDelivery,
      image: 'gefona_logo.png',
      tagline: 'Programme delivery across research, communications and finance.',
      description:
        'At the GEFONA Digital Foundation I ran delivery as the connective tissue between research, communications and finance, owning the timelines, the reporting and the finance records.',
    },
  },
  {
    entry_id: 'article:designing-a-back-office-for-physical-card-delivery-in-cameroon',
    sort_order: 0,
    content: backOffice.content,
    metadata: backOffice.meta,
  },
  {
    entry_id: 'article:how-i-design-features-that-reduce-customer-support-tickets',
    sort_order: 1,
    content: supportTickets.content,
    metadata: supportTickets.meta,
  },
];

for (const l of links) {
  await sql`
    INSERT INTO company_entries (company_id, entry_id, sort_order, override_content, override_metadata, is_visible)
    VALUES (
      ${companyData.id}, ${l.entry_id}, ${l.sort_order},
      ${l.content ?? null},
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

const check = await sql`SELECT id, slug, name, is_active, layout FROM companies WHERE id = ${companyData.id}`;
const linkCount = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${companyData.id}`;
console.log('Company:', check[0]);
console.log(`Linked entries: ${linkCount[0].n}`);
