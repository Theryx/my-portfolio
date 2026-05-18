import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const sql = getDb();
  const profiles = await sql`SELECT * FROM profiles ORDER BY created_at ASC`;
  return res.status(200).json(profiles);
}
