// Certificates listed on Ndouken's own CV (confirmed 2026-11-10). Issuers not on the CV are left empty.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();

const certs = [
  { id: 'education:cert-google-project-management', title: 'Google Project Management Certificate', period: 'In progress, since Aug 2026', school: 'Google', status: 'in_progress' },
  { id: 'education:cert-empathy-in-ux-design', title: 'Empathy in UX Design', period: 'Feb 2020' },
  { id: 'education:cert-human-product-interaction-design', title: 'Human-Product Interaction Design', period: 'Feb 2020' },
  { id: 'education:cert-graphic-design-foundations-typography', title: 'Graphic Design Foundations: Typography', period: 'Feb 2020' },
];

for (const c of certs) {
  const metadata = { kind: 'certificate', degree: c.title, period: c.period, school: c.school || '', ...(c.status ? { status: c.status } : {}) };
  const content = c.status ? `${c.title}, in progress since Aug 2026.` : `Certificate issued ${c.period}.`;
  await sql`
    INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
    VALUES (${c.id}, 'education', ${c.title}, ${content}, ${JSON.stringify(metadata)}::jsonb, ${['certificate']}, false, 20, ${now}, ${now})
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, metadata = EXCLUDED.metadata, updated_at = ${now}`;
  console.log('upserted', c.id);
}
