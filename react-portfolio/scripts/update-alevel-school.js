// A Level school and field (Science), confirmed by Ndouken on 2026-11-10.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);

const rows = await sql`
  UPDATE warehouse_entries
  SET metadata = metadata || ${JSON.stringify({ school: 'GBHS Etoug-Ebe', location: 'Yaounde, Cameroon', field: 'Science' })}::jsonb,
      updated_at = ${new Date().toISOString()}
  WHERE id = 'education:gce-advanced-level'
  RETURNING id, metadata`;
console.log(rows);
