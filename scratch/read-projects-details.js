import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const url = env.DATABASE_URL;

try {
  const sql = neon(url);
  const projects = await sql`SELECT * FROM projects`;
  for (const p of projects) {
    console.log(`Project: ${p.id} (${p.title})`);
    console.log(`  profile_id: ${p.profile_id}`);
    console.log(`  image: ${p.image}`);
    console.log(`  is_hidden: ${p.is_hidden}`);
    console.log(`  sort_order: ${p.sort_order}`);
    console.log(`  tag: ${p.tag}`);
    console.log(`  tagline: ${p.tagline}`);
    console.log(`  description: ${p.description ? p.description.substring(0, 50) + '...' : null}`);
    console.log(`  responsibilities:`, p.responsibilities);
    console.log('---');
  }
} catch (error) {
  console.error('Query failed:', error);
}
