import { projects as staticProjects } from '../data/projects';

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
  badges: string[];
  social_links: Record<string, string>;
}

export interface Project {
  id: string;
  profile_id: string;
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
  profile_id: string;
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
  return res.json() as Promise<T>;
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
  return apiFetch<Profile[]>('/api/profiles');
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    return await apiFetch<Profile>(`/api/profiles/${id}`);
  } catch (err) {
    if (err instanceof Error && err.message === 'Not found') return null;
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

// --- Projects ---

export async function getProjectsByProfile(profileId: string): Promise<Project[]> {
  let dbProjects: Project[] = [];
  try {
    dbProjects = await apiFetch<Project[]>(`/api/projects?profile_id=${profileId}`);
  } catch (err) {
    console.warn('API fetch projects failed, using static fallback:', err);
    dbProjects = staticProjects.map(p => ({
      id: p.id,
      profile_id: profileId,
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
      content: p.content || ''
    }));
  }

  // Always use static content when available — content is managed in code, not the DB
  return dbProjects.map(p => {
    const matchedStatic = staticProjects.find(sp => sp.id === p.id || p.id.startsWith(sp.id));
    if (matchedStatic && matchedStatic.content) {
      return { ...p, content: matchedStatic.content };
    }
    return p;
  });
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const dbProjects = await apiFetch<Project[]>('/api/projects');
    return dbProjects.map(p => {
      const matchedStatic = staticProjects.find(sp => sp.id === p.id || p.id.startsWith(sp.id));
      if (matchedStatic && matchedStatic.content) {
        return { ...p, content: matchedStatic.content };
      }
      return p;
    });
  } catch (err) {
    console.warn('getAllProjects API failed, using static fallback');
    return staticProjects.map(p => ({
      id: p.id,
      profile_id: 'default',
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
      content: p.content || ''
    }));
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
  return apiFetch<BlogPost[]>(`/api/blog?profile_id=${profileId}`);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>('/api/blog');
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
