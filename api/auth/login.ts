import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { getJwtSecret } from '../_lib/auth.js';
import { getDb } from '../_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body as { email: string; password: string };

  const sql = getDb();
  const rows = await sql`SELECT email, password_hash FROM admin_credentials WHERE id = 1`;
  if (!rows.length) return res.status(500).json({ error: 'Admin not configured' });

  const admin = rows[0] as { email: string; password_hash: string };
  const validEmail = email === admin.email;
  const validPassword = validEmail && (await bcrypt.compare(password, admin.password_hash));

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, getJwtSecret(), { expiresIn: '7d' });

  res.setHeader(
    'Set-Cookie',
    serialize('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  );

  return res.status(200).json({ ok: true });
}
