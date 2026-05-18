import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INT PRIMARY KEY DEFAULT 1,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const hash = bcrypt.hashSync('Portfolio123#', 10);
  await client.query(
    `INSERT INTO admin_credentials (id, email, password_hash)
     VALUES (1, $1, $2)
     ON CONFLICT (id) DO UPDATE SET email=$1, password_hash=$2, updated_at=NOW()`,
    ['ndouken@gmail.com', hash]
  );

  console.log('admin_credentials table created and seeded.');
  console.log('Email: ndouken@gmail.com');
} finally {
  client.release();
  await pool.end();
}
