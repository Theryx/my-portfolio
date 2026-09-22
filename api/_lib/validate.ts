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

// Validate a list of profile ids (many-to-many). Accepts `undefined` only when
// the caller opts in via `{ required: false }`.
export function isProfileIdList(v: unknown, { required = true } = {}): boolean {
  if (v === undefined || v === null) return !required;
  if (!Array.isArray(v) || v.length < 1) return false;
  return v.every(isId);
}

function isFaqArray(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (!Array.isArray(v)) return false;
  return v.every((f) => {
    if (!f || typeof f !== 'object' || Array.isArray(f)) return false;
    const { question, answer } = f as Record<string, unknown>;
    return (
      typeof question === 'string' && question.length <= SHORT_TEXT &&
      typeof answer === 'string' && answer.length <= LONG_TEXT
    );
  });
}

// Per-profile About content: a small bag of optional strings plus a faqs array.
export function isAboutContent(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v !== 'object' || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  const shortFields = ['location', 'location_label', 'languages', 'languages_label', 'speaking_image'] as const;
  for (const f of shortFields) {
    if (!isShortText(o[f], { required: false })) return false;
  }
  for (const f of ['fun_fact', 'speaking_intro'] as const) {
    if (!isLongText(o[f])) return false;
  }
  // speaking_images: array of up to 3 URLs/filenames.
  if (o.speaking_images !== undefined && o.speaking_images !== null) {
    if (!Array.isArray(o.speaking_images)) return false;
    if (o.speaking_images.length > 3) return false;
    for (const item of o.speaking_images) {
      if (typeof item !== 'string' || item.length > SHORT_TEXT) return false;
    }
  }
  return isFaqArray(o.faqs);
}

// Structured project case-study sections. An ordered array of typed blocks,
// each a small object whose shape depends on `type`. Kept permissive on optional
// fields but strict on types, string lengths, and array bounds.
const BLOCK_TYPES = new Set(['intro', 'stat-cards', 'gallery', 'photos', 'richtext']);
function isShort(v: unknown): boolean { return v === undefined || v === null || (typeof v === 'string' && v.length <= SHORT_TEXT); }
export function isContentBlocks(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (!Array.isArray(v) || v.length > 50) return false;
  return v.every((blk) => {
    if (!blk || typeof blk !== 'object' || Array.isArray(blk)) return false;
    const o = blk as Record<string, unknown>;
    if (typeof o.type !== 'string' || !BLOCK_TYPES.has(o.type)) return false;
    switch (o.type) {
      case 'intro':
        return isShort(o.eyebrow) && typeof o.heading === 'string' && o.heading.length <= SHORT_TEXT && isLongText(o.text);
      case 'richtext':
        return isLongText(o.markdown);
      case 'stat-cards': {
        if (!Array.isArray(o.cards) || o.cards.length > 30) return false;
        return o.cards.every((c) => {
          if (!c || typeof c !== 'object' || Array.isArray(c)) return false;
          const card = c as Record<string, unknown>;
          return isShort(card.icon) && typeof card.title === 'string' && card.title.length <= SHORT_TEXT
            && isLongText(card.text) && isShort(card.note);
        });
      }
      case 'gallery':
      case 'photos': {
        if (!isShort(o.eyebrow) || !isShort(o.heading) || !isLongText(o.text)) return false;
        if (!Array.isArray(o.items) || o.items.length > 30) return false;
        return o.items.every((it) => {
          if (!it || typeof it !== 'object' || Array.isArray(it)) return false;
          const item = it as Record<string, unknown>;
          if (typeof item.image !== 'string' || item.image.length > SHORT_TEXT) return false;
          return isShort(item.title) && isLongText(item.description) && isLongText(item.caption);
        });
      }
      default:
        return false;
    }
  });
}

export function validateProjectBody(b: Record<string, unknown>, { requireId = true } = {}): string | null {
  if (requireId && !isId(b.id)) return 'Invalid id';
  if (requireId && !isProfileIdList(b.profile_ids)) return 'Invalid profile_ids';
  if (!isShortText(b.title)) return 'Invalid title';
  for (const f of ['tag', 'tagline', 'image', 'impact', 'site', 'role', 'period', 'location', 'challenge', 'solution', 'result'] as const) {
    if (!isShortText(b[f], { required: false })) return `Invalid ${f}`;
  }
  for (const f of ['description', 'challenge_text', 'solution_text', 'result_text', 'content'] as const) {
    if (!isLongText(b[f])) return `Invalid ${f}`;
  }
  if (!isStringArray(b.responsibilities)) return 'Invalid responsibilities';
  if (!isContentBlocks(b.content_blocks)) return 'Invalid content_blocks';
  return null;
}

export function validateBlogBody(b: Record<string, unknown>, { requireId = true } = {}): string | null {
  if (requireId && !isId(b.id)) return 'Invalid id';
  if (requireId && !isProfileIdList(b.profile_ids)) return 'Invalid profile_ids';
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
  for (const f of ['tagline', 'hero_title'] as const) {
    if (!isShortText(b[f], { required: false })) return `Invalid ${f}`;
  }
  for (const f of ['bio', 'hero_subtitle', 'philosophy_title', 'philosophy_text', 'intro_expanded_text'] as const) {
    if (!isLongText(b[f])) return `Invalid ${f}`;
  }
  if (!isStringArray(b.badges)) return 'Invalid badges';
  if (!isAboutContent(b.about_content)) return 'Invalid about_content';
  if (b.social_links !== undefined && b.social_links !== null) {
    if (typeof b.social_links !== 'object' || Array.isArray(b.social_links)) return 'Invalid social_links';
    for (const [k, v] of Object.entries(b.social_links as Record<string, unknown>)) {
      if (typeof v !== 'string' || v.length > SHORT_TEXT || k.length > 100) return 'Invalid social_links';
    }
  }
  return null;
}

/* ── Warehouse model (companies / entries / assets) ───────────────────────── */

export const WAREHOUSE_ENTRY_TYPES = [
  'bio', 'experience', 'skill', 'education', 'project', 'testimonial',
  'note', 'article', 'research', 'contact', 'custom',
] as const;

function isPlainObject(v: unknown): boolean {
  return v !== undefined && v !== null && typeof v === 'object' && !Array.isArray(v);
}

// A free-form JSON object (metadata / theme_config / seo). Bounded loosely.
export function isJsonObject(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (!isPlainObject(v)) return false;
  return JSON.stringify(v).length <= LONG_TEXT;
}

export function isIdList(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (!Array.isArray(v)) return false;
  return v.every(isId);
}

// Rich company links: per-company ordering, visibility and content overrides.
export function isCompanyLinks(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (!Array.isArray(v) || v.length > 200) return false;
  return v.every((l) => {
    if (!l || typeof l !== 'object' || Array.isArray(l)) return false;
    const o = l as Record<string, unknown>;
    if (!isId(o.company_id)) return false;
    if (o.sort_order !== undefined && o.sort_order !== null && typeof o.sort_order !== 'number') return false;
    if (o.is_visible !== undefined && o.is_visible !== null && typeof o.is_visible !== 'boolean') return false;
    if (!isLongText(o.override_content)) return false;
    if (!isJsonObject(o.override_metadata)) return false;
    return true;
  });
}

export function validateCompanyBody(b: Record<string, unknown>): string | null {
  if (!isShortText(b.name)) return 'Invalid name';
  if (b.id !== undefined && !isId(b.id)) return 'Invalid id';
  if (b.slug !== undefined && !isId(b.slug)) return 'Invalid slug';
  for (const f of ['role', 'job_url', 'status', 'layout', 'tagline', 'hero_title'] as const) {
    if (!isShortText(b[f], { required: false })) return `Invalid ${f}`;
  }
  for (const f of ['job_description', 'bio', 'hero_subtitle', 'philosophy_title', 'philosophy_text', 'intro_expanded_text'] as const) {
    if (!isLongText(b[f])) return `Invalid ${f}`;
  }
  if (!isStringArray(b.badges)) return 'Invalid badges';
  if (!isAboutContent(b.about_content)) return 'Invalid about_content';
  if (!isJsonObject(b.theme_config)) return 'Invalid theme_config';
  if (!isJsonObject(b.seo)) return 'Invalid seo';
  if (b.social_links !== undefined && b.social_links !== null) {
    if (!isPlainObject(b.social_links)) return 'Invalid social_links';
    for (const [k, v] of Object.entries(b.social_links as Record<string, unknown>)) {
      if (typeof v !== 'string' || v.length > SHORT_TEXT || k.length > 100) return 'Invalid social_links';
    }
  }
  return null;
}

export function validateWarehouseEntryBody(b: Record<string, unknown>): string | null {
  if (b.id !== undefined && !isId(b.id)) return 'Invalid id';
  if (!isShortText(b.type)) return 'Invalid type';
  if (!isShortText(b.title)) return 'Invalid title';
  if (!isLongText(b.content)) return 'Invalid content';
  if (!isJsonObject(b.metadata)) return 'Invalid metadata';
  if (!isStringArray(b.tags)) return 'Invalid tags';
  if (b.company_ids !== undefined && !isIdList(b.company_ids)) return 'Invalid company_ids';
  if (!isCompanyLinks(b.company_links)) return 'Invalid company_links';
  if (b.asset_ids !== undefined && !isIdList(b.asset_ids)) return 'Invalid asset_ids';
  if (b.sort_order !== undefined && b.sort_order !== null && typeof b.sort_order !== 'number') {
    return 'Invalid sort_order';
  }
  if (b.is_hidden !== undefined && b.is_hidden !== null && typeof b.is_hidden !== 'boolean') {
    return 'Invalid is_hidden';
  }
  return null;
}

export function validateAssetBody(b: Record<string, unknown>, { requireId = true } = {}): string | null {
  if (requireId && !isId(b.id)) return 'Invalid id';
  if (!isShortText(b.filename)) return 'Invalid filename';
  if (!isShortText(b.url)) return 'Invalid url';
  for (const f of ['mime_type'] as const) {
    if (!isShortText(b[f], { required: false })) return `Invalid ${f}`;
  }
  if (!isLongText(b.description)) return 'Invalid description';
  if (!isStringArray(b.tags)) return 'Invalid tags';
  return null;
}
