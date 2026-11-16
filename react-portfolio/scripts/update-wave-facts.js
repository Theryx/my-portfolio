// Facts Ndouken confirmed on 2026-11-16 while scoring the Wave application:
// he prototyped and built Android APK builds with Claude and Expo (proof on Expo account);
// he used Rive, Figma motion and Lottie at PaySika; and he confirmed Kody (Shomi)
// ran 12.2019 - 12.2020.
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
const now = new Date().toISOString();

async function upsertSkill(id, title, category, content) {
  await sql`
    INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
    VALUES (${id}, 'skill', ${title}, ${content}, ${JSON.stringify({ category })}::jsonb, ${[]}, false, 0, ${now}, ${now})
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, metadata = EXCLUDED.metadata, updated_at = ${now}`;
  console.log('upserted', id);
}

await upsertSkill(
  'skill:ai-in-design-workflow',
  'AI in the design workflow',
  'Design',
  [
    'I use AI across the design workflow: brainstorming, copy, design variations, prototypes, research and A/B testing.',
    'Louci, Cici and Estate manager (2026): designed and built with AI-assisted development, including prototyping and building Android APK builds with Claude and Expo.',
    'PaySika riders\' app (Apr to Jun 2026): designed in Figma with Claude and prototyped in Figma Make before engineers built it.',
  ].join('\n'),
);

await upsertSkill(
  'skill:motion-design',
  'Motion design',
  'Design',
  'PaySika: did part of the motion work myself using Rive, Figma motion and Lottie, including icon animations, illustration animations and video editing, alongside the motion designer the team later hired.',
);

const [paysikaRow] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:paysika'`;
if (!paysikaRow) throw new Error('Missing warehouse entry: experience:paysika');
const paysikaMd = paysikaRow.metadata;
const oldMotionLine = 'Did part of the motion work myself: icon animations, illustration animations and video editing';
const newMotionLine = 'Did part of the motion work myself using Rive, Figma motion and Lottie: icon animations, illustration animations and video editing';
const currentHighlights = Array.isArray(paysikaMd.highlights) ? paysikaMd.highlights : [];
paysikaMd.highlights = currentHighlights.some((h) => h === oldMotionLine || h === newMotionLine)
  ? currentHighlights.map((h) => (h === oldMotionLine ? newMotionLine : h))
  : [...currentHighlights, newMotionLine];
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(paysikaMd)}::jsonb, updated_at = ${now} WHERE id = 'experience:paysika'`;
console.log('experience:paysika highlights ok');

const [shomiRow] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'experience:shomi-kody'`;
if (!shomiRow) throw new Error('Missing warehouse entry: experience:shomi-kody');
const shomiMd = shomiRow.metadata;
shomiMd.unconfirmed = (shomiMd.unconfirmed ?? []).filter((item) => item !== 'period');
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(shomiMd)}::jsonb, updated_at = ${now} WHERE id = 'experience:shomi-kody'`;
console.log('experience:shomi-kody unconfirmed ok:', shomiMd.unconfirmed);
