import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return res.status(200).json({
      defined: false,
      keys: Object.keys(process.env)
    });
  }

  let obfuscatedUrl = '';
  let passwordStart = '';
  try {
    const parsed = new URL(url);
    passwordStart = parsed.password ? parsed.password.substring(0, 6) : 'none';
    obfuscatedUrl = `${parsed.protocol}//${parsed.username}:******@${parsed.host}${parsed.pathname}`;
  } catch (e) {
    obfuscatedUrl = 'Invalid URL format';
  }

  return res.status(200).json({
    defined: true,
    url: obfuscatedUrl,
    passwordPrefix: passwordStart,
    keys: Object.keys(process.env).filter(k => !k.includes('TOKEN') && !k.includes('SECRET') && !k.includes('PASSWORD'))
  });
}
