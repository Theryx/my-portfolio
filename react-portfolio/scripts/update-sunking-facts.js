// Facts Ndouken confirmed on 2026-11-13 while scoring the Sun King application:
// the delivery riders' app kept some features working offline; he uses AI across the
// design workflow; he applies Material and Apple HIG for native components; he did part
// of PaySika's motion work; he worked with a content and copy writer; he can relocate
// to Lagos and is open to travel the company supports.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();

async function addHighlights(id, lines) {
  const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = ${id}`;
  const md = row.metadata;
  md.highlights = [...md.highlights.filter((h) => !lines.includes(h)), ...lines];
  await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = ${id}`;
  console.log(id, 'highlights ok');
}

async function appendLine(id, marker, line) {
  const [s] = await sql`SELECT content FROM warehouse_entries WHERE id = ${id}`;
  if (!s.content.includes(marker)) {
    await sql`UPDATE warehouse_entries SET content = ${s.content.trimEnd() + '\n' + line}, updated_at = ${now} WHERE id = ${id}`;
  }
  console.log(id, 'content ok');
}

async function upsertSkill(id, title, category, content) {
  await sql`
    INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
    VALUES (${id}, 'skill', ${title}, ${content}, ${JSON.stringify({ category })}::jsonb, ${[]}, false, 0, ${now}, ${now})
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, metadata = EXCLUDED.metadata, updated_at = ${now}`;
  console.log('upserted', id);
}

await addHighlights('experience:paysika', [
  'Designed the delivery riders\' app to keep working without internet for part of its features, because most riders used cheap smartphones on weak connections. Features that depend on the server, such as receiving new orders, needed a connection',
  'Worked with a content and copy writer on product copy',
  'Did part of the motion work myself: icon animations, illustration animations and video editing',
]);

await appendLine(
  'skill:product-and-interface-design',
  'delivery riders\' app',
  'PaySika: designed the delivery riders\' app so part of it kept working without internet, since most riders used cheap smartphones on weak connections. Receiving new orders still needed a connection.',
);
await appendLine(
  'skill:accessibility',
  'content and copy writer',
  'PaySika: worked with a content and copy writer on product copy for first-time card holders.',
);

await upsertSkill(
  'skill:ai-in-design-workflow',
  'AI in the design workflow',
  'Design',
  'I use AI across the design workflow: brainstorming, copy, design variations, prototypes, research and A/B testing.\nLouci, Cici and Estate manager (2026): designed and built with AI-assisted development.',
);
await upsertSkill(
  'skill:platform-conventions',
  'Material Design and Apple Human Interface Guidelines',
  'Design',
  'I apply Material Design and Apple Human Interface Guidelines principles and components when a product uses native components. Most product work also needs custom components, which I design on top of those conventions.',
);
await upsertSkill(
  'skill:motion-design',
  'Motion design',
  'Design',
  'PaySika: did part of the motion work myself, including icon animations, illustration animations and video editing, alongside the motion designer the team later hired.',
);

const [n] = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'note:job-targets'`;
const md = n.metadata;
md.mobility = 'Can relocate to Lagos, where I have family. Open to regular travel when the company supports it.';
await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = 'note:job-targets'`;
console.log('note:job-targets mobility ok');
