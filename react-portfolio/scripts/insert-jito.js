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

const company = {
  id: 'jito',
  slug: 'jito',
  name: 'Jito Foundation',
  role: 'Product Designer',
  job_url: JOB_URL,
  layout: 'jito-terminal-v1',
  tagline: 'Designing the layer where execution speed becomes trust.',
  hero_title: 'Clear at a glance. Fast under pressure.',
  hero_subtitle:
    'Product designer for dense, high-stakes financial surfaces. I make the screen a trader reads in half a second legible and trustworthy — and I own the token systems engineers ship it with.',
  philosophy_title: 'In a trading app, clarity is the product.',
  philosophy_text:
    'A trader under pressure does not read your interface, they scan it. Hierarchy, number formatting and state are not polish; they decide whether the right order goes through or the wrong one does. The job is to make the screen answer before the question is finished.',
  intro_expanded_text:
    'Four years leading design at PaySika, a regulated African fintech: onboarding, KYC, transaction history, card operations and the back office behind them, plus the semantic token system that kept mobile, web and internal tools visually honest. The screens were dense, the stakes were real money, and the wins were measured in retention and support tickets. JTX is the same problem with a faster clock.',
  badges: [
    'Product Design · Fintech',
    'Token-based design systems',
    'Figma ↔ Engineering',
    'Dense UI · Clarity under pressure',
  ],
  job_description: `Product Designer at Jito Foundation, focused mainly on JTX — a live, self-custodial trading app running on Solana, with native mobile apps in development. Work spans UX and UI for web and native mobile: order entry, market data, charts, positions, execution visibility, onboarding and wallet flows. Small team, product-market fit already found. The core challenge is making JTX feel clear and trustworthy at a glance, keeping web and mobile consistent, and owning/improving the design system and token library engineers use. Also helps with marketing design and other Jito products. Requirements: strong product sense, ability to diagnose hierarchy/clarity issues on busy screens, comfort across research/UX/UI, independent working with proactive collaboration, direct feedback, and fluency in Figma plus token-based design systems. Preferred: B2C crypto or fintech, trading/exchange products, consumer fintech at scale, data-dense or real-time interfaces, self-custodial wallets (Solana/EVM), and design-system experience.`,
  social_links: {
    email: 'ndouken@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
    resume: 'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs',
    company_name: 'Jito Foundation',
    role_target: 'Product Designer',
    job_url: JOB_URL,
    now: 'Targeted profile for Jito Foundation — Product Designer (JTX)',
    projects_intro: 'Regulated fintech surfaces and the token systems behind them.',
    blog_intro: 'Notes on clarity, trust and shipping design with engineering.',
    metric_label: 'years designing financial products',
  },
  about_content: {
    faqs: [
      {
        question: 'You have not designed a trading terminal. Why JTX?',
        answer:
          'Straight answer: I have not. What I have done for four years is design dense, high-stakes financial screens where the cost of a misread is real money: onboarding, KYC, transaction history, card and back-office operations. The core craft transfers. What is new is the market itself, and I would rather say that plainly than pretend otherwise.',
      },
      {
        question: 'What does "clear at a glance" mean to you?',
        answer:
          'A trader under pressure scans before they read. So hierarchy, number formatting and state have to answer before the question is finished. At PaySika I rewrote the transaction list so a missing payment is findable in under five seconds without scrolling. Same discipline, applied to positions and execution.',
      },
      {
        question: 'How do you work with engineering on a design system?',
        answer:
          'Semantic tokens first, same names on both sides. Figma variables and code tokens share a vocabulary, so when someone says the accent is too saturated an engineer can search the codebase and find every usage. I also work directly in the repo, reviewing PRs and resolving edge cases rather than throwing specs over a wall.',
      },
      {
        question: 'You are remote and outside EST. Does that work?',
        answer:
          'I have worked remote-first across Africa and Europe for years, and I keep a written trail so decisions do not depend on being in the room. I am willing to hold regular EST meetings and overlap deliberately for the moments that matter.',
      },
    ],
  },
  theme_config: {
    concept: 'tape-ledger',
    accent: '#2CE5A7',
    gradient: ['#9945FF', '#14F195'],
  },
  seo: {
    title: 'Ndouken Theryx — Product Designer for Jito (JTX)',
    description: 'Designing the layer where execution speed becomes trust.',
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
