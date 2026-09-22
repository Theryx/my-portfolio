import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getDb } from '../_lib/db.js';
import { requireAuth } from '../_lib/auth.js';
import { validateAssetBody, isId } from '../_lib/validate.js';

// The asset library: images, PDFs, resumes — anything the warehouse can
// reference. Files live on Cloudinary; we store the URL + metadata.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  try {
    const sql = getDb();

    if (req.method === 'GET') {
      const { search } = req.query as { search?: string };
      const rows = search
        ? await sql`
            SELECT * FROM assets
            WHERE filename ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`} OR url ILIKE ${`%${search}%`}
            ORDER BY created_at DESC
          `
        : await sql`SELECT * FROM assets ORDER BY created_at DESC`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const b = req.body ?? {};
      // Derive a stable id from the URL when the caller doesn't supply one.
      if (!b.id && typeof b.url === 'string' && b.url.trim()) {
        b.id = `asset:${crypto.createHash('sha1').update(b.url.trim()).digest('hex').slice(0, 14)}`;
      }
      const validationError = validateAssetBody(b);
      if (validationError) return res.status(400).json({ error: validationError });
      if (!isId(b.id)) return res.status(400).json({ error: 'Invalid id' });
      const now = new Date().toISOString();
      const rows = await sql`
        INSERT INTO assets (id, filename, url, mime_type, size, description, tags, created_at)
        VALUES (${b.id}, ${b.filename}, ${b.url}, ${b.mime_type ?? null}, ${b.size ?? null},
                ${b.description ?? null}, ${b.tags ?? []}, ${now})
        ON CONFLICT (id) DO UPDATE SET
          filename = EXCLUDED.filename, url = EXCLUDED.url, mime_type = EXCLUDED.mime_type,
          size = EXCLUDED.size, description = EXCLUDED.description, tags = EXCLUDED.tags
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    return res.status(405).end();
  } catch (err) {
    console.error(`${req.method} /api/assets error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
