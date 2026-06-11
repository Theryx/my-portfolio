// Lightweight request validation helpers for the serverless endpoints.

const SHORT_TEXT = 500;
const LONG_TEXT = 100_000;

export function isShortText(v: unknown, { required = true } = {}): boolean {
  if (v === undefined || v === null || v === '') return !required;
  return typeof v === 'string' && v.length <= SHORT_TEXT;
}

export function isLongText(v: unknown): boolean {
  if (v === undefined || v === null || v === '') return true;
  return typeof v === 'string' && v.length <= LONG_TEXT;
}

export function isStringArray(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  return Array.isArray(v) && v.every((s) => typeof s === 'string' && s.length <= SHORT_TEXT);
}

export function isId(v: unknown): boolean {
  return typeof v === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(v);
}

export function validateProjectBody(b: Record<string, unknown>, { requireId = true } = {}): string | null {
  if (requireId && !isId(b.id)) return 'Invalid id';
  if (requireId && !isId(b.profile_id)) return 'Invalid profile_id';
  if (!isShortText(b.title)) return 'Invalid title';
  for (const f of ['tag', 'tagline', 'image', 'impact', 'site', 'role', 'period', 'location', 'challenge', 'solution', 'result'] as const) {
    if (!isShortText(b[f], { required: false })) return `Invalid ${f}`;
  }
  for (const f of ['description', 'challenge_text', 'solution_text', 'result_text', 'content'] as const) {
    if (!isLongText(b[f])) return `Invalid ${f}`;
  }
  if (!isStringArray(b.responsibilities)) return 'Invalid responsibilities';
  return null;
}

export function validateBlogBody(b: Record<string, unknown>, { requireId = true } = {}): string | null {
  if (requireId && !isId(b.id)) return 'Invalid id';
  if (requireId && !isId(b.profile_id)) return 'Invalid profile_id';
  if (!isShortText(b.title)) return 'Invalid title';
  for (const f of ['date', 'author', 'read_time', 'image'] as const) {
    if (!isShortText(b[f], { required: false })) return `Invalid ${f}`;
  }
  if (!isLongText(b.excerpt) || !isLongText(b.content)) return 'Invalid content';
  if (!isStringArray(b.tags)) return 'Invalid tags';
  return null;
}

export function validateProfileBody(b: Record<string, unknown>): string | null {
  if (!isShortText(b.name)) return 'Invalid name';
  for (const f of ['bio', 'tagline', 'hero_title'] as const) {
    if (!isShortText(b[f], { required: false })) return `Invalid ${f}`;
  }
  for (const f of ['hero_subtitle', 'philosophy_title', 'philosophy_text'] as const) {
    if (!isLongText(b[f])) return `Invalid ${f}`;
  }
  if (!isStringArray(b.badges)) return 'Invalid badges';
  if (b.social_links !== undefined && b.social_links !== null) {
    if (typeof b.social_links !== 'object' || Array.isArray(b.social_links)) return 'Invalid social_links';
    for (const [k, v] of Object.entries(b.social_links as Record<string, unknown>)) {
      if (typeof v !== 'string' || v.length > SHORT_TEXT || k.length > 100) return 'Invalid social_links';
    }
  }
  return null;
}
