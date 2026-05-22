import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Parse .env.local for DATABASE_URL
const envFile = fs.readFileSync('.env.local', 'utf8');
const match = envFile.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!match) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const databaseUrl = match[1];
console.log('Connecting to database...');

const sql = neon(databaseUrl);

try {
  const rows = await sql`
    SELECT id, title, image, substring(content, 1, 150) as content_start, length(content) as content_length 
    FROM projects 
    WHERE id LIKE '%shomi%' OR id LIKE '%default%'
  `;
  console.log('Database rows matching shomi/default:');
  console.log(JSON.stringify(rows, null, 2));
} catch (err) {
  console.error('Error fetching from database:', err);
}
