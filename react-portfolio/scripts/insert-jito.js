import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../../.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

const JOB_URL = 'https://jobs.lever.co/jito/97151aba-e3eb-483d-b56c-34711b873760';

// Neutral portfolio copy. No tailoring language, no em dashes.
const company = {
  id: 'jito',
  slug: 'jito',
  name: 'Jito Foundation',
  role: 'Product Designer',
  job_url: JOB_URL,
  layout: 'jito-portfolio-v1',
  tagline: 'Product designer working across fintech, design systems and dense interfaces.',
  hero_title: 'Ndouken Theryx',
  hero_subtitle:
    'Product designer with four years in regulated fintech. I work across research, interface and front-end code, and I build the token systems that keep design and engineering in sync.',
  philosophy_title: 'Clarity is the product.',
  philosophy_text:
    'Dense financial screens are scanned, not studied. Hierarchy, number formatting and state decide whether the right action happens. I design for the half second a person actually has.',
  intro_expanded_text:
    'For nearly four years I led design at PaySika, an African fintech, working on onboarding, KYC, transactions and the operations behind them, plus the semantic token system that kept mobile, web and internal tools consistent. Before that I designed cross-border transfers at CrowdRemit and an education platform at Kody. I care about clear hierarchy, honest copy and shipping the work, not just drawing it.',
  badges: ['Fintech', 'Design systems', 'Figma and code'],
  job_description:
    'Product Designer role focused on a self-custodial trading app across web and native mobile. UX and UI for order entry, market data, charts, positions, onboarding and wallet flows, plus ownership of the design system and token library used by engineering.',
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/open?id=1YaPoFPM99oGFvA4fChx-QOSarJ2GGHI_&usp=drive_fs',
    company_name: 'Jito Foundation',
    role_target: 'Product Designer',
    job_url: JOB_URL,
    now: 'Open to product design roles',
    metric_label: 'years designing financial products',
  },
  about_content: {
    location: 'Douala, Cameroon',
    location_label: 'Douala, Cameroon',
    languages: 'English and French',
    languages_label: 'Bilingual, fully fluent',
    fun_fact: 'I value direct opinions, simple language, and a good plate of fish.',
  },
  theme_config: {
    concept: 'editorial-paper',
    accent: '#1E6F4B',
  },
  seo: {
    title: 'Ndouken Theryx, Product Designer',
    description: 'Product designer working across fintech, design systems and dense interfaces.',
  },
};

const links = [
  { entry_id: 'project:paysika_fintech', sort_order: 0 },
  { entry_id: 'project:paysika-ds_design-engineer', sort_order: 1 },
  { entry_id: 'project:crowdremit_fintech', sort_order: 2 },
  { entry_id: 'project:portfolio_design-engineer', sort_order: 3 },
  { entry_id: 'project:shomi_default', sort_order: 4 },
  { entry_id: 'project:jobsika_design-engineer', sort_order: 5 },
  { entry_id: 'article:fintech_trust', sort_order: 0 },
  { entry_id: 'article:how-i-design-features-that-reduce-customer-support-tickets', sort_order: 1 },
  { entry_id: 'article:building-a-design-system-in-a-startup-with-limited-resources', sort_order: 2 },
  { entry_id: 'article:How-I-Use-Claude-Figma-Make-to-Ship-Mobile-Screens-Faster', sort_order: 3 },
];

const now = new Date().toISOString();

await sql`
  INSERT INTO companies (
    id, name, slug, is_active, role, job_description, job_url, status, layout,
    theme_config, seo, tagline, hero_title, hero_subtitle, philosophy_title,
    philosophy_text, intro_expanded_text, badges, social_links, about_content,
    created_at, updated_at
  ) VALUES (
    ${company.id}, ${company.name}, ${company.slug}, false, ${company.role},
    ${company.job_description}, ${company.job_url}, 'published', ${company.layout},
    ${JSON.stringify(company.theme_config)}, ${JSON.stringify(company.seo)},
    ${company.tagline}, ${company.hero_title}, ${company.hero_subtitle},
    ${company.philosophy_title}, ${company.philosophy_text}, ${company.intro_expanded_text},
    ${company.badges}, ${JSON.stringify(company.social_links)},
    ${JSON.stringify(company.about_content)}, ${now}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, slug = EXCLUDED.slug, is_active = EXCLUDED.is_active,
    role = EXCLUDED.role, job_description = EXCLUDED.job_description,
    job_url = EXCLUDED.job_url, layout = EXCLUDED.layout,
    theme_config = EXCLUDED.theme_config, seo = EXCLUDED.seo,
    tagline = EXCLUDED.tagline, hero_title = EXCLUDED.hero_title,
    hero_subtitle = EXCLUDED.hero_subtitle, philosophy_title = EXCLUDED.philosophy_title,
    philosophy_text = EXCLUDED.philosophy_text, intro_expanded_text = EXCLUDED.intro_expanded_text,
    badges = EXCLUDED.badges, social_links = EXCLUDED.social_links,
    about_content = EXCLUDED.about_content, updated_at = ${now}
`;

for (const l of links) {
  await sql`
    INSERT INTO company_entries (company_id, entry_id, sort_order, is_visible)
    VALUES (${company.id}, ${l.entry_id}, ${l.sort_order}, true)
    ON CONFLICT (company_id, entry_id) DO UPDATE SET
      sort_order = EXCLUDED.sort_order,
      is_visible = EXCLUDED.is_visible
  `;
}

const check = await sql`SELECT id, slug, name, is_active, layout FROM companies WHERE id = ${company.id}`;
const linkCount = await sql`SELECT COUNT(*)::int AS n FROM company_entries WHERE company_id = ${company.id}`;
console.log('Company:', check[0]);
console.log(`Linked entries: ${linkCount[0].n}`);
