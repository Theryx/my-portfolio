import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL not set');

const pool = new Pool({ connectionString: url });

const schema = readFileSync(join(__dirname, '../supabase-schema.sql'), 'utf8')
  .split('\n')
  .filter(line => {
    const l = line.trim().toUpperCase();
    return !l.startsWith('ALTER TABLE') &&
           !l.startsWith('CREATE POLICY') &&
           !l.startsWith('-- ROW LEVEL') &&
           !l.startsWith('-- ADMIN WRITE') &&
           !l.startsWith('-- PUBLIC READ');
  })
  .join('\n');

const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`Running ${statements.length} statements...`);

const client = await pool.connect();
try {
  for (const stmt of statements) {
    try {
      await client.query(stmt);
      const preview = stmt.replace(/\s+/g, ' ').slice(0, 70);
      console.log(`  ✓ ${preview}`);
    } catch (err) {
      const msg = err.message ?? String(err);
      if (msg.includes('already exists') || msg.includes('duplicate')) {
        const preview = stmt.replace(/\s+/g, ' ').slice(0, 70);
        console.log(`  ~ skipped (already exists): ${preview}`);
      } else {
        console.error(`  ✗ ${msg}`);
        console.error(`    ${stmt.slice(0, 120)}`);
      }
    }
  }
} finally {
  client.release();
  await pool.end();
}

console.log('\nMigration complete.');
