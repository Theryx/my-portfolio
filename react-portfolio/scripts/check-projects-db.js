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
    SELECT id, title, profile_id 
    FROM projects
  `;
  const profiles = await sql`
    SELECT id, name, is_active 
    FROM profiles
  `;
  console.log('All database projects:');
  console.log(rows);
  console.log('All database profiles:');
  console.log(profiles);
} catch (err) {
  console.error('Error fetching from database:', err);
}
