import type { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

export function verifyAuth(req: IncomingMessage): boolean {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return false;
    const cookies = parse(cookieHeader);
    const token = cookies['admin_token'];
    if (!token) return false;
    jwt.verify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export function requireAuth(req: IncomingMessage): void {
  if (!verifyAuth(req)) {
    const err = new Error('Unauthorized') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }
}
