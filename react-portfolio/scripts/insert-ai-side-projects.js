// New warehouse project: Louci and Cici as one piece about how Ndouken designs and builds
// with AI (he asked on 2026-11-13 to merge them, since readers care about the process more
// than the apps). The loop comes from article:de_ai ("AI in the loop, taste in the
// driver's seat") first; on 2026-11-13 he described how AI fits into designing them, and that
// replaced the build loop. The rules come from the Louci and Cici entries and his answers. Screens and captions
// come from scripts/add-app-screenshots.js and show invented demo data only.
// Also records the Gabon soft-launch facts behind the campaign access codes screen.
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

const blocks = [
  {
    type: 'intro',
    eyebrow: '2026',
    heading: 'Two side projects, built with AI',
    text: 'Louci is a personal finance app for Cameroon that works out what is safe to spend before the next income. Cici pulls what needs my attention from my other apps into one list and suggests what to do next. I designed both and built them with AI, using Claude, Codex and Antigravity. This page is about how AI fits into designing them.',
  },
  {
    type: 'steps',
    eyebrow: 'The process',
    heading: 'How AI fits into the design',
    text: 'There is no single process. It goes back and forth, and each project is a bit different, but the same parts keep coming back.',
    items: [
      { title: 'Research first', text: 'I start by looking at what already exists, on Dribbble, Behance and Mobbin. Claude helps with the research.' },
      { title: 'Brainstorm and look for gaps', text: 'AI helps me brainstorm, find gaps and challenge my ideas before I commit to one.' },
      { title: 'A quick proof of concept', text: 'AI builds a rough working version fast, so I can try an idea instead of imagining it.' },
      { title: 'AI sets the skeleton, I refine the edges', text: 'It is co-creation. AI proposes the structure, and the details and the decisions are mine.' },
      { title: 'Reviews', text: 'AI checks the UI copy and looks for gaps and inconsistencies in the flows.' },
    ],
  },
  {
    type: 'richtext',
    markdown: 'It does not always go well. Several times AI proposed a design that was completely off from what I had in mind, and it is not good at accessibility, so I check that myself.',
  },
  {
    type: 'steps',
    eyebrow: 'Inside the apps',
    heading: 'Where the AI stops',
    items: [
      { title: 'It never calculates a number', text: 'In Louci the assistant answers questions about your own data, but every figure comes from tested code, not from the model.' },
      { title: 'Nothing changes without a yes', text: 'When building, AI never writes to the database or creates anything without my approval. Changes the Louci assistant proposes wait on a card that shows each field, and deleting was left out on purpose. In Cici, anything with a risk or a cost waits for my confirmation.' },
      { title: 'Everything is logged', text: 'Cici keeps a plain-language log of every sync, suggestion and action, with the state before and after.' },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'The screens',
    heading: 'Louci and Cici',
    text: 'Every screen below runs on invented demo data.',
    items: [
      { image: 'louci-dashboard.png', title: 'Louci: dashboard', description: 'Available money, upcoming bills and what is left to spend today.' },
      { image: 'louci-assistant.png', title: 'Louci: the assistant', description: 'Answers questions about your own data. It never calculates a number or changes anything without a confirmation.' },
      { image: 'cici-01-plate.png', title: 'Cici: the Plate', description: 'Everything that needs attention, from my apps and my own tasks, in one list.' },
      { image: 'cici-04-suggestion-awaiting-confirm.png', title: 'Cici: waiting for a yes', description: 'A suggestion waits for my confirmation before anything changes.' },
    ],
  },
];

const entry = {
  id: 'project:ai-side-projects',
  type: 'project',
  title: 'Louci and Cici',
  tags: ['Side projects · Designing and building with AI'],
  metadata: {
    tag: 'Side projects · Designing and building with AI',
    role: 'Designer and builder (AI-assisted development)',
    period: '2026',
    location: 'Douala, Cameroon',
    image: 'cici-01-plate.png',
    tagline: 'Two side projects, and how AI fits into the way I design them.',
    description:
      'Louci, a personal finance app for Cameroon, and Cici, a list of what needs my attention across my apps. I designed both and built them with AI-assisted development, with firm rules on what the AI is allowed to do.',
    responsibilities: [
      'Designed and built Louci and Cici with AI-assisted development',
      'Kept the AI away from numbers in Louci: every figure comes from tested code',
      'Made every AI-proposed change wait for a confirmation, and logged every action in Cici',
    ],
    related: ['project:louci-finance', 'project:cici-command-center'],
    notes: ['Screens resolve through the project image map (src/data/projects.ts, apps screenshots).'],
    content_blocks: blocks,
    source_project_id: 'ai-side-projects',
  },
};

await sql`
  INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
  VALUES (${entry.id}, ${entry.type}, ${entry.title}, ${''},
    ${JSON.stringify(cleanDeep(entry.metadata))}::jsonb, ${entry.tags}, ${false}, ${0}, ${now}, ${now})
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, metadata = EXCLUDED.metadata,
    tags = EXCLUDED.tags, updated_at = ${now}`;
console.log('upserted', entry.id);

// Gabon soft launch: the campaign access codes.
const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:paysika'`;
const md = row.metadata;
const OLD = 'Designed back-office tools for the team, including the identity check (KYC) backlog and review screen, and campaign access codes';
const LINES = [
  'Designed back-office tools for the team, including the identity check (KYC) backlog and review screen',
  'Designed the access-code screen marketing used for the soft launch in Gabon: codes were handed out gradually, each capped at a set number of users (450 for one code)',
];
md.highlights = [...md.highlights.filter((h) => h !== OLD && !LINES.includes(h)), ...LINES];
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = 'experience:paysika'`;
console.log('experience:paysika access codes ok');
