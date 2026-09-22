import { projects as staticProjects, type Project as StaticProject } from '../data/projects';
import { blogPosts as staticBlogPosts, type BlogPost as StaticBlogPost } from '../data/blog';
import { profilePresets } from '../data/profileCopy';

export interface ProfileFaq {
  question: string;
  answer: string;
}

// Per-profile, CMS-editable content for the About page. Every field is optional;
// the About page falls back to a bundled default when a field is empty.
export interface AboutContent {
  location?: string;
  location_label?: string;
  languages?: string;
  languages_label?: string;
  fun_fact?: string;
  speaking_intro?: string;
  /** Legacy single image. Kept for back-compat with profiles edited before
   *  the multi-image upgrade — new edits write to `speaking_images`. */
  speaking_image?: string;
  /** Up to 3 images shown in the Research & Speaking collage. */
  speaking_images?: string[];
  faqs?: ProfileFaq[];
}

export interface Profile {
  id: string;
  name: string;
  is_active: boolean;
  bio: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  philosophy_title: string;
  philosophy_text: string;
  intro_expanded_text: string;
  badges: string[];
  social_links: Record<string, string>;
  about_content: AboutContent;
}

// --- Structured project case-study sections ("content blocks") ---
// An ordered, DB-stored array of typed blocks rendered by <ProjectSections>.
// Editable from the CMS (JSON) so case-study sections can be rewritten without
// a code change. Images accept a Cloudinary URL or a bundled filename.
export interface ProjectStatCard {
  icon?: string;      // whitelisted key, e.g. 'users' | 'clipboard' | 'target' | 'chart' | 'shield' | 'file' | 'award'
  title: string;
  text?: string;
  note?: string;      // small italic caption, e.g. a "screenshot to add" placeholder
}
export interface ProjectGalleryItem {
  image: string;
  title?: string;
  description?: string;
}
export interface ProjectPhotoItem {
  image: string;
  caption?: string;
}
export type ProjectBlock =
  | { type: 'intro'; eyebrow?: string; heading: string; text?: string }
  | { type: 'stat-cards'; variant?: 'artifacts'; cards: ProjectStatCard[] }
  | { type: 'gallery'; eyebrow?: string; heading?: string; text?: string; items: ProjectGalleryItem[] }
  | { type: 'photos'; heading?: string; text?: string; items: ProjectPhotoItem[] }
  | { type: 'richtext'; markdown: string };

export interface Project {
  id: string;
  profile_ids: string[];
  tag: string;
  title: string;
  tagline: string;
  image: string;
  description: string;
  impact: string;
  site: string;
  role: string;
  period: string;
  location: string;
  responsibilities: string[];
  challenge: string;
  challenge_text: string;
  solution: string;
  solution_text: string;
  result: string;
  result_text: string;
  is_hidden: boolean;
  sort_order: number;
  content: string;
  content_blocks?: ProjectBlock[];
}

export interface BlogPost {
  id: string;
  profile_ids: string[];
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  read_time: string;
  tags: string[];
  image: string;
  is_hidden: boolean;
  sort_order: number;
}

/* ── Warehouse model ──────────────────────────────────────────────────────── */

// A company is a targeted microsite (was: profile). It carries every Profile
// field plus job-offer context and a layout key.
export interface Company extends Profile {
  slug: string;
  role?: string | null;
  job_description?: string | null;
  job_url?: string | null;
  status?: string;
  layout?: string;
  theme_config?: Record<string, unknown>;
  seo?: Record<string, unknown>;
}

// Per-company link on a warehouse entry: ordering, visibility and optional
// content/metadata overrides for that company's microsite.
export interface CompanyLink {
  company_id: string;
  sort_order: number;
  is_visible: boolean;
  override_content?: string | null;
  override_metadata?: Record<string, unknown> | null;
}

export interface WarehouseEntry {
  id: string;
  type: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  tags: string[];
  is_hidden: boolean;
  sort_order: number;
  company_ids?: string[];
  asset_ids?: string[];
  company_links?: CompanyLink[];
  company_sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Asset {
  id: string;
  filename: string;
  url: string;
  mime_type?: string | null;
  size?: number | null;
  description?: string | null;
  tags: string[];
  created_at?: string;
}

// Warehouse entry prefixes. Entries are stored with a type prefix so project
// and article idspaces never collide inside the shared warehouse table.
export const entryIdForProject = (id: string) => (id.startsWith('project:') ? id : `project:${id}`);
export const entryIdForArticle = (id: string) => (id.startsWith('article:') ? id : `article:${id}`);
const stripPrefix = (id: string, prefix: string) => (id.startsWith(prefix) ? id.slice(prefix.length) : id);

type Meta = Record<string, unknown>;
const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const strArr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

// Warehouse entry -> legacy Project shape, so the existing pages/CMS render
// unchanged while reading from the warehouse.
export function entryToProject(entry: WarehouseEntry, companyId?: string): Project {
  const m = (entry.metadata ?? {}) as Meta;
  return {
    id: str(m.source_project_id) || stripPrefix(entry.id, 'project:'),
    profile_ids: entry.company_ids ?? (companyId ? [companyId] : []),
    tag: str(m.tag),
    title: entry.title ?? '',
    tagline: str(m.tagline),
    image: str(m.image),
    description: str(m.description),
    impact: str(m.impact),
    site: str(m.site),
    role: str(m.role),
    period: str(m.period),
    location: str(m.location),
    responsibilities: strArr(m.responsibilities),
    challenge: str(m.challenge),
    challenge_text: str(m.challenge_text),
    solution: str(m.solution),
    solution_text: str(m.solution_text),
    result: str(m.result),
    result_text: str(m.result_text),
    is_hidden: !!entry.is_hidden,
    sort_order: entry.company_sort_order ?? entry.sort_order ?? 0,
    content: entry.content ?? '',
    content_blocks: (m.content_blocks as ProjectBlock[] | null) ?? undefined,
  };
}

// Legacy Project shape -> warehouse entry payload.
export function projectToEntry(p: Project): Partial<WarehouseEntry> {
  return {
    id: entryIdForProject(p.id),
    type: 'project',
    title: p.title,
    content: p.content ?? '',
    metadata: {
      tag: p.tag, tagline: p.tagline, image: p.image, description: p.description,
      impact: p.impact, site: p.site, role: p.role, period: p.period, location: p.location,
      responsibilities: p.responsibilities, challenge: p.challenge, challenge_text: p.challenge_text,
      solution: p.solution, solution_text: p.solution_text, result: p.result, result_text: p.result_text,
      content_blocks: p.content_blocks ?? null, source_project_id: p.id,
    },
    tags: p.tag ? [p.tag] : [],
    is_hidden: p.is_hidden ?? false,
    sort_order: p.sort_order ?? 0,
    company_ids: p.profile_ids ?? [],
  };
}

// Warehouse entry -> legacy BlogPost shape.
export function entryToBlogPost(entry: WarehouseEntry, companyId?: string): BlogPost {
  const m = (entry.metadata ?? {}) as Meta;
  return {
    id: str(m.source_blog_id) || stripPrefix(entry.id, 'article:'),
    profile_ids: entry.company_ids ?? (companyId ? [companyId] : []),
    title: entry.title ?? '',
    excerpt: str(m.excerpt),
    content: entry.content ?? '',
    date: str(m.date),
    author: str(m.author),
    read_time: str(m.read_time),
    tags: entry.tags ?? [],
    image: str(m.image),
    is_hidden: !!entry.is_hidden,
    sort_order: entry.company_sort_order ?? entry.sort_order ?? 0,
  };
}

export function blogPostToEntry(p: BlogPost): Partial<WarehouseEntry> {
  return {
    id: entryIdForArticle(p.id),
    type: 'article',
    title: p.title,
    content: p.content ?? '',
    metadata: {
      excerpt: p.excerpt, date: p.date, author: p.author, read_time: p.read_time,
      image: p.image, source_blog_id: p.id,
    },
    tags: p.tags ?? [],
    is_hidden: p.is_hidden ?? false,
    sort_order: p.sort_order ?? 0,
    company_ids: p.profile_ids ?? [],
  };
}

// --- Warehouse client ---

export async function getWarehouseEntries(params: {
  company_id?: string;
  type?: string;
  search?: string;
  include_hidden?: boolean;
  limit?: number;
} = {}): Promise<WarehouseEntry[]> {
  const qs = new URLSearchParams();
  if (params.company_id) qs.set('company_id', params.company_id);
  if (params.type) qs.set('type', params.type);
  if (params.search) qs.set('search', params.search);
  if (params.include_hidden) qs.set('include_hidden', 'true');
  if (params.limit) qs.set('limit', String(params.limit));
  const suffix = qs.toString();
  return apiFetch<WarehouseEntry[]>(`/api/warehouse${suffix ? `?${suffix}` : ''}`);
}

export async function getWarehouseEntry(id: string): Promise<WarehouseEntry | null> {
  try {
    return await apiFetch<WarehouseEntry>(`/api/warehouse/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export async function upsertWarehouseEntry(data: Partial<WarehouseEntry>): Promise<WarehouseEntry> {
  return apiFetch<WarehouseEntry>('/api/warehouse', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateWarehouseEntry(id: string, data: Partial<WarehouseEntry>): Promise<WarehouseEntry> {
  return apiFetch<WarehouseEntry>(`/api/warehouse/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteWarehouseEntry(id: string): Promise<void> {
  await apiFetch(`/api/warehouse/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// --- Assets client ---

export async function getAssets(search?: string): Promise<Asset[]> {
  const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiFetch<Asset[]>(`/api/assets${suffix}`);
}

export async function registerAsset(data: Partial<Asset>): Promise<Asset> {
  return apiFetch<Asset>('/api/assets', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteAsset(id: string): Promise<void> {
  await apiFetch(`/api/assets/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export const fallbackProfiles: Record<string, Profile> = Object.entries(profilePresets).reduce(
  (acc, [id, preset]) => {
    acc[id] = {
      id,
      ...preset.profile,
      social_links: preset.social_links,
      about_content: {
        speaking_intro: preset.about.speakingIntro,
        faqs: preset.about.faqs,
      },
    };
    return acc;
  },
  {} as Record<string, Profile>
);

// The default profile is curated by the owner — its content lives in the
// database. We still want it available as an offline fallback so the site
// renders without an API. Keep this in sync with the CMS as the owner edits.
if (!fallbackProfiles.default) {
  fallbackProfiles.default = {
    id: 'default',
    name: 'Default',
    is_active: true,
    bio: 'Product designer & builder',
    tagline: 'I design and build user-centric digital products.',
    hero_title: 'Product Designer & Builder',
    hero_subtitle:
      'I design and ship digital products end to end: UX, interface, and code. Led design at PaySika, co-founded ventures, and build in the open. Based in Cameroon.',
    philosophy_title: 'I design experiences that bridge technology and human needs.',
    philosophy_text:
      'I work across design and engineering to turn ideas into products people trust. Nearly four years leading UX design at PaySika, plus co-founding ventures and shipping code, taught me that the strongest products come from one person owning the whole loop: research, interface, and implementation.',
    intro_expanded_text:
      'I work across design and engineering to turn ideas into products people trust. Nearly four years leading UX design at PaySika, plus co-founding ventures and shipping code, taught me that the strongest products come from one person owning the whole loop: research, interface, and implementation.',
    badges: ['Design · Engineering · Product'],
    social_links: {},
    about_content: {
      fun_fact: 'I value direct opinions, simple language, and a good plate of fish.',
      faqs: [
        {
          question: 'How do you approach building a product?',
          answer:
            "Honestly I'm not sure I have a fixed process. Ok I would say it depends. Sometimes rough, sometimes straight to the point, from research and interface through to the code. The truth is that books say one thing but reality says otherwise.",
        },
        {
          question: 'Are you open to speaking engagements?',
          answer:
            'Absolutely. I love public speaking, networking, and sharing insights on fintech, design, and tech ecosystems in Africa.',
        },
      ],
    },
  };
  fallbackProfiles.default.is_active = true;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  // A non-JSON 200 means there's no API behind this route (e.g. `vite
  // preview` serving the SPA shell) — treat it as unreachable so callers
  // fall back to static content.
  return res.json().catch(() => {
    throw new Error('API unavailable');
  }) as Promise<T>;
}

// --- Auth ---

export async function login(email: string, password: string): Promise<void> {
  await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' });
}

export async function changePassword(
  currentPassword: string,
  newPassword?: string,
  newEmail?: string
): Promise<void> {
  await apiFetch('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword, newEmail }),
  });
}

export async function getSession(): Promise<boolean> {
  const data = await apiFetch<{ authenticated: boolean }>('/api/auth/session');
  return data.authenticated;
}

// --- Companies (were: profiles) ---
//
// Companies are read/written through /api/companies but exposed with the
// existing Profile shape so the pages and CMS keep working unchanged.

export async function getAllProfiles(): Promise<Profile[]> {
  try {
    return await apiFetch<Company[]>('/api/companies');
  } catch (err) {
    console.warn('API fetch companies failed, using static fallback:', err);
    return Object.values(fallbackProfiles);
  }
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    return await apiFetch<Company>(`/api/companies/${id}`);
  } catch (err) {
    const fallback = fallbackProfiles[id] ?? null;
    if (err instanceof Error && err.message === 'Not found') return fallback;
    if (fallback) {
      console.warn(`API fetch company "${id}" failed, using static fallback:`, err);
      return fallback;
    }
    throw err;
  }
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  try {
    const direct = await apiFetch<Company>(`/api/companies/${encodeURIComponent(slug)}`).catch(() => null);
    if (direct) return direct;
    const all = await getAllProfiles();
    return (all as Company[]).find((c) => c.slug === slug || c.id === slug) ?? null;
  } catch {
    const fallback = (fallbackProfiles[slug] ??
      Object.values(fallbackProfiles).find((p) => (p as Company).slug === slug)) as Company | undefined;
    return fallback ?? null;
  }
}

export async function getActiveProfile(): Promise<Profile | null> {
  const companies = await getAllProfiles();
  return companies.find((p) => p.is_active) ?? companies[0] ?? null;
}

export async function updateProfile(id: string, data: Partial<Profile>): Promise<Profile> {
  return apiFetch<Company>(`/api/companies/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteProfile(id: string): Promise<void> {
  await apiFetch(`/api/companies/${id}`, { method: 'DELETE' });
}

// Company-aware writers. Same endpoints as the profile helpers above, but typed
// to the full Company shape (slug, role, job_url, job_description, status,
// layout, theme_config, seo) so the microsite editor can persist every field.
export async function getCompanies(): Promise<Company[]> {
  return apiFetch<Company[]>('/api/companies');
}

export async function upsertCompany(data: Partial<Company>): Promise<Company> {
  if (!data.id) throw new Error('Company id is required');
  return apiFetch<Company>(`/api/companies/${data.id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCompany(id: string, data: Partial<Company>): Promise<Company> {
  return apiFetch<Company>(`/api/companies/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteCompany(id: string): Promise<void> {
  await apiFetch(`/api/companies/${id}`, { method: 'DELETE' });
}

// --- Merge helpers ---
//
// The database is the source of truth. The static files in src/data/ act as a
// safety net: any field the database leaves empty falls back to the bundled
// static content, and if the API is unreachable the static content renders on
// its own. Once a field is edited (or synced) in the CMS, the database value
// wins.

function pick(dbVal: string | null | undefined, staticVal: string | undefined): string {
  return dbVal && dbVal.trim() ? dbVal : staticVal ?? '';
}

function pickArray(dbVal: string[] | null | undefined, staticVal: string[] | undefined): string[] {
  return dbVal && dbVal.length ? dbVal : staticVal ?? [];
}

function findStaticProject(dbId: string): StaticProject | undefined {
  return staticProjects.find((sp) => sp.id === dbId || dbId.startsWith(sp.id));
}

function mergeProject(p: Project, st: StaticProject | undefined): Project {
  if (!st) return p;
  return {
    ...p,
    tag: pick(p.tag, st.tag),
    title: pick(p.title, st.title),
    tagline: pick(p.tagline, st.tagline),
    image: pick(p.image, st.image),
    description: pick(p.description, st.description),
    impact: pick(p.impact, st.impact),
    site: pick(p.site, st.site),
    role: pick(p.role, st.role),
    period: pick(p.period, st.period),
    location: pick(p.location, st.location),
    responsibilities: pickArray(p.responsibilities, st.responsibilities),
    challenge: pick(p.challenge, st.challenge),
    challenge_text: pick(p.challenge_text, st.challengeText),
    solution: pick(p.solution, st.solution),
    solution_text: pick(p.solution_text, st.solutionText),
    result: pick(p.result, st.result),
    result_text: pick(p.result_text, st.resultText),
    content: pick(p.content, st.content),
  };
}

function staticToProject(p: StaticProject, profileIds: string[]): Project {
  return {
    id: p.id,
    profile_ids: profileIds,
    tag: p.tag,
    title: p.title,
    tagline: p.tagline,
    image: p.image,
    description: p.description,
    impact: p.impact,
    site: p.site,
    role: p.role,
    period: p.period,
    location: p.location,
    responsibilities: p.responsibilities,
    challenge: p.challenge,
    challenge_text: p.challengeText,
    solution: p.solution,
    solution_text: p.solutionText,
    result: p.result,
    result_text: p.resultText,
    is_hidden: false,
    sort_order: 0,
    content: p.content || '',
  };
}

function matchStaticPost(dbId: string): StaticBlogPost | undefined {
  return staticBlogPosts.find((sp) => {
    if (dbId === sp.id) return true;
    if (dbId.startsWith('affinity') && sp.id.includes('affinity')) return true;
    if (dbId.startsWith('oss') && sp.id.includes('open-source')) return true;
    if (dbId.startsWith('fintech_future') && sp.id.includes('fintech')) return true;
    if (dbId.startsWith('accessibility') && sp.id.includes('accessibility')) return true;
    return false;
  });
}

function mergeBlogPost(p: BlogPost, st: StaticBlogPost | undefined): BlogPost {
  if (!st) return p;
  return {
    ...p,
    title: pick(p.title, st.title),
    excerpt: pick(p.excerpt, st.excerpt),
    content: pick(p.content, st.content),
    date: pick(p.date, st.date),
    author: pick(p.author, st.author),
    read_time: pick(p.read_time, st.readTime),
    tags: pickArray(p.tags, st.tags),
    image: pick(p.image, st.image),
  };
}

function staticToBlogPost(p: StaticBlogPost, profileIds: string[]): BlogPost {
  return {
    id: p.id,
    profile_ids: profileIds,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    date: p.date,
    author: p.author,
    read_time: p.readTime,
    tags: p.tags,
    image: p.image,
    is_hidden: false,
    sort_order: 0,
  };
}

// --- Projects ---

export async function getProjectsByProfile(profileId: string): Promise<Project[]> {
  try {
    const entries = await getWarehouseEntries({ company_id: profileId, type: 'project' });
    return entries
      .map((e) => entryToProject(e, profileId))
      .map((p) => mergeProject(p, findStaticProject(p.id)));
  } catch (err) {
    console.warn('API fetch warehouse projects failed, using static fallback:', err);
    const preset = profilePresets[profileId];
    if (preset?.projects?.length) {
      return preset.projects.map((p) => ({
        ...p,
        profile_ids: [profileId],
      })) as Project[];
    }
    return staticProjects.map((p) => staticToProject(p, [profileId]));
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const entries = await getWarehouseEntries({ type: 'project', include_hidden: true });
    return entries
      .map((e) => entryToProject(e))
      .map((p) => mergeProject(p, findStaticProject(p.id)));
  } catch (err) {
    console.warn('getAllProjects API failed, using static fallback:', err);
    return staticProjects.map((p) => staticToProject(p, ['default']));
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    let resolvedProfile = null;
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const profileIdParam = searchParams.get('profile');
      if (profileIdParam) {
        resolvedProfile = await getProfileById(profileIdParam);
      }
    }
    if (!resolvedProfile) {
      resolvedProfile = await getActiveProfile();
    }
    if (!resolvedProfile) return null;
    const profileProjects = await getProjectsByProfile(resolvedProfile.id);
    return profileProjects.find((p) => p.id === id) ?? null;
  } catch (err) {
    console.error('getProjectById error:', err);
    return null;
  }
}

export async function upsertProject(data: Project): Promise<Project> {
  const saved = await upsertWarehouseEntry(projectToEntry(data));
  return entryToProject(saved);
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const saved = await updateWarehouseEntry(entryIdForProject(id), data as Partial<WarehouseEntry>);
  return entryToProject(saved);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteWarehouseEntry(entryIdForProject(id));
}

// --- Blog Posts ---

export async function getBlogPostsByProfile(profileId: string): Promise<BlogPost[]> {
  try {
    const entries = await getWarehouseEntries({ company_id: profileId, type: 'article' });
    return entries
      .map((e) => entryToBlogPost(e, profileId))
      .map((p) => mergeBlogPost(p, matchStaticPost(p.id)));
  } catch (err) {
    console.warn('API fetch warehouse articles failed, using static fallback:', err);
    const preset = profilePresets[profileId];
    if (preset?.blogPosts?.length) {
      return preset.blogPosts.map((p) => ({
        ...p,
        profile_ids: [profileId],
      })) as BlogPost[];
    }
    return staticBlogPosts.map((p) => staticToBlogPost(p, [profileId]));
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const entries = await getWarehouseEntries({ type: 'article', include_hidden: true });
    return entries
      .map((e) => entryToBlogPost(e))
      .map((p) => mergeBlogPost(p, matchStaticPost(p.id)));
  } catch {
    console.warn('getAllBlogPosts API failed, using static fallback');
    return staticBlogPosts.map((p) => staticToBlogPost(p, ['default']));
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    let resolvedProfile = null;
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const profileIdParam = searchParams.get('profile');
      if (profileIdParam) {
        resolvedProfile = await getProfileById(profileIdParam);
      }
    }
    if (!resolvedProfile) {
      resolvedProfile = await getActiveProfile();
    }
    if (!resolvedProfile) return null;
    const profilePosts = await getBlogPostsByProfile(resolvedProfile.id);
    return profilePosts.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function upsertBlogPost(data: BlogPost): Promise<BlogPost> {
  const saved = await upsertWarehouseEntry(blogPostToEntry(data));
  return entryToBlogPost(saved);
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  const saved = await updateWarehouseEntry(entryIdForArticle(id), data as Partial<WarehouseEntry>);
  return entryToBlogPost(saved);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteWarehouseEntry(entryIdForArticle(id));
}

// --- One-time migration: legacy profile_id -> profile_ids join tables ---

export interface MultiProfileMigrationResult {
  ok: boolean;
  blog_post_profiles: number;
  project_profiles: number;
  log?: string[];
}

// Runs the server-side migration that backfills the blog_post_profiles and
// project_profiles join tables from the legacy profile_id column. Gated on the
// server by MIGRATIONS_ENABLED — returns 403 if that env var is not set on
// Vercel. Safe to run multiple times: every step is idempotent.
export async function runMultiProfileMigration(): Promise<MultiProfileMigrationResult> {
  return apiFetch<MultiProfileMigrationResult>('/api/admin/migrate-multi-profile', { method: 'POST' });
}

// --- Content sync (one-time migration helper, runs from the CMS) ---

export interface SyncResult {
  updated: string[];
  created: string[];
  skipped: string[];
  errors: { id: string; message: string }[];
}

function projectNeedsSync(db: Project, merged: Project): boolean {
  return (Object.keys(merged) as (keyof Project)[]).some((k) => {
    const a = db[k];
    const b = merged[k];
    return Array.isArray(a) ? JSON.stringify(a) !== JSON.stringify(b) : a !== b;
  });
}

/**
 * Pushes the bundled static content into the database so the CMS becomes the
 * single source of truth. Never overwrites a non-empty database field — only
 * fills gaps — so content already edited in the CMS is preserved.
 */
export async function syncContentToDatabase(
  onProgress?: (message: string) => void
): Promise<SyncResult> {
  const result: SyncResult = { updated: [], created: [], skipped: [], errors: [] };
  const report = (msg: string) => onProgress?.(msg);

  // 1. Make sure code-only fallback profiles exist in the database.
  const profiles = await getAllProfiles();
  for (const [id, fallback] of Object.entries(fallbackProfiles)) {
    if (!profiles.some((p) => p.id === id)) {
      try {
        report(`Creating profile "${id}"…`);
        // Never steal the active flag from the profile visitors currently see.
        await updateProfile(id, { ...fallback, is_active: false });
        result.created.push(`profile:${id}`);
      } catch (err) {
        result.errors.push({ id: `profile:${id}`, message: err instanceof Error ? err.message : 'failed' });
      }
    }
  }

  // 2. Fill empty project fields from static content.
  const dbProjects = await getAllProjects();
  for (const db of dbProjects) {
    const merged = mergeProject(db, findStaticProject(db.id));
    if (!projectNeedsSync(db, merged)) {
      result.skipped.push(`project:${db.id}`);
      continue;
    }
    try {
      report(`Syncing project "${db.id}"…`);
      await upsertProject(merged);
      result.updated.push(`project:${db.id}`);
    } catch (err) {
      result.errors.push({ id: `project:${db.id}`, message: err instanceof Error ? err.message : 'failed' });
    }
  }

  // 3. Fill empty blog fields from static content.
  const dbPosts = await getAllBlogPosts();
  for (const db of dbPosts) {
    const merged = mergeBlogPost(db, matchStaticPost(db.id));
    const changed = (Object.keys(merged) as (keyof BlogPost)[]).some((k) => {
      const a = db[k];
      const b = merged[k];
      return Array.isArray(a) ? JSON.stringify(a) !== JSON.stringify(b) : a !== b;
    });
    if (!changed) {
      result.skipped.push(`post:${db.id}`);
      continue;
    }
    try {
      report(`Syncing blog post "${db.id}"…`);
      await upsertBlogPost(merged);
      result.updated.push(`post:${db.id}`);
    } catch (err) {
      result.errors.push({ id: `post:${db.id}`, message: err instanceof Error ? err.message : 'failed' });
    }
  }

  return result;
}
