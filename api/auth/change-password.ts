import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { requireAuth } from '../_lib/auth.js';
import { getDb } from '../_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try { requireAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  const { currentPassword, newPassword, newEmail } = req.body as {
    currentPassword: string;
    newPassword?: string;
    newEmail?: string;
  };

  const sql = getDb();
  const rows = await sql`SELECT email, password_hash FROM admin_credentials WHERE id = 1`;
  if (!rows.length) return res.status(500).json({ error: 'Admin not configured' });

  const admin = rows[0] as { email: string; password_hash: string };
  const valid = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

  const updatedEmail = newEmail?.trim() || admin.email;
  const updatedHash = newPassword
    ? await bcrypt.hash(newPassword, 10)
    : admin.password_hash;

  await sql`
    UPDATE admin_credentials
    SET email = ${updatedEmail}, password_hash = ${updatedHash}, updated_at = NOW()
    WHERE id = 1
  `;

  return res.status(200).json({ ok: true });
}
