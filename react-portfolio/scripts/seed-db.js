import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse .env.local for DATABASE_URL
const envPath = path.join(__dirname, '../../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const match = envFile.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!match) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const databaseUrl = match[1];
console.log('Connecting to Neon database via Pool...');
const pool = new Pool({ connectionString: databaseUrl });

try {
  const sqlPath = path.join(__dirname, '../populate-data.sql');
  console.log('Reading populate-data.sql...');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log('Executing database seed script via Pool.query...');
  const client = await pool.connect();
  try {
    await client.query(sqlContent);
  } finally {
    client.release();
  }
  console.log('Database successfully seeded from populate-data.sql!');
} catch (err) {
  console.error('Error seeding database:', err);
  process.exit(1);
} finally {
  await pool.end();
}
