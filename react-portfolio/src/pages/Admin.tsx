import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './admin/cms.css';
import {
  LayoutDashboard, Users, FolderKanban, Newspaper, Settings, LogOut, RefreshCw,
  ExternalLink, Search, Eye, EyeOff, Pencil, Trash2, Copy, ArrowUp, ArrowDown,
  ArrowLeft, DatabaseZap, CheckCircle2, AlertTriangle, Sparkles, Home, UserRound,
  GitMerge
} from 'lucide-react';
import {
  login, logout, getSession,
  getAllProfiles, getAllProjects, getAllBlogPosts,
  updateProfile, deleteProfile, upsertProject, updateProject, deleteProject,
  upsertBlogPost, updateBlogPost, deleteBlogPost, syncContentToDatabase,
  runMultiProfileMigration,
  type Profile, type Project, type BlogPost, type SyncResult,
} from '../lib/api';
import { HomeForm, AboutForm, ProfileMetaForm, ProjectForm, BlogForm, SecurityForm } from './admin/forms';
import { PasswordInput } from './admin/fields';
import { profilePresets } from '../data/profileCopy';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type Section = 'dashboard' | 'home' | 'about' | 'profiles' | 'projects' | 'blog' | 'settings';
type Editing =
  | { kind: 'profile'; item: Profile | null }
  | { kind: 'project'; item: Project | null }
  | { kind: 'post'; item: BlogPost | null };
type DeleteTarget = { kind: 'profile' | 'project' | 'post'; id: string; label: string };

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

let toastIdCounter = 0;

const NAV: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'home', label: 'Home page', icon: Home },
  { id: 'about', label: 'About page', icon: UserRound },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'profiles', label: 'Profiles', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [section, setSection] = useState<Section>('dashboard');
  const [editing, setEditing] = useState<Editing | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [search, setSearch] = useState('');
  const [profileFilter, setProfileFilter] = useState<string>('all');
  const [presetTarget, setPresetTarget] = useState<string | null>(null);
  // Which profile the page-oriented Home/About editors are editing.
  const [editProfileId, setEditProfileId] = useState<string>('');
  // Bumped to remount (reset) the Home/About form on Cancel.
  const [formNonce, setFormNonce] = useState(0);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    toastIdCounter += 1;
    const id = toastIdCounter;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    getSession()
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, pr, b] = await Promise.all([getAllProfiles(), getAllProjects(), getAllBlogPosts()]);
      setProfiles(p);
      setProjects(pr);
      setBlogPosts(b);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error fetching data:', err);
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isAuthenticated) fetchAll();
  }, [isAuthenticated, fetchAll]);

  // Reset list controls when switching sections
  useEffect(() => {
    setSearch('');
    setEditing(null);
  }, [section]);

  /* ── Save handlers (optimistic local updates, no full refetch) ── */

  const saveProfile = async (profile: Partial<Profile>) => {
    setSaving(true);
    try {
      const saved = await updateProfile(profile.id!, profile);
      setProfiles((list) => {
        const exists = list.some((p) => p.id === saved.id);
        return exists ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved];
      });
      setEditing(null);
      addToast('Profile saved', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveProject = async (project: Partial<Project>) => {
    setSaving(true);
    try {
      const saved = await upsertProject(project as Project);
      setProjects((list) => {
        const exists = list.some((p) => p.id === saved.id);
        return exists ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved];
      });
      setEditing(null);
      addToast('Project saved', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveBlogPost = async (post: Partial<BlogPost>) => {
    setSaving(true);
    try {
      const saved = await upsertBlogPost(post as BlogPost);
      setBlogPosts((list) => {
        const exists = list.some((p) => p.id === saved.id);
        return exists ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved];
      });
      setEditing(null);
      addToast('Post saved', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save post', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleHidden = async (kind: 'project' | 'post', item: Project | BlogPost) => {
    try {
      if (kind === 'project') {
        const saved = await updateProject(item.id, { is_hidden: !item.is_hidden });
        setProjects((list) => list.map((p) => (p.id === saved.id ? { ...p, is_hidden: saved.is_hidden } : p)));
      } else {
        const saved = await updateBlogPost(item.id, { is_hidden: !item.is_hidden });
        setBlogPosts((list) => list.map((p) => (p.id === saved.id ? { ...p, is_hidden: saved.is_hidden } : p)));
      }
      addToast(item.is_hidden ? 'Now visible on the site' : 'Hidden from the site', 'success');
    } catch {
      addToast('Failed to update visibility', 'error');
    }
  };

  const move = async (kind: 'project' | 'post', list: (Project | BlogPost)[], index: number, dir: -1 | 1) => {
    const a = list[index];
    const b = list[index + dir];
    if (!a || !b) return;
    const aOrder = b.sort_order === a.sort_order ? a.sort_order + dir : b.sort_order;
    const bOrder = a.sort_order;
    try {
      if (kind === 'project') {
        await Promise.all([
          updateProject(a.id, { sort_order: aOrder }),
          updateProject(b.id, { sort_order: bOrder }),
        ]);
        setProjects((l) => l.map((p) => (p.id === a.id ? { ...p, sort_order: aOrder } : p.id === b.id ? { ...p, sort_order: bOrder } : p)));
      } else {
        await Promise.all([
          updateBlogPost(a.id, { sort_order: aOrder }),
          updateBlogPost(b.id, { sort_order: bOrder }),
        ]);
        setBlogPosts((l) => l.map((p) => (p.id === a.id ? { ...p, sort_order: aOrder } : p.id === b.id ? { ...p, sort_order: bOrder } : p)));
      }
    } catch {
      addToast('Failed to reorder', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === 'project') {
        await deleteProject(deleteTarget.id);
        setProjects((l) => l.filter((p) => p.id !== deleteTarget.id));
      } else if (deleteTarget.kind === 'post') {
        await deleteBlogPost(deleteTarget.id);
        setBlogPosts((l) => l.filter((p) => p.id !== deleteTarget.id));
      } else {
        await deleteProfile(deleteTarget.id);
        setProfiles((l) => l.filter((p) => p.id !== deleteTarget.id));
      }
      addToast('Deleted', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete', 'error');
    } finally {
      setDeleteTarget(null);
      lastFocusRef.current?.focus();
    }
  };

  const handleApplyPreset = async (profileId: string) => {
    setSaving(true);
    try {
      const preset = profilePresets[profileId];
      if (!preset) throw new Error('Preset not found');

      // Preserve the existing active flag so applying a preset never
      // unintentionally publishes a draft profile to visitors.
      const existingProfile = profiles.find(p => p.id === profileId);
      const isActive = existingProfile ? existingProfile.is_active : false;

      // 1) Profile fields (hero / philosophy / bio / badges) + social_links + about.
      await updateProfile(profileId, {
        ...preset.profile,
        is_active: isActive,
        social_links: preset.social_links,
        about_content: {
          speaking_intro: preset.about.speakingIntro,
          faqs: preset.about.faqs,
        },
      });

      // 2) Per-profile project case studies. Only insert if the id is new —
      //    we never overwrite an existing project the user may have edited.
      let createdProjects = 0;
      for (const seed of preset.projects) {
        if (!projects.some((p) => p.id === seed.id)) {
          const profileIds = seed.profile_ids?.length ? seed.profile_ids : [profileId];
          await upsertProject({ ...seed, profile_ids: profileIds } as Project);
          createdProjects++;
        }
      }

      // 3) Per-profile blog posts — same id-skip rule.
      let createdPosts = 0;
      for (const seed of preset.blogPosts) {
        if (!blogPosts.some((p) => p.id === seed.id)) {
          const profileIds = seed.profile_ids?.length ? seed.profile_ids : [profileId];
          await upsertBlogPost({ ...seed, profile_ids: profileIds } as BlogPost);
          createdPosts++;
        }
      }

      const parts = ['Profile updated'];
      if (createdProjects > 0) parts.push(`${createdProjects} project${createdProjects === 1 ? '' : 's'} created`);
      if (createdPosts > 0) parts.push(`${createdPosts} post${createdPosts === 1 ? '' : 's'} created`);
      addToast(parts.join(' · '), 'success');
      await fetchAll();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to apply preset', 'error');
    } finally {
      setSaving(false);
      setPresetTarget(null);
    }
  };

  const requestDelete = (target: DeleteTarget, e: React.MouseEvent) => {
    lastFocusRef.current = e.currentTarget as HTMLElement;
    setDeleteTarget(target);
  };

  const duplicateProject = (project: Project) => {
    setEditing({
      kind: 'project',
      item: { ...project, id: '', is_hidden: true },
    });
  };

  const profilesWithPresets = useMemo(() => {
    const combined = [...profiles];
    Object.keys(profilePresets).forEach((presetId) => {
      if (!profiles.some((p) => p.id === presetId)) {
        combined.push({
          id: presetId,
          name: profilePresets[presetId].profile.name,
          is_active: false,
          bio: '',
          tagline: '',
          hero_title: '',
          hero_subtitle: '',
          philosophy_title: '',
          philosophy_text: '',
          intro_expanded_text: '',
          badges: [],
          social_links: {},
          about_content: {},
        } as Profile);
      }
    });
    return combined;
  }, [profiles]);

  // The profile currently targeted by the Home/About page editors.
  const activeProfileId = profiles.find((p) => p.is_active)?.id;
  const selectedProfileId = editProfileId || activeProfileId || profilesWithPresets[0]?.id || '';
  const selectedProfile = profilesWithPresets.find((p) => p.id === selectedProfileId) ?? null;

  /* ── Derived lists ── */

  const visibleProjects = useMemo(() => {
    const q = search.toLowerCase();
    return [...projects]
      .filter((p) => profileFilter === 'all' || (p.profile_ids ?? []).includes(profileFilter))
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [projects, profileFilter, search]);

  const visiblePosts = useMemo(() => {
    const q = search.toLowerCase();
    return [...blogPosts]
      .filter((p) => profileFilter === 'all' || (p.profile_ids ?? []).includes(profileFilter))
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [blogPosts, profileFilter, search]);

  /* ── Render ── */

  if (authLoading) {
    return <div className="cms-loading-screen">Loading…</div>;
  }

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={() => setIsAuthenticated(true)} toasts={toasts} addToast={addToast} />;
  }

  const sectionTitle = editing
    ? editing.item && (editing.item as { id?: string }).id
      ? `Edit ${editing.kind}`
      : `New ${editing.kind}`
    : NAV.find((n) => n.id === section)?.label ?? '';

  return (
    <div className="cms">
      <aside className="cms-sidebar">
        <div className="cms-sidebar__brand">
          <span className="cms-sidebar__dot" aria-hidden="true" />
          Studio
        </div>
        <nav className="cms-sidebar__nav" aria-label="CMS sections">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`cms-sidebar__link ${section === id && !editing ? 'cms-sidebar__link--active' : ''}`}
              onClick={() => { setSection(id); setEditing(null); }}
              aria-current={section === id ? 'page' : undefined}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
              {id === 'profiles' && <span className="cms-sidebar__count">{profiles.length}</span>}
              {id === 'projects' && <span className="cms-sidebar__count">{projects.length}</span>}
              {id === 'blog' && <span className="cms-sidebar__count">{blogPosts.length}</span>}
            </button>
          ))}
        </nav>
        <div className="cms-sidebar__footer">
          <a className="cms-sidebar__link" href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={17} aria-hidden="true" /><span>View site</span>
          </a>
          <button className="cms-sidebar__link" onClick={async () => { await logout(); setIsAuthenticated(false); }}>
            <LogOut size={17} aria-hidden="true" /><span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="cms-main">
        <header className="cms-topbar">
          {editing ? (
            <button className="cms-btn cms-btn--ghost" onClick={() => setEditing(null)}>
              <ArrowLeft size={15} aria-hidden="true" /> Back
            </button>
          ) : (
            <h1 className="cms-topbar__title">{sectionTitle}</h1>
          )}
          {editing && <h1 className="cms-topbar__title">{sectionTitle}</h1>}
          {!editing && (
            <button className="cms-btn cms-btn--ghost" onClick={fetchAll} disabled={loading}>
              <RefreshCw size={15} aria-hidden="true" /> {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          )}
        </header>

        <div className="cms-content">
          {loading && !editing ? (
            <div className="cms-empty">Loading content…</div>
          ) : editing ? (
            <div className="cms-editor">
              {editing.kind === 'profile' && (
                <ProfileMetaForm profile={editing.item} onSave={saveProfile} onCancel={() => setEditing(null)} saving={saving} />
              )}
              {editing.kind === 'project' && (
                <ProjectForm project={editing.item} profiles={profiles} onSave={saveProject} onCancel={() => setEditing(null)} saving={saving} />
              )}
              {editing.kind === 'post' && (
                <BlogForm post={editing.item} profiles={profiles} onSave={saveBlogPost} onCancel={() => setEditing(null)} saving={saving} />
              )}
            </div>
          ) : section === 'dashboard' ? (
            <Dashboard
              profiles={profiles}
              projects={projects}
              posts={blogPosts}
              onNavigate={setSection}
              onSynced={fetchAll}
              addToast={addToast}
            />
          ) : section === 'home' || section === 'about' ? (
            <section aria-label={section === 'home' ? 'Home page' : 'About page'}>
              <div className="cms-list-header">
                <div className="cms-list-header__filters">
                  <label htmlFor="scope-profile" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Profile</label>
                  <select
                    id="scope-profile"
                    value={selectedProfileId}
                    onChange={(e) => { setEditProfileId(e.target.value); setFormNonce((n) => n + 1); }}
                    aria-label="Profile to edit"
                  >
                    {profilesWithPresets.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}{p.is_active ? ' (Active)' : ''}</option>
                    ))}
                  </select>
                </div>
                <p className="cms-list-header__hint" style={{ margin: 0 }}>
                  Editing the <strong>{section === 'home' ? 'Home' : 'About'}</strong> page for this profile; saves to that profile only.
                </p>
              </div>
              {selectedProfile ? (
                section === 'home' ? (
                  <HomeForm
                    key={`home-${selectedProfileId}-${formNonce}`}
                    profile={selectedProfile}
                    onSave={saveProfile}
                    onCancel={() => setFormNonce((n) => n + 1)}
                    saving={saving}
                  />
                ) : (
                  <AboutForm
                    key={`about-${selectedProfileId}-${formNonce}`}
                    profile={selectedProfile}
                    onSave={saveProfile}
                    onCancel={() => setFormNonce((n) => n + 1)}
                    saving={saving}
                  />
                )
              ) : (
                <div className="cms-empty">No profile available. Create one in the Profiles section.</div>
              )}
            </section>
          ) : section === 'profiles' ? (
            <section aria-label="Profiles">
              <div className="cms-list-header">
                <p className="cms-list-header__hint">
                  Each profile is a complete persona: its own hero, philosophy, projects, and posts.
                  Share one with <code>?profile=&lt;id&gt;</code>.
                </p>
                <button className="cms-btn cms-btn--primary" onClick={() => setEditing({ kind: 'profile', item: null })}>
                  New profile
                </button>
              </div>
              <ul className="cms-list">
                {profilesWithPresets.map((profile) => {
                  const existsInDb = profiles.some((p) => p.id === profile.id);
                  return (
                    <li key={profile.id} className="cms-item">
                      <div className="cms-item__body">
                        <div className="cms-item__title">
                          {profile.name || '(unnamed)'}
                          {profile.is_active && <span className="cms-badge cms-badge--live">Active</span>}
                          {!existsInDb && <span className="cms-badge cms-badge--muted">Preset Available</span>}
                        </div>
                        <div className="cms-item__meta">
                          <code>{profile.id}</code> · {profile.hero_title || (existsInDb ? 'No hero title' : 'Not created yet (click Sparkles to apply preset)')}
                        </div>
                      </div>
                      <div className="cms-item__actions">
                        {existsInDb && (
                          <a className="cms-icon-btn" href={`/?profile=${profile.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${profile.name}`} title="Preview">
                            <ExternalLink size={15} />
                          </a>
                        )}
                        {profilePresets[profile.id] && (
                          <button
                            className="cms-icon-btn"
                            onClick={() => setPresetTarget(profile.id)}
                            aria-label={`Apply suggested copy for ${profile.name}`}
                            title="Apply suggested copy"
                          >
                            <Sparkles size={15} style={{ color: 'var(--color-accent)' }} />
                          </button>
                        )}
                        {existsInDb && (
                          <button className="cms-icon-btn" onClick={() => setEditing({ kind: 'profile', item: profile })} aria-label={`Edit ${profile.name}`} title="Edit">
                            <Pencil size={15} />
                          </button>
                        )}
                        {existsInDb && (
                          <button
                            className="cms-icon-btn cms-icon-btn--danger"
                            onClick={(e) => requestDelete({ kind: 'profile', id: profile.id, label: `profile "${profile.name}" and ALL of its projects and posts` }, e)}
                            aria-label={`Delete ${profile.name}`} title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : section === 'projects' ? (
            <section aria-label="Projects">
              <ListControls
                search={search} onSearch={setSearch}
                profileFilter={profileFilter} onProfileFilter={setProfileFilter}
                profiles={profiles}
                actionLabel="New project"
                onAction={() => setEditing({ kind: 'project', item: null })}
              />
              {visibleProjects.length === 0 ? (
                <div className="cms-empty">No projects match.</div>
              ) : (
                <ul className="cms-list">
                  {visibleProjects.map((project, i) => (
                    <li key={project.id} className="cms-item">
                      <div className="cms-item__order">
                        <button className="cms-icon-btn" disabled={i === 0} onClick={() => move('project', visibleProjects, i, -1)} aria-label="Move up"><ArrowUp size={14} /></button>
                        <button className="cms-icon-btn" disabled={i === visibleProjects.length - 1} onClick={() => move('project', visibleProjects, i, 1)} aria-label="Move down"><ArrowDown size={14} /></button>
                      </div>
                      <div className="cms-item__body">
                        <div className="cms-item__title">
                          {project.title}
                          <span className={`cms-badge ${project.is_hidden ? 'cms-badge--muted' : 'cms-badge--live'}`}>
                            {project.is_hidden ? 'Hidden' : 'Live'}
                          </span>
                        </div>
                        <div className="cms-item__meta">
                          <code>{project.id}</code> · {project.tag || 'no tag'} · {(project.profile_ids ?? []).map((pid) => profiles.find((p) => p.id === pid)?.name ?? pid).join(', ') || 'no profile'}
                        </div>
                      </div>
                      <div className="cms-item__actions">
                        <a className="cms-icon-btn" href={`/projects/${project.id}?profile=${project.profile_ids?.[0] ?? ''}`} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${project.title}`} title="Preview">
                          <ExternalLink size={15} />
                        </a>
                        <button className="cms-icon-btn" onClick={() => toggleHidden('project', project)} aria-label={project.is_hidden ? 'Show on site' : 'Hide from site'} title={project.is_hidden ? 'Show' : 'Hide'}>
                          {project.is_hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button className="cms-icon-btn" onClick={() => duplicateProject(project)} aria-label={`Duplicate ${project.title}`} title="Duplicate">
                          <Copy size={15} />
                        </button>
                        <button className="cms-icon-btn" onClick={() => setEditing({ kind: 'project', item: project })} aria-label={`Edit ${project.title}`} title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="cms-icon-btn cms-icon-btn--danger" onClick={(e) => requestDelete({ kind: 'project', id: project.id, label: `project "${project.title}"` }, e)} aria-label={`Delete ${project.title}`} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : section === 'blog' ? (
            <section aria-label="Blog posts">
              <ListControls
                search={search} onSearch={setSearch}
                profileFilter={profileFilter} onProfileFilter={setProfileFilter}
                profiles={profiles}
                actionLabel="New post"
                onAction={() => setEditing({ kind: 'post', item: null })}
              />
              {visiblePosts.length === 0 ? (
                <div className="cms-empty">No posts match.</div>
              ) : (
                <ul className="cms-list">
                  {visiblePosts.map((post, i) => (
                    <li key={post.id} className="cms-item">
                      <div className="cms-item__order">
                        <button className="cms-icon-btn" disabled={i === 0} onClick={() => move('post', visiblePosts, i, -1)} aria-label="Move up"><ArrowUp size={14} /></button>
                        <button className="cms-icon-btn" disabled={i === visiblePosts.length - 1} onClick={() => move('post', visiblePosts, i, 1)} aria-label="Move down"><ArrowDown size={14} /></button>
                      </div>
                      <div className="cms-item__body">
                        <div className="cms-item__title">
                          {post.title}
                          <span className={`cms-badge ${post.is_hidden ? 'cms-badge--muted' : 'cms-badge--live'}`}>
                            {post.is_hidden ? 'Draft' : 'Published'}
                          </span>
                        </div>
                        <div className="cms-item__meta">
                          <code>{post.id}</code> · {post.date} · {(post.profile_ids ?? []).map((pid) => profiles.find((p) => p.id === pid)?.name ?? pid).join(', ') || 'no profile'}
                        </div>
                      </div>
                      <div className="cms-item__actions">
                        <a className="cms-icon-btn" href={`/blog/${post.id}?profile=${post.profile_ids?.[0] ?? ''}`} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${post.title}`} title="Preview">
                          <ExternalLink size={15} />
                        </a>
                        <button className="cms-icon-btn" onClick={() => toggleHidden('post', post)} aria-label={post.is_hidden ? 'Publish' : 'Unpublish'} title={post.is_hidden ? 'Publish' : 'Unpublish'}>
                          {post.is_hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button className="cms-icon-btn" onClick={() => setEditing({ kind: 'post', item: post })} aria-label={`Edit ${post.title}`} title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="cms-icon-btn cms-icon-btn--danger" onClick={(e) => requestDelete({ kind: 'post', id: post.id, label: `post "${post.title}"` }, e)} aria-label={`Delete ${post.title}`} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : (
            <section aria-label="Settings">
              <SecurityForm onSuccess={(m) => addToast(m, 'success')} onError={(m) => addToast(m, 'error')} />
            </section>
          )}
        </div>
      </main>

      {deleteTarget && (
        <DeleteDialog
          label={deleteTarget.label}
          onConfirm={confirmDelete}
          onCancel={() => { setDeleteTarget(null); lastFocusRef.current?.focus(); }}
        />
      )}

      {presetTarget && (
        <ConfirmDialog
          title="Apply suggested content?"
          desc="Overwrites this profile's hero, bio, and philosophy text with the suggested professional copy, and creates any missing projects and blog posts for this profile. Existing projects or posts with the same id are left alone."
          actionLabel={saving ? 'Applying…' : 'Apply'}
          onConfirm={() => handleApplyPreset(presetTarget)}
          onCancel={() => setPresetTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ─── List controls (search + filter + primary action) ──────────────────── */

function ListControls({ search, onSearch, profileFilter, onProfileFilter, profiles, actionLabel, onAction }: {
  search: string; onSearch: (v: string) => void;
  profileFilter: string; onProfileFilter: (v: string) => void;
  profiles: Profile[];
  actionLabel: string; onAction: () => void;
}) {
  return (
    <div className="cms-list-header">
      <div className="cms-list-header__filters">
        <div className="cms-search">
          <Search size={15} aria-hidden="true" />
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search…" aria-label="Search" />
        </div>
        <select value={profileFilter} onChange={(e) => onProfileFilter(e.target.value)} aria-label="Filter by profile">
          <option value="all">All profiles</option>
          {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <button className="cms-btn cms-btn--primary" onClick={onAction}>{actionLabel}</button>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

function Dashboard({ profiles, projects, posts, onNavigate, onSynced, addToast }: {
  profiles: Profile[]; projects: Project[]; posts: BlogPost[];
  onNavigate: (s: Section) => void;
  onSynced: () => void;
  addToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ ok: boolean; blog_post_profiles: number; project_profiles: number; log?: string[] } | null>(null);

  const drafts = posts.filter((p) => p.is_hidden).length;
  const hiddenProjects = projects.filter((p) => p.is_hidden).length;
  const activeProfile = profiles.find((p) => p.is_active);

  const runSync = async () => {
    setSyncing(true);
    setSyncLog([]);
    setSyncResult(null);
    try {
      const result = await syncContentToDatabase((msg) => setSyncLog((l) => [...l, msg]));
      setSyncResult(result);
      if (result.errors.length === 0) {
        addToast(`Sync complete: ${result.updated.length} updated, ${result.created.length} created`, 'success');
      } else {
        addToast(`Sync finished with ${result.errors.length} error(s)`, 'error');
      }
      onSynced();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const runMigration = async () => {
    setMigrating(true);
    try {
      const result = await runMultiProfileMigration();
      setMigrationResult(result);
      addToast(
        `Migration complete: ${result.blog_post_profiles} blog links, ${result.project_profiles} project links`,
        'success',
      );
      onSynced();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Migration failed';
      // The endpoint returns 403 when MIGRATIONS_ENABLED is not set on Vercel —
      // surface that as a hint so the user knows where to look.
      if (msg.toLowerCase().includes('not enabled') || msg.toLowerCase().includes('migrations are')) {
        addToast('Migration is disabled. Set MIGRATIONS_ENABLED=true on Vercel, redeploy, then retry.', 'error');
      } else {
        addToast(msg, 'error');
      }
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="cms-dashboard">
      <div className="cms-stats">
        <button className="cms-stat" onClick={() => onNavigate('profiles')}>
          <span className="cms-stat__value">{profiles.length}</span>
          <span className="cms-stat__label">Profiles</span>
          <span className="cms-stat__sub">{activeProfile ? `Active: ${activeProfile.name}` : 'No active profile'}</span>
        </button>
        <button className="cms-stat" onClick={() => onNavigate('projects')}>
          <span className="cms-stat__value">{projects.length}</span>
          <span className="cms-stat__label">Projects</span>
          <span className="cms-stat__sub">{hiddenProjects} hidden</span>
        </button>
        <button className="cms-stat" onClick={() => onNavigate('blog')}>
          <span className="cms-stat__value">{posts.length}</span>
          <span className="cms-stat__label">Blog posts</span>
          <span className="cms-stat__sub">{drafts} draft{drafts === 1 ? '' : 's'}</span>
        </button>
      </div>

      <div className="cms-card">
        <div className="cms-card__header">
          <DatabaseZap size={18} aria-hidden="true" />
          <h2>Content sync</h2>
        </div>
        <p>
          Imports the case studies and blog content bundled in the code into the database, so
          everything becomes editable here. It only fills fields that are currently empty in the
          database; nothing you've already edited in the CMS is overwritten. Safe to run any time.
        </p>
        <button className="cms-btn cms-btn--primary" onClick={runSync} disabled={syncing}>
          {syncing ? 'Syncing…' : 'Sync content to database'}
        </button>
        {(syncLog.length > 0 || syncResult) && (
          <div className="cms-sync-log" role="status" aria-live="polite">
            {syncLog.map((line, i) => <div key={i} className="cms-sync-log__line">{line}</div>)}
            {syncResult && (
              <div className="cms-sync-log__summary">
                {syncResult.errors.length === 0
                  ? <><CheckCircle2 size={14} aria-hidden="true" /> Done: {syncResult.updated.length} updated, {syncResult.created.length} created, {syncResult.skipped.length} already in sync.</>
                  : <><AlertTriangle size={14} aria-hidden="true" /> {syncResult.errors.length} failed: {syncResult.errors.map((e) => e.id).join(', ')}</>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="cms-card">
        <div className="cms-card__header">
          <GitMerge size={18} aria-hidden="true" />
          <h2>Multi-profile migration</h2>
        </div>
        <p>
          One-shot backfill that switches blogs and projects from a single profile to the
          many-to-many link tables, so the same post or case study can appear under more than one
          persona. Run this once after deploying the multi-profile update; every step is idempotent.
        </p>
        <p className="cms-field__hint">
          Requires the <code>MIGRATIONS_ENABLED</code> environment variable to be set to{' '}
          <code>true</code> on Vercel. Remove it again after a successful run.
        </p>
        <button className="cms-btn cms-btn--primary" onClick={runMigration} disabled={migrating}>
          {migrating ? 'Migrating…' : 'Run multi-profile migration'}
        </button>
        {migrationResult && (
          <div className="cms-sync-log" role="status" aria-live="polite">
            <div className="cms-sync-log__summary">
              <CheckCircle2 size={14} aria-hidden="true" /> Done: {migrationResult.blog_post_profiles}{' '}
              blog links and {migrationResult.project_profiles} project links created.
            </div>
            {migrationResult.log?.map((line, i) => (
              <div key={i} className="cms-sync-log__line">{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Login ──────────────────────────────────────────────────────────────── */

function LoginScreen({ onSuccess, toasts, addToast }: {
  onSuccess: () => void;
  toasts: Toast[];
  addToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getLockout = () => {
    try {
      const raw = localStorage.getItem('admin_lockout');
      if (!raw) return null;
      return JSON.parse(raw) as { attempts: number; since: number };
    } catch { return null; }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const lockout = getLockout();
    if (lockout && lockout.attempts >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - lockout.since;
      if (elapsed < LOCKOUT_MS) {
        const remaining = Math.ceil((LOCKOUT_MS - elapsed) / 60000);
        addToast(`Too many failed attempts. Try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.`, 'error');
        return;
      }
      localStorage.removeItem('admin_lockout');
    }

    setSubmitting(true);
    try {
      await login(email, password);
      localStorage.removeItem('admin_lockout');
      onSuccess();
    } catch {
      const current = getLockout();
      const attempts = (current?.attempts ?? 0) + 1;
      localStorage.setItem('admin_lockout', JSON.stringify({ attempts, since: current?.since ?? Date.now() }));
      addToast(
        attempts >= MAX_ATTEMPTS
          ? 'Locked for 15 minutes after too many failed attempts.'
          : 'Invalid credentials',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cms-login">
      <form className="cms-login__card" onSubmit={handleLogin}>
        <h1>Studio</h1>
        <p className="cms-login__sub">Sign in to manage your portfolio</p>
        <div className="cms-field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="cms-field">
          <label htmlFor="login-password">Password</label>
          <PasswordInput id="login-password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>
        <button type="submit" disabled={submitting} className="cms-btn cms-btn--primary cms-btn--block">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ─── Delete dialog (focus-managed) ─────────────────────────────────────── */

function DeleteDialog({ label, onConfirm, onCancel }: {
  label: string; onConfirm: () => void; onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div
      className="cms-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cms-delete-title"
      aria-describedby="cms-delete-desc"
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="cms-dialog">
        <h2 id="cms-delete-title">Delete permanently?</h2>
        <p id="cms-delete-desc">The {label} will be permanently deleted. This cannot be undone.</p>
        <div className="cms-form__actions">
          <button ref={cancelRef} className="cms-btn" onClick={onCancel}>Cancel</button>
          <button className="cms-btn cms-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Confirm dialog (focus-managed) ────────────────────────────────────── */

function ConfirmDialog({ title, desc, actionLabel, onConfirm, onCancel, confirmType = 'primary' }: {
  title: string;
  desc: string;
  actionLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmType?: 'primary' | 'danger';
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return (
    <div
      className="cms-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cms-confirm-title"
      aria-describedby="cms-confirm-desc"
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="cms-dialog">
        <h2 id="cms-confirm-title">{title}</h2>
        <p id="cms-confirm-desc">{desc}</p>
        <div className="cms-form__actions">
          <button className="cms-btn" onClick={onCancel}>Cancel</button>
          <button
            ref={confirmRef}
            className={`cms-btn ${confirmType === 'danger' ? 'cms-btn--danger' : 'cms-btn--primary'}`}
            onClick={onConfirm}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toasts ─────────────────────────────────────────────────────────────── */

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="cms-toasts" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`cms-toast cms-toast--${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}
