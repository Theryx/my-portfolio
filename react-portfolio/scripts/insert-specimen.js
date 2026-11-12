// Company site /c/specimen: Product Designer application (Bold Entrepreneur Ltd).
// Facts come from the warehouse only. No em or en dashes.
// Also upserts the new warehouse project "project:careathon-brand", written
// from article:branding-the-careathon-a-visual-identity-of-its-own.
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

const JOB_DESCRIPTION = fs.readFileSync(
  path.join(__dirname, '../../applications/bold/job.md'),
  'utf8',
);

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
const withImages = (b) => ({ ...b, items: b.items.filter((it) => it.image) });

const paysikaProduct = await blocksOf('project:paysika_fintech');
const paysikaBrand = await blocksOf('project:paysika_brand-designer');
const gueemshome = await blocksOf('project:gueemshome_brand-designer');

// ── PaySika: product and brand, one designer ──
const cardJourney = withImages(byHeading(paysikaProduct, 'Order, deliver, hand over, activate'));
const agentApp = withImages(byHeading(paysikaProduct, 'The app our agents used'));
agentApp.text =
  'The delivery agents were not part of the product team, so their app had to be obvious on a phone in the middle of a shift: the order, the customer, the address, one button to confirm. At the relay point, QR validation replaced the paper form and cut the handover from 30 minutes to 10.';
const designSystem = byHeading(paysikaProduct, 'One design system, every surface');
designSystem.text =
  'Colour, type, icons, illustrations and components lived in one Figma library, as semantic tokens with the same names developers used in code. The app, the web app, the back office and the agent tools stayed one product.';
const brandGuide = byHeading(paysikaBrand, 'One source of truth');
const productToMarketing = byHeading(paysikaBrand, 'From product to marketing');
const offScreen = byHeading(paysikaBrand, 'Brand assets, merch & events');
offScreen.heading = 'Off the screen';
offScreen.text =
  'I designed the paid ads for Meta and Google, and the flyers, roll-up banners and brochures for our fair stands. I also produced the merchandise and event material that carried the brand into the street: co-branded billboards, mugs, notebooks and tote bags.';
const packagingCompare = byHeading(paysikaProduct, 'The envelope, before and after');
const packagingWhy = byHeading(paysikaProduct, 'Most of our users had never held a card');

const paysikaStory = [
  {
    type: 'intro',
    eyebrow: 'PaySika, 2022 to 2026',
    heading: 'From the first version to a bank in two countries',
    text: 'I led design at PaySika from its first version until 2026, as part of the founding team. I redesigned the core mobile flows (onboarding, identity checks and Visa activation), designed the app our delivery agents used, and owned the design system and the brand. When PaySika opened in Gabon, I reworked onboarding and identity checks for the local rules.',
  },
  cardJourney,
  agentApp,
  designSystem,
  brandGuide,
  productToMarketing,
  offScreen,
  packagingCompare,
  packagingWhy,
];

// ── GUEEMSHOME: a brand from the name outward ──
const gConcept = byHeading(gueemshome, 'From concept to a system');
const gApplied = byHeading(gueemshome, 'One monogram, a colour per scent');
const gPrint = byHeading(gueemshome, 'In the hand, on the shelf');
gPrint.text =
  'The identity carries into things people hold: business cards, a bilingual thank-you card in every order, gift packaging, flyers and brochures. Each was designed and then produced, so the brand feels as considered off the screen as on it.';
const gOnline = byHeading(gueemshome, 'Online and everywhere');
gOnline.items = gOnline.items.map((it) =>
  it.image === 'spray-lifestyle.jpg'
    ? { ...it, description: 'Product and campaign imagery in the same warm, restrained look as the rest of the brand.' }
    : it,
);

const gueemshomeStory = [
  {
    type: 'intro',
    eyebrow: 'GUEEMSHOME, 2022',
    heading: 'A brand built from the name outward',
    text: 'GUEEMSHOME is an artisanal home-fragrance house in Paris: plant-based, refillable candles, room perfumes and gift sets. Working remotely, I built the brand from the ground up: the GH monogram, the palette and type, the brand guide, the website a developer built in WordPress, and the print and social assets.',
  },
  gConcept,
  gApplied,
  gPrint,
  gOnline,
];

// ── Shomi (Kody): research to a tested prototype ──
const shomiStory = [
  {
    type: 'intro',
    eyebrow: 'Kody, 2019 to 2020',
    heading: 'An exam-prep app, tested before it was built',
    text: 'Shomi was an exam-prep app for secondary-school students in Cameroon, built by a team of two under Kody, with a $5,000 grant from the Tony Elumelu Foundation. I was its product designer: research, competitor review, journeys, wireframes, the prototype and the tests.',
  },
  {
    type: 'two-col',
    eyebrow: 'Research',
    heading: 'What students told us',
    image: 'shomi_prexcel_classroom.png',
    caption: 'A study session at PREXCEL, the school we partnered with.',
    markdown:
      'We turned more than 100 survey responses, and follow-up interviews, into the brief. Many students were not allowed a phone at home, so the app had to work in short sessions. Most still preferred printed pamphlets or interactive booklets to plain PDFs, so we designed an interactive booklet viewer instead of a file list. Students and parents had little to spend, so we designed small, affordable price tiers.',
  },
  {
    type: 'gallery',
    eyebrow: 'Design',
    heading: 'Competitors, a persona, a journey and the first screens',
    items: [
      { image: 'shomi_competitive_analysis.png', title: 'Competitor review', description: 'What students already used, and what none of it offered.' },
      { image: 'Untitled 6.png', title: 'Persona', description: 'A student persona built from the survey and interviews.' },
      { image: 'Untitled 7.png', title: 'Journey', description: 'From signing up to opening a booklet and joining an exam night.' },
      { image: 'shomi_wireframes.png', title: 'Wireframes and prototype', description: 'The flows we put in front of students before building.' },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'Testing',
    heading: 'Usability test with five students',
    text: 'We tested the Figma prototype with five target users before building.',
    items: [
      { title: 'They went to the answers first', text: 'Three of the five said they were more likely to open the corrections than the exam papers.' },
      { title: 'Nobody understood the payment page', text: 'All five struggled to understand it.' },
      { title: 'The language switch was hidden', text: 'One student could not find where to change the app language.' },
    ],
  },
  {
    type: 'gallery',
    heading: 'The changes after testing',
    items: [
      { image: 'shomi_usability_testing.png', title: 'Before and after the tests' },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'After a year we shut Shomi down. Students in the pilot engaged because the app was new, and without a steady flow of new content their engagement dropped. I wrote the post-mortem. The lesson I kept: interest during a pilot is not the same as regular use.',
  },
];

// ── Careathon 2024: a new warehouse project ──
const careathonStory = [
  {
    type: 'intro',
    eyebrow: 'Careathon, 2024',
    heading: 'An event that belongs to neither of its organisers',
    text: 'Careathon is a yearly hackathon where teams pick a real problem and build a tech solution for it. It is run by LOHCE and OSS Cameroon together. For the 2024 edition I was in charge of the visual identity, as part of the OSS Cameroon team. The brief was an identity of its own, so the event could build recognition from one year to the next instead of borrowing one organiser\'s look.',
  },
  {
    type: 'compare',
    eyebrow: 'Before and after',
    heading: 'From a headline to an identity',
    left: {
      image: 'careathon24-old-poster-2023.png',
      label: '2023 (before my work)',
      caption: 'The name as a plain black headline on another event\'s poster, with no colour or type of its own.',
    },
    right: {
      image: 'careathon24-join-challenge-poster.webp',
      label: '2024',
      caption: 'The call for applications in the new system: the palm-leaf wordmark, teal and slate navy, the organisers fixed at the bottom.',
    },
  },
  {
    type: 'two-col',
    eyebrow: 'The system',
    heading: 'Small on purpose',
    image: 'careathon24-twitter-profile.png',
    caption: 'The event\'s own account, with the bilingual line and both organisers credited.',
    markdown:
      'A palm-leaf wordmark, a teal and slate-navy palette, and one card template with the sponsors and organisers fixed at the bottom. The palm leaf came back on every piece, so someone scrolling past could tell a Careathon post in under a second.\n\nThe tagline sat in French and English, stacked: "Seras-tu le meilleur / Would you be the best Care Developer?" Cameroon is bilingual, so neither language came second.',
  },
  {
    type: 'gallery',
    eyebrow: 'One template',
    heading: 'Ambassadors, Spaces and the reveal',
    text: 'The same card shell became every announcement. Only the headline and the photo zone changed.',
    items: [
      { image: 'careathon24-ambassador-cards.png', title: 'Ambassador cards', description: 'Community figures each got a card with their photo and their own quote, on one shared shell.' },
      { image: 'careathon24-space2-promo.webp', title: 'Twitter Space promo', description: 'Numbered, so each Space read as part of a series.' },
      { image: 'careathon24-reveal-card.webp', title: 'The reveal', description: '"Nous avons nos gagnants", posted days before the winners, with the prize podium.' },
    ],
  },
  {
    type: 'intro',
    eyebrow: 'The campaign',
    heading: 'Reach without paid media',
    text: 'We gave the event its own account, separate from both organisers, so the followers it gained would stay with Careathon. Ambassadors brought their own audiences, and posts regularly reached four figures in views with no paid media. Between the formal cards, plain-text updates carried the countdown: registrations closing, the competition starting, one team at 46 commits.',
  },
  {
    type: 'photos',
    heading: 'The identity, used by someone else',
    text: 'After the reveal, an attendee reposted the winners using the event\'s own prize card and its own words. That is the identity doing its job.',
    items: [
      { image: 'careathon24-countdown-timeline.png', caption: 'The countdown posts between launch and the reveal.' },
      { image: 'careathon24-winners-repost.png', caption: 'An attendee\'s repost, built on the branded prize card.' },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'If I did it again, I would lock the card template before the first ambassador card went out, so every card after it started from the same file instead of being adjusted later.',
  },
];

const careathonEntry = {
  id: 'project:careathon-brand',
  type: 'project',
  title: 'Careathon 2024',
  tags: ['Event brand · Social'],
  metadata: {
    tag: 'Event brand · Social',
    role: 'Brand designer, OSS Cameroon team',
    period: '2024',
    location: 'Cameroon',
    image: 'careathon24-ambassador-cards.png',
    tagline: 'An identity, a card template and a campaign for a yearly hackathon run by two organisations.',
    description:
      'For the 2024 edition of Careathon, a yearly hackathon run by LOHCE and OSS Cameroon, I designed the visual identity as part of the OSS Cameroon team: a palm-leaf wordmark, a teal and slate-navy palette, and one card template reused for ambassador cards, Twitter Space promos, the call for applications, the reveal and the results.',
    responsibilities: [
      'Designed the visual identity: palm-leaf wordmark, teal and slate-navy palette',
      'Built one card template reused for every announcement',
      'Designed personalised ambassador cards on the shared template',
      'Designed promo cards for a numbered series of Twitter Spaces, the reveal card and the results recap',
    ],
    content_blocks: careathonStory,
    source_project_id: 'careathon-brand',
  },
};

await sql`
  INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
  VALUES (
    ${careathonEntry.id}, ${careathonEntry.type}, ${careathonEntry.title}, '',
    ${JSON.stringify(cleanDeep(careathonEntry.metadata))}::jsonb, ${careathonEntry.tags}, false, 0, ${now}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, metadata = EXCLUDED.metadata, tags = EXCLUDED.tags, updated_at = ${now}
`;

// ── The company row ──
const company = {
  id: 'bold-entrepreneur',
  slug: 'specimen',
  name: 'Bold Entrepreneur Ltd',
  role: 'Product Designer',
  job_url: 'https://boldentrepreneur.africa/',
  job_description: JOB_DESCRIPTION,
  layout: 'specimen-v1',
  tagline: 'Product designer: apps, design systems and the brands around them.',
  hero_title: "I'm Ndouken, a product designer in Douala. I design the app, and the brand around it.",
  hero_subtitle:
    'For nearly four years I led design at PaySika, a bank app in Cameroon and Gabon: the screens, the design system, the brand, and the card that arrived in people\'s hands. I have also built brands from the first sketch, for a home-fragrance house in Paris and a yearly hackathon in Cameroon.',
  philosophy_title: 'How I work',
  philosophy_text: '',
  intro_expanded_text: [
    'At PaySika I led design from the first version to a bank used by thousands of people across Central Africa. I owned the app flows, the design system and the brand guide, and I took the brand off the screen: the debit card and its packaging, flyers, roll-up banners and brochures for our fair stands, and ads for Meta and Google.',
    'Before that I was the product designer of Shomi, built under Kody, and I designed for several clients at once as a part-time UI/UX consultant at Matanga Agency. On the brand side, I built the GUEEMSHOME identity from the logo to the packaging, the GEFONA Digital Foundation identity, and the Careathon identity with OSS Cameroon.',
    'Outside client work I build small products of my own with AI-assisted development: a personal finance app, a rental property app, and a dashboard that ties them together.',
  ].join('\n\n'),
  badges: ['Product design', 'Design systems', 'Brand identity', 'Print and social'],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    role_line: 'Product designer',
  },
  about_content: {
    lede: 'I am a product designer in Douala, Cameroon. I design web and mobile apps, and the brands, print and campaigns around them. My background is in land surveying engineering, so I came to design with a structured, technical way of thinking.',
    location: 'Douala, Cameroon',
    languages: 'English and French, both fluent',
    tools: [
      { label: 'Product', items: ['Figma: components, auto layout, prototyping, design tokens', 'Mixpanel'] },
      { label: 'Brand and print', items: ['Affinity Designer, Photo and Publisher', 'Photoshop and Illustrator'] },
      { label: 'AI in the workflow', items: ['Claude with Figma Make and the Figma MCP', 'AI-assisted development'] },
    ],
    experience: [
      { role: 'UX Design Lead, founding team', org: 'PaySika', place: 'Douala', period: 'Nov 2022 to Aug 2026' },
      { role: 'Customer Success Consultant', org: 'Loving Tech', place: 'Douala', period: 'Jan to Apr 2026' },
      { role: 'Senior UI/UX Consultant, part-time', org: 'Matanga Agency', place: 'Remote', period: 'Dec 2023 to Feb 2024' },
      { role: 'Co-maintainer and Design Lead', org: 'Jobsika, OSS Cameroon', place: 'Cameroon', period: '2022 to 2024' },
      { role: 'Brand Designer, remote', org: 'GUEEMSHOME', place: 'Paris', period: '2022' },
      { role: 'Founding designer', org: 'GEFONA Digital Foundation', place: 'Yaounde' },
      { role: 'Product Designer', org: 'Kody (Shomi)', place: 'Cameroon', period: 'Dec 2019 to Dec 2020' },
    ],
    skills: [
      'Web and mobile interfaces',
      'User journeys and wireframes',
      'Prototyping',
      'User research and competitor analysis',
      'Usability testing',
      'Design systems',
      'Brand identity and guidelines',
      'Print, social and ads',
      'Working with developers',
      'Product analytics (Mixpanel)',
    ],
    education: [
      { degree: 'Masters in Engineering, Land Survey', school: 'National Advanced School of Public Works, Yaounde', period: '2015 to 2020' },
      { degree: 'GCE Advanced Level, Science', school: 'GBHS Etoug-Ebe, Yaounde', period: '2015' },
    ],
    certifications: [
      { name: 'Google Project Management Certificate', meta: 'In progress, since Aug 2026' },
      { name: 'Empathy in UX Design', meta: 'Feb 2020' },
      { name: 'Human-Product Interaction Design', meta: 'Feb 2020' },
      { name: 'Visual Elements of User Interface Design', meta: 'California Institute of the Arts, Mar 2020' },
      { name: 'Graphic Design Foundations: Typography', meta: 'Feb 2020' },
      { name: 'Fundamentals of Graphic Design', meta: 'California Institute of the Arts, Sep 2019' },
    ],
  },
  theme_config: {
    concept: 'specimen',
    bg: '#F3F2EE',
    surface: '#FFFFFF',
    ink: '#151515',
    muted: '#5C5C58',
    rule: '#DAD8D1',
    accent: '#E2431D',
    accent_soft: '#F6C9B9',
    dark_bg: '#141413',
    dark_accent: '#F06A45',
    disciplines: ['Web and mobile apps', 'Design systems', 'Brand identity', 'Print, social and campaigns'],
    practice: [
      {
        title: 'Look around first',
        text: 'Every project starts with research and a competitor review: who uses this, what they use today, and where it lets them down. At PaySika that also meant a day in the field every month, watching people use the app.',
      },
      {
        title: 'Test before building',
        text: 'I put wireframes and Figma prototypes in front of real users before anything is built. At Kody, five students showed us that nobody understood the payment page.',
      },
      {
        title: 'One system, every surface',
        text: 'Colour, type and components live in one Figma library, with the same names developers use in code, so the app, the deck and the flyer look like one company.',
      },
      {
        title: 'AI in the workflow',
        text: 'I use Claude with Figma to work through flows and produce screens faster, and I build small apps of my own with AI-assisted development. The decisions and the taste stay mine.',
      },
    ],
    sheet: [
      { image: 'paysika_mockup.png', kind: 'Screens', project: 'paysika_fintech' },
      { image: 'careathon24-ambassador-cards.png', kind: 'Social', project: 'careathon-brand' },
      { image: 'paysika-packaging-v2.jpg', kind: 'Packaging', project: 'paysika_fintech' },
      { image: 'business-card-printed.jpg', kind: 'Print', project: 'gueemshome_brand-designer' },
      { image: 'design-system.png', kind: 'Design system', project: 'paysika_fintech' },
      { image: 'shomi_usability_testing.png', kind: 'Usability test', project: 'shomi_project-manager' },
      { image: 'social-feed.png', kind: 'Social', project: 'gueemshome_brand-designer' },
      { image: 'careathon24-reveal-card.webp', kind: 'Campaign', project: 'careathon-brand' },
      { image: 'brand-guide.png', kind: 'Brand guide', project: 'paysika_fintech' },
      { image: 'shomi_wireframes.png', kind: 'Wireframes', project: 'shomi_project-manager' },
      { image: 'packaging-gift.jpg', kind: 'Packaging', project: 'gueemshome_brand-designer' },
      { image: 'billboards.png', kind: 'Out of home', project: 'paysika_fintech' },
    ],
    projects: {
      paysika_fintech: {
        sector: 'Fintech',
        did: ['Product', 'Design system', 'Brand', 'Print', 'Ads'],
        specimen: [
          { label: 'Colour', value: '#00B0F4', swatch: '#00B0F4' },
          { label: 'Colour', value: '#00CC92', swatch: '#00CC92' },
          { label: 'Type', value: 'Muli, AmpleSoft Pro' },
        ],
      },
      'gueemshome_brand-designer': {
        sector: 'Home fragrance',
        did: ['Identity', 'Brand guide', 'Website', 'Print', 'Social'],
        specimen: [
          { label: 'Mark', value: 'GH hexagon monogram' },
          { label: 'Type', value: 'Hammersmith One' },
          { label: 'Colour', value: 'Warm and restrained, one colour per scent' },
        ],
      },
      'shomi_project-manager': {
        sector: 'Edtech',
        did: ['Research', 'Competitors', 'Wireframes', 'Prototype', 'Testing'],
      },
      'careathon-brand': {
        sector: 'Tech event',
        did: ['Identity', 'Templates', 'Social', 'Campaign'],
        specimen: [
          { label: 'Mark', value: 'Palm-leaf wordmark' },
          { label: 'Colour', value: 'Teal and slate navy' },
          { label: 'Voice', value: 'French and English, stacked' },
        ],
      },
    },
  },
  seo: {
    title: 'Ndouken Theryx, product designer',
    description: 'Portfolio of Ndouken Theryx, product designer in Douala, Cameroon: apps, design systems and brands.',
  },
};

const links = [
  {
    entry_id: 'project:paysika_fintech',
    sort_order: 0,
    metadata: {
      title: 'PaySika',
      tag: 'Fintech · Product and brand',
      tagline: 'A bank app, its design system, its brand, and the card people held in their hands.',
      role: 'UX Design Lead, founding team',
      period: '2022 to 2026',
      location: 'Douala, Cameroon',
      image: 'paysika_mockup.png',
      content_blocks: paysikaStory,
    },
  },
  {
    entry_id: 'project:gueemshome_brand-designer',
    sort_order: 1,
    metadata: {
      tag: 'Brand identity · Print · Web',
      tagline: 'A home-fragrance brand built from the name outward: logo, guide, website, print and social.',
      role: 'Brand Designer, remote',
      period: '2022',
      location: 'Paris, France',
      impact: '',
      content_blocks: gueemshomeStory,
    },
  },
  {
    entry_id: 'project:shomi_project-manager',
    sort_order: 2,
    metadata: {
      title: 'Shomi (Kody)',
      tag: 'Edtech · Research to prototype',
      tagline: 'An exam-prep app, from student research to a tested prototype and a live MVP.',
      role: 'Product Designer',
      period: '2019 to 2020',
      location: 'Cameroon',
      image: 'shomi_wireframes.png',
      impact: '',
      content_blocks: shomiStory,
    },
  },
  { entry_id: 'project:careathon-brand', sort_order: 3, metadata: null },
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
  SET application = ${JSON.stringify({ kind: 'application', stage: 'building', fit_score: 98 })}::jsonb
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
