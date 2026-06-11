import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { getJwtSecret } from '../_lib/auth.js';
import { getDb } from '../_lib/db.js';

// Best-effort per-instance rate limiting. Serverless instances don't share
// memory, but each warm instance throttles independently, which is enough to
// blunt brute-force attempts against a single admin account.
const attempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Constant-cost dummy hash so login takes the same time whether or not the
// email matches (prevents email enumeration via response timing).
const DUMMY_HASH = '$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBkkbCJq0DkmGpfdJVuzaZ0bdpjW7u';

function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return raw?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { email, password } = (req.body ?? {}) as { email?: unknown; password?: unknown };
    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 255 || password.length > 255) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const ip = clientIp(req);
    const now = Date.now();
    const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
    }
    recent.push(now);
    attempts.set(ip, recent);

    const sql = getDb();
    const rows = await sql`SELECT email, password_hash FROM admin_credentials WHERE id = 1`;
    if (!rows.length) return res.status(500).json({ error: 'Admin not configured' });

    const admin = rows[0] as { email: string; password_hash: string };
    const validEmail = email === admin.email;
    const validPassword = await bcrypt.compare(password, validEmail ? admin.password_hash : DUMMY_HASH);

    if (!validEmail || !validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    attempts.delete(ip);
    const token = jwt.sign({ email, sub: 'admin' }, getJwtSecret(), {
      algorithm: 'HS256',
      expiresIn: '7d',
    });

    res.setHeader(
      'Set-Cookie',
      serialize('admin_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
