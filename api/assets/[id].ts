import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  try {
    const sql = getDb();
    const { id } = req.query as { id: string };

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM assets WHERE id = ${id}`;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      // entry_assets rows cascade. The stored file on Cloudinary is untouched.
      await sql`DELETE FROM assets WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).end();
  } catch (err) {
    console.error(`${req.method} /api/assets/${req.query.id} error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
