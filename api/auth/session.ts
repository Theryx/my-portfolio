import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ authenticated: verifyAuth(req) });
}
