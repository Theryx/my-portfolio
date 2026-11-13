// Facts Ndouken confirmed on 2026-11-12 while scoring the Product Designer application:
// competitive analysis is part of every project; he designed PaySika's Meta and Google ad
// creative; he designed flyers, roll-up banners and brochures at PaySika (fair stands
// included) and flyers and brochures for GUEEMSHOME. Added 2026-11-13: he designed the
// fair stand entrance, photo booth frame, team t-shirts and badges; and the Shomi
// launch ad for the Play Store.
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
  console.log(id, md.highlights.slice(-lines.length));
}

await addHighlights('experience:paysika', [
  'Designed the paid ad creative for Meta and Google',
  'Designed flyers, roll-up banners and brochures, including the material for the fair stands',
  'Ran a competitive analysis of other apps before designing new features',
  'Designed the fair stand entrance, the photo booth frame, the team t-shirts and the badges',
]);
await addHighlights('experience:gueemshome', ['Designed flyers and brochures']);
await addHighlights('experience:shomi-kody', ['Designed the Shomi launch ad for the Play Store']);

const SKILL = 'skill:user-research-and-usability-testing';
const LINE = 'Competitive analysis: part of how I start every project, including PaySika, Kody, Loving Tech and GUEEMSHOME.';
const [s] = await sql`SELECT content FROM warehouse_entries WHERE id = ${SKILL}`;
if (!s.content.includes('Competitive analysis: part of')) {
  await sql`UPDATE warehouse_entries SET content = ${s.content.trimEnd() + '\n' + LINE}, updated_at = ${now} WHERE id = ${SKILL}`;
}
console.log(SKILL, 'ok');
