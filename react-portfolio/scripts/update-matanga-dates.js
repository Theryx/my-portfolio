// Confirmed by Ndouken on 2026-11-10: Matanga Agency, 12.2023 - 02.2024.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);

const rows = await sql`
  UPDATE warehouse_entries
  SET metadata = metadata || ${JSON.stringify({ period: '12.2023 - 02.2024' })}::jsonb, updated_at = now()
  WHERE id = 'experience:matanga'
  RETURNING id, metadata->>'period' AS period`;
console.log(rows);
