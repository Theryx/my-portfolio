// Company site /c/irc ("carnet"): Associate Designer application.
// Facts come from the warehouse only. No em or en dashes.
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

const clean = (s) => (s == null ? s : String(s).replace(/[–—]/g, '-'));
const cleanDeep = (v) =>
  typeof v === 'string' ? clean(v)
    : Array.isArray(v) ? v.map(cleanDeep)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)]))
    : v;

const JOB_DESCRIPTION = `Airbel is IRC's innovation lab. We work alongside people affected by conflict and crisis to design services that are more useful, more dignified, and more likely to last. This role puts a designer in the middle of that work in West and Central Africa, close to the communities, the frontline workers, and the questions that decide whether a product or service actually helps someone.
Run design research in the field: interviews, observation, and time spent with clients and frontline workers.
Stay close to one geography or work stream long enough to notice the patterns that only show up over time.
Make sense of what you see on the ground, and find the sparks of innovation already present in people's own workarounds and ideas.
Turn research into prototypes, test them with real users, and iterate as you learn rather than following a fixed script.
Bring what you learn back in a form the team can use: clear notes, visuals, journey maps, whatever makes the insight legible.
Partner with country program teams, technical leads, and frontline staff with care and respect, earning the access that good research depends on.
Work across francophone West and Central Africa, and other humanitarian settings as needed, adapting quickly to new contexts and teams.
Requirements: research with people beyond a script; built, tested and changed something with its users; noticing everyday workarounds; something that shows how you think; fieldwork and ethics with people in vulnerable situations; rough, early prototype testing; comfort spending two weeks at a field site; adaptability across cultures and languages; working French and English.
Preferred: visuals, maps and simple decks; humanitarian, health or community settings.
Locations: Abuja, Yaounde, N'Djamena. Up to 40% travel. Closes 2026-11-20.`;

const company = {
  id: 'irc',
  slug: 'carnet',
  name: 'International Rescue Committee',
  role: 'Associate Designer',
  job_url: 'https://theirc.wd1.myworkdayjobs.com/en-US/External_Careers/job/Associate-Designer_JR00005797',
  job_description: JOB_DESCRIPTION,
  layout: 'irc-carnet-v1',
  tagline: 'UX designer and researcher, working in English and French.',
  hero_title: "Hi, I'm Ndouken. I'm a UX designer and researcher in Douala, Cameroon.",
  hero_subtitle:
    'I led design at PaySika, a bank app in Douala and Yaounde, from its first version until 2026. Part of the job was going out to meet our users: the last Friday of every month in the field, and the fairs we took part in, like Promote, CITS and YAFE in Yaounde.',
  philosophy_title: 'How a field day runs',
  philosophy_text: '',
  intro_expanded_text:
    'At PaySika I led UX from the first version to a bank used by thousands of people across Central Africa. Besides the app, I worked on the card itself, its delivery and the relay points where people collected it. Before that I was the product designer of Shomi, built under Kody, an exam app we tested with students at PREXCEL, a school in Cameroon. I also volunteer with the GEFONA Digital Foundation, where I led a research study across five countries and worked on an e-learning campaign with UNESCO during COVID-19.',
  badges: ['Field research', 'Prototyping', 'Service design', 'English and French'],
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/file/d/1UWdwiOxHdClXElgw1AdvpZygTiDOXjqp/view',
    role_line: 'UX designer and researcher',
    company_name: 'International Rescue Committee',
    role_target: 'Associate Designer',
  },
  about_content: {
    lede: 'I am a UX designer and researcher in Cameroon. My background is in land surveying engineering, so I came to design with a structured, technical way of thinking.',
    location: 'Douala, Cameroon',
    languages: 'English and French, both fluent',
    places: [
      'Douala and Yaounde, with PaySika users',
      'Promote, CITS and YAFE fairs in Yaounde',
    ],
    experience: [
      { role: 'UX Design Lead, founding team', org: 'PaySika', place: 'Douala', period: '2022 to 2026' },
      { role: 'Customer Success Consultant', org: 'Loving Tech', place: 'Douala', period: 'Jan to Apr 2026' },
      { role: 'Co-maintainer and Design Lead', org: 'Jobsika, OSS Cameroon', place: 'Cameroon', period: '2022 to 2024' },
      { role: 'Founding designer; led research, projects and communications', org: 'GEFONA Digital Foundation', place: 'Yaounde' },
      { role: 'Product Designer', org: 'Kody (Shomi)', place: 'Cameroon', period: 'Dec 2019 to Dec 2020' },
    ],
    skills: [
      'Field research and observation',
      'Interviews and usability testing',
      'Prototyping and testing with users',
      'Journey maps and personas',
      'Service design',
      'Research reports and decks',
      'Product analytics (Mixpanel)',
      'Figma',
    ],
    education: [
      {
        degree: 'Masters in Engineering, Land Survey',
        school: 'National Advanced School of Public Works, Yaounde',
        period: '2015 to 2020',
      },
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
    concept: 'carnet',
    bg: '#F4F0E8',
    surface: '#FBF8F2',
    ink: '#1F1D1A',
    muted: '#5E5A53',
    rule: '#D9D2C4',
    accent: '#7A2E5C',
    accent_soft: '#E2B9D0',
    dark_bg: '#1C1A18',
    dark_accent: '#D79BC0',
    hero_highlight: 'UX designer and researcher',
    hero_fr:
      "Je suis designer UX et chercheur, basé à Douala. Je travaille en français et en anglais.",
    about_fr:
      "Chez PaySika, je passais le dernier vendredi de chaque mois sur le terrain avec nos utilisateurs, et j'étais sur notre stand aux foires de Yaoundé (Promote, CITS, YAFE). Après chaque sortie, j'écrivais un rapport avec mes propositions.",
  },
  seo: {
    title: 'Ndouken Theryx, UX designer and researcher',
    description: 'Portfolio of Ndouken Theryx, UX designer and researcher in Douala, Cameroon.',
  },
};

// ── Shomi: research with students ──
const shomiStory = [
  {
    type: 'intro',
    eyebrow: 'Kody',
    heading: 'Testing Shomi with students',
    text: 'Shomi was an exam-prep app for secondary-school students in Cameroon, built by a team of two under Kody, with a $5,000 seed grant from the Tony Elumelu Foundation. We partnered with PREXCEL, a school that started as weekend classes, which gave us direct access to students so we could test our ideas in a real setting.',
  },
  {
    type: 'two-col',
    eyebrow: 'Survey and interviews',
    heading: 'What the survey told us',
    image: 'shomi_prexcel_classroom.png',
    caption: 'A PREXCEL study session.',
    markdown:
      'We turned more than 100 survey responses, and follow-up interviews, into the brief. Many students were not allowed a phone at home, so the app had to work in short sessions. Most still preferred physical pamphlets or interactive booklets to plain PDFs, so we designed an interactive booklet viewer instead of a file list. And because students and parents had little to spend, we designed small, affordable pricing tiers.',
  },
  {
    type: 'intro',
    eyebrow: 'Outreach',
    heading: 'Reaching students through parents and teachers',
    text: 'Many of our users were teenagers. When we reached out about Shomi, we addressed secondary-school students through their parents and teachers, and spoke directly only to pre-university students preparing for university entrance.',
  },
  {
    type: 'gallery',
    eyebrow: 'Design',
    heading: 'A persona, a journey and the first screens',
    items: [
      { image: 'Untitled 6.png', title: 'Persona', description: 'A student persona built from the survey and interviews.' },
      { image: 'Untitled 7.png', title: 'Journey', description: 'From signing up to opening a booklet and joining an exam night.' },
      { image: 'shomi_wireframes.png', title: 'Wireframes and prototype', description: 'The flows we put in front of students before building.' },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'Testing',
    heading: 'Usability test with five students',
    text: 'We tested the prototype with five target users before building.',
    items: [
      { title: 'They went to the answers first', text: 'Three of the five said they were more likely to open the corrections than the exam papers.' },
      { title: 'Nobody understood the payment page', text: 'All five struggled to understand it.' },
      { title: 'The language switch was hidden', text: 'One student could not find where to change the app language.' },
    ],
  },
  {
    type: 'gallery',
    heading: 'The changes after testing',
    items: [{ image: 'shomi_usability_testing.png', title: 'Before and after the tests' }],
  },
  {
    type: 'richtext',
    markdown:
      'After a year we shut Shomi down. Students in the pilot engaged because they liked us and the app was new, and without a steady flow of new content their engagement dropped. We decided to stop. The lesson for me was that interest during a pilot did not turn into regular use.',
  },
];

// ── Loving Tech: support built on a habit people already had ──
const lovingIntro = {
  type: 'intro',
  eyebrow: 'Loving Tech, 2026',
  heading: 'Customer support on WhatsApp',
  text: 'Loving Tech sells tech gear online in Cameroon, and I joined for four months as a customer success consultant. Customers were already sending their questions and complaints to the shop as scattered WhatsApp messages, and the team answered the same things by hand. I built a bot on WhatsApp Business to bring those questions and complaints into one place, since that is where customers were already writing to us. Before I left, I documented the system and trained the staff to use AI to debug it.',
};
const lovingStory = [
  lovingIntro,
  ...lovingTechBlocks
    .slice(2)
    .map((b) =>
      b.type === 'gallery' && b.heading === 'From the shelf to the door'
        ? { ...b, items: b.items.filter((it) => /tracking|track-lookup/.test(it.image)) }
        : b,
    ),
];

// ── GEFONA: research in five countries, and the UNESCO campaign ──
const gefonaResearch = gefonaStory.find((b) => b.type === 'two-col');
const gefonaGallery = gefonaStory.find((b) => b.type === 'gallery');
const gefonaIrcStory = [
  {
    type: 'intro',
    eyebrow: 'GEFONA Digital Foundation',
    heading: 'Research across West and Central Africa',
    text: 'GEFONA is an independent non-profit that publishes policy research on the digital economy and cybersecurity in Africa. I joined as its founding designer and later led its research and content.',
  },
  gefonaResearch,
  {
    type: 'intro',
    eyebrow: '2020, with UNESCO',
    heading: 'An e-learning campaign during COVID-19',
    text: 'In 2020 I handled content and editorial for a humanitarian awareness campaign with UNESCO on the importance of e-learning during COVID-19. It reached about 5,000 people through organic posts on Facebook and Twitter, Facebook ads and WhatsApp groups.',
  },
  { ...gefonaGallery, eyebrow: 'Publications', heading: 'Reports and decks, in French and English' },
];

const links = [
  { entry_id: 'project:paysika-field', sort_order: 0, metadata: null },
  {
    entry_id: 'project:shomi_default',
    sort_order: 1,
    metadata: {
      title: 'Shomi (Kody)',
      tag: 'Research with students · Prototyping',
      tagline: 'An exam-prep app we tested with students at PREXCEL.',
      role: 'Product designer and researcher',
      location: 'Cameroon',
      period: '',
      image: 'shomi_prexcel_classroom.png',
      content_blocks: shomiStory,
    },
  },
  {
    entry_id: 'project:lovingtech-cx',
    sort_order: 2,
    metadata: {
      tagline: 'Customer support set up on WhatsApp, where customers already wrote to the shop.',
      content_blocks: lovingStory,
    },
  },
  {
    entry_id: 'project:gefona_project-manager',
    sort_order: 3,
    metadata: {
      tag: 'Research · Non-profit',
      role: 'Founding designer; research and content',
      period: '2020 to 2021',
      impact: '',
      image: 'gefona-reports.png',
      tagline: 'Research in five countries, and an e-learning campaign with UNESCO.',
      description:
        'At the GEFONA Digital Foundation I led the 2020 study on application security in Cameroon and its 2021 edition across West and Central Africa, and handled content for an e-learning campaign with UNESCO during COVID-19.',
      content_blocks: gefonaIrcStory,
    },
  },
];

const now = new Date().toISOString();
const c = cleanDeep(company);

await sql`
  INSERT INTO companies (
    id, name, slug, is_active, role, job_description, job_url, status, layout,
    theme_config, seo, tagline, hero_title, hero_subtitle, philosophy_title,
    philosophy_text, intro_expanded_text, badges, social_links, about_content,
    created_at, updated_at
  ) VALUES (
    ${c.id}, ${c.name}, ${c.slug}, true, ${c.role},
    ${c.job_description}, ${c.job_url}, 'published', ${c.layout},
    ${JSON.stringify(c.theme_config)}, ${JSON.stringify(c.seo)},
    ${c.tagline}, ${c.hero_title}, ${c.hero_subtitle},
    ${c.philosophy_title}, ${c.philosophy_text}, ${c.intro_expanded_text},
    ${c.badges}, ${JSON.stringify(c.social_links)},
    ${JSON.stringify(c.about_content)}, ${now}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, slug = EXCLUDED.slug, is_active = true,
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
  SET application = ${JSON.stringify({ kind: 'application', stage: 'applied', fit_score: 87, applied_on: '2026-11-10' })}::jsonb
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
