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
  speaking_image?: string;
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
      'I work across design and engineering to turn ideas into products people trust. Four years leading design at PaySika, plus co-founding ventures and shipping code, taught me that the strongest products come from one person owning the whole loop: research, interface, and implementation.',
    intro_expanded_text:
      'I work across design and engineering to turn ideas into products people trust. Four years leading design at PaySika, plus co-founding ventures and shipping code, taught me that the strongest products come from one person owning the whole loop: research, interface, and implementation.',
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

// --- Profiles ---

export async function getAllProfiles(): Promise<Profile[]> {
  try {
    return await apiFetch<Profile[]>('/api/profiles');
  } catch (err) {
    console.warn('API fetch profiles failed, using static fallback:', err);
    return Object.values(fallbackProfiles);
  }
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    return await apiFetch<Profile>(`/api/profiles/${id}`);
  } catch (err) {
    const fallback = fallbackProfiles[id] ?? null;
    if (err instanceof Error && err.message === 'Not found') return fallback;
    if (fallback) {
      console.warn(`API fetch profile "${id}" failed, using static fallback:`, err);
      return fallback;
    }
    throw err;
  }
}

export async function getActiveProfile(): Promise<Profile | null> {
  const profiles = await getAllProfiles();
  return profiles.find((p) => p.is_active) ?? profiles[0] ?? null;
}

export async function updateProfile(id: string, data: Partial<Profile>): Promise<Profile> {
  return apiFetch<Profile>(`/api/profiles/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteProfile(id: string): Promise<void> {
  await apiFetch(`/api/profiles/${id}`, { method: 'DELETE' });
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
    const dbProjects = await apiFetch<Project[]>(`/api/projects?profile_id=${profileId}`);
    return dbProjects.map((p) => mergeProject(p, findStaticProject(p.id)));
  } catch (err) {
    console.warn('API fetch projects failed, using static fallback:', err);
    return staticProjects.map((p) => staticToProject(p, [profileId]));
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const dbProjects = await apiFetch<Project[]>('/api/projects');
    return dbProjects.map((p) => mergeProject(p, findStaticProject(p.id)));
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
  return apiFetch<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  return apiFetch<Project>(`/api/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
}

// --- Blog Posts ---

export async function getBlogPostsByProfile(profileId: string): Promise<BlogPost[]> {
  try {
    const dbPosts = await apiFetch<BlogPost[]>(`/api/blog?profile_id=${profileId}`);
    return dbPosts.map((p) => mergeBlogPost(p, matchStaticPost(p.id)));
  } catch (err) {
    console.warn('API fetch blog posts failed, using static fallback:', err);
    return staticBlogPosts.map((p) => staticToBlogPost(p, [profileId]));
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const dbPosts = await apiFetch<BlogPost[]>('/api/blog');
    return dbPosts.map((p) => mergeBlogPost(p, matchStaticPost(p.id)));
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
  return apiFetch<BlogPost>('/api/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/api/blog/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await apiFetch(`/api/blog/${id}`, { method: 'DELETE' });
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
  const dbProjects = await apiFetch<Project[]>('/api/projects');
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
  const dbPosts = await apiFetch<BlogPost[]>('/api/blog');
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
