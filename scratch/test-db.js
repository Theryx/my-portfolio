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
  const profiles = await sql`SELECT id, name, is_active FROM profiles`;
  console.log('Profiles:', profiles);
  const projects = await sql`SELECT id, title, profile_id FROM projects`;
  console.log('Projects:', projects);
  const posts = await sql`SELECT id, title FROM blog_posts`;
  console.log('Blog posts:', posts);
} catch (error) {
  console.error('Query failed:', error);
}
