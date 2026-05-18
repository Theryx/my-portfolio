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
  return apiFetch<Project[]>(`/api/projects?profile_id=${profileId}`);
}

export async function getAllProjects(): Promise<Project[]> {
  return apiFetch<Project[]>('/api/projects');
}

export async function getProjectById(id: string): Promise<Project | null> {
  // Fetch all and find by id (avoids needing a separate GET /api/projects/:id public route)
  try {
    const all = await getAllProjects();
    return all.find((p) => p.id === id) ?? null;
  } catch {
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
    const all = await getAllBlogPosts();
    return all.find((p) => p.id === id) ?? null;
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
