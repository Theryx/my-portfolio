import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gefonaStory } from './gefona-blocks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

const clean = (s) => (s == null ? s : String(s).replace(/[\u2013\u2014]/g, '-'));
const cleanDeep = (v) =>
  typeof v === 'string' ? clean(v)
    : Array.isArray(v) ? v.map(cleanDeep)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)]))
    : v;

const now = new Date().toISOString();

await sql`
  INSERT INTO assets (id, filename, url, mime_type, description, tags, created_at)
  VALUES (
    'asset:gefona-reports', 'gefona-reports.png', 'gefona-reports.png', 'image/png',
    'The published GEFONA research reports, 2020 and 2021 editions.',
    ${['gefona', 'research', 'reports']}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    filename = EXCLUDED.filename, url = EXCLUDED.url, mime_type = EXCLUDED.mime_type,
    description = EXCLUDED.description, tags = EXCLUDED.tags`;

const rows = await sql`SELECT metadata FROM warehouse_entries WHERE id = 'project:gefona_project-manager'`;
if (!rows.length) {
  console.error('project:gefona_project-manager not found');
  process.exit(1);
}
const meta = rows[0].metadata || {};
meta.content_blocks = gefonaStory;
meta.image = 'gefona-reports.png';
meta.tagline = 'Programme delivery across research, communications and finance.';
meta.description =
  'At the GEFONA Digital Foundation I ran delivery between research, communications and finance, and led the research itself: the 2020 report on application security in Cameroon and the 2021 edition across West and Central Africa.';

await sql`
  UPDATE warehouse_entries
  SET metadata = ${JSON.stringify(cleanDeep(meta))}::jsonb, updated_at = ${now}
  WHERE id = 'project:gefona_project-manager'`;

console.log('Updated GEFONA warehouse entry and asset.');
