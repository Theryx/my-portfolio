import { useState, useEffect, useCallback, useRef } from 'react';
import { PageTransition } from '../components/PageTransition';
import { supabase, type Profile, type Project, type BlogPost } from '../lib/supabase';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type Tab = 'profiles' | 'projects' | 'blog';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

let toastIdCounter = 0;

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Profile | Project | BlogPost | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ table: 'projects' | 'blog_posts' | 'profiles'; id: string } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const toastIdRef = useRef(toastIdCounter);
  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    toastIdCounter += 1;
    toastIdRef.current = toastIdCounter;
    const id = toastIdRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const getLockout = () => {
    try {
      const raw = localStorage.getItem('admin_lockout');
      if (!raw) return null;
      return JSON.parse(raw) as { attempts: number; since: number };
    } catch { return null; }
  };

  const handleLogin = async () => {
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

    setLoginSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoginSubmitting(false);

    if (error) {
      const lockout = getLockout();
      const attempts = (lockout?.attempts ?? 0) + 1;
      localStorage.setItem('admin_lockout', JSON.stringify({ attempts, since: lockout?.since ?? Date.now() }));
      addToast(attempts >= MAX_ATTEMPTS ? 'Account locked for 15 minutes after too many failed attempts.' : 'Invalid credentials', 'error');
    } else {
      localStorage.removeItem('admin_lockout');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profilesRes, projectsRes, blogRes] = await Promise.all([
        supabase.from('profiles').select('*').order('id'),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('blog_posts').select('*').order('sort_order', { ascending: true }),
      ]);
      if (profilesRes.data) setProfiles(profilesRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (blogRes.data) setBlogPosts(blogRes.data);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error fetching data:', err);
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchAll();
  }, [isAuthenticated]);

  const saveProfile = async (profile: Partial<Profile>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ ...profile, updated_at: new Date().toISOString() })
        .select();
      if (error) throw error;
      await fetchAll();
      setEditingItem(null);
      addToast('Profile saved', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      addToast('Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveProject = async (project: Partial<Project>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .upsert({ ...project, updated_at: new Date().toISOString() })
        .select();
      if (error) throw error;
      await fetchAll();
      setEditingItem(null);
      addToast('Project saved', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      addToast('Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveBlogPost = async (post: Partial<BlogPost>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .upsert({ ...post, updated_at: new Date().toISOString() })
        .select();
      if (error) throw error;
      await fetchAll();
      setEditingItem(null);
      addToast('Blog post saved', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      addToast('Failed to save blog post', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleHidden = async (table: 'projects' | 'blog_posts', item: Project | BlogPost) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_hidden: !item.is_hidden })
        .eq('id', item.id);
      if (error) throw error;
      await fetchAll();
      addToast(`Item ${item.is_hidden ? 'shown' : 'hidden'}`, 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      addToast('Failed to update visibility', 'error');
    }
  };

  const deleteItem = (table: 'projects' | 'blog_posts' | 'profiles', id: string) => {
    setDeleteConfirm({ table, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error } = await supabase.from(deleteConfirm.table).delete().eq('id', deleteConfirm.id);
      if (error) throw error;
      await fetchAll();
      addToast('Item deleted', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      addToast('Failed to delete item', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const defaultProfileId = profiles[0]?.id || '';

  if (authLoading) {
    return (
      <PageTransition>
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </PageTransition>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <section className="admin-login">
          <div className="container">
            <div className="admin-login__form">
              <h2>Admin Login</h2>
              <div className="admin__field">
                <label htmlFor="admin-email">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoComplete="email"
                />
              </div>
              <div className="admin__field">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                />
              </div>
              <button onClick={handleLogin} disabled={loginSubmitting} className="btn btn--primary">
                {loginSubmitting ? 'Signing in…' : 'Login'}
              </button>
            </div>
          </div>
          <ToastContainer toasts={toasts} />
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="admin">
        <div className="container">
          <div className="admin__topbar">
            <h2 className="section__title" style={{ marginBottom: 0 }}>CMS Dashboard</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="btn btn--secondary" style={{ fontSize: '14px', padding: '8px 16px' }} onClick={fetchAll}>
                Refresh
              </button>
              <button className="btn btn--secondary" style={{ fontSize: '14px', padding: '8px 16px' }} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="admin__tabs" role="tablist" aria-label="CMS sections">
            {(['profiles', 'projects', 'blog'] as Tab[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`tabpanel-${tab}`}
                id={`tab-${tab}`}
                className={`admin__tab ${activeTab === tab ? 'admin__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'blog' ? 'Blog Posts' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="admin__tab-count">
                  {tab === 'profiles' ? profiles.length : tab === 'projects' ? projects.length : blogPosts.length}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="admin__loading">Loading…</div>
          ) : (
            <>
              {activeTab === 'profiles' && (
                <div className="admin__section" role="tabpanel" id="tabpanel-profiles" aria-labelledby="tab-profiles">
                  <div className="admin__header">
                    <h3>Portfolio Profiles</h3>
                    <button className="btn btn--primary" onClick={() => setEditingItem({} as Profile)}>
                      + New Profile
                    </button>
                  </div>
                  <div className="admin__list">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="admin__item">
                        <div className="admin__item-info">
                          <strong>{profile.name || '(unnamed)'}</strong>
                          <span>ID: {profile.id}</span>
                          <span className={`admin__status ${profile.is_active ? 'admin__status--active' : 'admin__status--hidden'}`}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="admin__item-actions">
                          <button onClick={() => setEditingItem(profile)}>Edit</button>
                          <button className="admin__btn-danger" onClick={() => deleteItem('profiles', profile.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="admin__section" role="tabpanel" id="tabpanel-projects" aria-labelledby="tab-projects">
                  <div className="admin__header">
                    <h3>Projects</h3>
                    <button
                      className="btn btn--primary"
                      onClick={() => setEditingItem({ profile_id: defaultProfileId, is_hidden: false, sort_order: projects.length } as Project)}
                    >
                      + New Project
                    </button>
                  </div>
                  <div className="admin__list">
                    {projects.map((project) => (
                      <div key={project.id} className="admin__item">
                        <div className="admin__item-info">
                          <strong>{project.title}</strong>
                          <span>{project.tag} · Profile: {project.profile_id}</span>
                          <span className={`admin__status ${project.is_hidden ? 'admin__status--hidden' : 'admin__status--visible'}`}>
                            {project.is_hidden ? 'Hidden' : 'Visible'}
                          </span>
                        </div>
                        <div className="admin__item-actions">
                          <button onClick={() => toggleHidden('projects', project)}>
                            {project.is_hidden ? 'Show' : 'Hide'}
                          </button>
                          <button onClick={() => setEditingItem(project)}>Edit</button>
                          <button className="admin__btn-danger" onClick={() => deleteItem('projects', project.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="admin__section" role="tabpanel" id="tabpanel-blog" aria-labelledby="tab-blog">
                  <div className="admin__header">
                    <h3>Blog Posts</h3>
                    <button
                      className="btn btn--primary"
                      onClick={() => setEditingItem({ profile_id: defaultProfileId, is_hidden: true, sort_order: blogPosts.length } as BlogPost)}
                    >
                      + New Post
                    </button>
                  </div>
                  <div className="admin__list">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="admin__item">
                        <div className="admin__item-info">
                          <strong>{post.title}</strong>
                          <span>{post.date} · Profile: {post.profile_id}</span>
                          <span className={`admin__status ${post.is_hidden ? 'admin__status--hidden' : 'admin__status--visible'}`}>
                            {post.is_hidden ? 'Draft' : 'Published'}
                          </span>
                        </div>
                        <div className="admin__item-actions">
                          <button onClick={() => toggleHidden('blog_posts', post)}>
                            {post.is_hidden ? 'Publish' : 'Unpublish'}
                          </button>
                          <button onClick={() => setEditingItem(post)}>Edit</button>
                          <button className="admin__btn-danger" onClick={() => deleteItem('blog_posts', post.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {editingItem && (
            <div
              className="admin__modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-modal-title"
              ref={modalRef}
              onClick={(e) => e.target === e.currentTarget && setEditingItem(null)}
              onKeyDown={(e) => e.key === 'Escape' && setEditingItem(null)}
            >
              <div className="admin__modal-content">
                <div className="admin__modal-header">
                  <h3 id="admin-modal-title">
                    {'id' in editingItem && editingItem.id ? 'Edit' : 'Create'}{' '}
                    {activeTab === 'profiles' ? 'Profile' : activeTab === 'projects' ? 'Project' : 'Blog Post'}
                  </h3>
                  <button className="admin__modal-close" onClick={() => setEditingItem(null)} aria-label="Close dialog">✕</button>
                </div>
                {activeTab === 'profiles' ? (
                  <ProfileForm profile={editingItem as Profile} onSave={saveProfile} onCancel={() => setEditingItem(null)} saving={saving} />
                ) : activeTab === 'projects' ? (
                  <ProjectForm project={editingItem as Project} profiles={profiles} onSave={saveProject} onCancel={() => setEditingItem(null)} saving={saving} />
                ) : (
                  <BlogForm post={editingItem as BlogPost} profiles={profiles} onSave={saveBlogPost} onCancel={() => setEditingItem(null)} saving={saving} />
                )}
              </div>
            </div>
          )}

          {deleteConfirm && (
            <div
              className="admin__modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
              aria-describedby="delete-modal-desc"
              onKeyDown={(e) => e.key === 'Escape' && setDeleteConfirm(null)}
            >
              <div className="admin__modal-content admin__modal-content--sm">
                <h3 id="delete-modal-title">Confirm Delete</h3>
                <p id="delete-modal-desc" style={{ margin: '12px 0 24px' }}>This item will be permanently deleted and cannot be recovered.</p>
                <div className="admin__actions">
                  <button className="btn admin__btn-danger" onClick={confirmDelete}>Delete</button>
                  <button className="btn btn--secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <ToastContainer toasts={toasts} />
    </PageTransition>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="admin__toasts" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`admin__toast admin__toast--${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}

/* ─── Array field editor ─────────────────────────────────────────────────── */

function ArrayEditor({ label, values, onChange, placeholder }: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft('');
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div className="admin__field">
      <label>{label}</label>
      <div className="admin__array-tags">
        {values.map((v, i) => (
          <span key={v} className="admin__tag">
            {v}
            <button type="button" onClick={() => remove(i)}>✕</button>
          </span>
        ))}
      </div>
      <div className="admin__array-input">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder || 'Type and press Enter'}
        />
        <button type="button" className="admin__array-add" onClick={add}>Add</button>
      </div>
    </div>
  );
}

/* ─── Key-value editor (for social_links) ───────────────────────────────── */

function KVEditor({ label, value, onChange }: {
  label: string;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) {
  const [draftKey, setDraftKey] = useState('');
  const [draftVal, setDraftVal] = useState('');
  const entries = Object.entries(value);
  const add = () => {
    const k = draftKey.trim(), v = draftVal.trim();
    if (k && v) { onChange({ ...value, [k]: v }); setDraftKey(''); setDraftVal(''); }
  };
  const remove = (k: string) => {
    const next = { ...value };
    delete next[k];
    onChange(next);
  };

  return (
    <div className="admin__field">
      <label>{label}</label>
      <div className="admin__array-tags">
        {entries.map(([k, v]) => (
          <span key={k} className="admin__tag">
            <strong>{k}:</strong> {v}
            <button type="button" onClick={() => remove(k)}>✕</button>
          </span>
        ))}
      </div>
      <div className="admin__kv-input">
        <input value={draftKey} onChange={(e) => setDraftKey(e.target.value)} placeholder="platform (e.g. github)" />
        <input value={draftVal} onChange={(e) => setDraftVal(e.target.value)} placeholder="URL" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        <button type="button" className="admin__array-add" onClick={add}>Add</button>
      </div>
    </div>
  );
}

/* ─── Profile Form ───────────────────────────────────────────────────────── */

function ProfileForm({ profile, onSave, onCancel, saving }: {
  profile: Profile | null;
  onSave: (p: Partial<Profile>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: profile?.id || '',
    name: profile?.name || '',
    is_active: profile?.is_active ?? true,
    bio: profile?.bio || '',
    tagline: profile?.tagline || '',
    hero_title: profile?.hero_title || '',
    hero_subtitle: profile?.hero_subtitle || '',
    philosophy_title: profile?.philosophy_title || '',
    philosophy_text: profile?.philosophy_text || '',
    badges: profile?.badges || [],
    social_links: profile?.social_links || {},
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Profile ID (slug)</label>
          <input value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. fintech, design-engineer" required />
        </div>
        <div className="admin__field">
          <label>Display Name</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>
      </div>
      <div className="admin__field admin__field--checkbox">
        <label>
          <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} />
          Active (visible to visitors)
        </label>
      </div>

      <div className="admin__form-section">Hero</div>
      <div className="admin__field">
        <label>Hero Title</label>
        <input value={form.hero_title} onChange={(e) => set('hero_title', e.target.value)} />
      </div>
      <div className="admin__field">
        <label>Hero Subtitle</label>
        <textarea value={form.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} rows={2} />
      </div>
      <div className="admin__field">
        <label>Tagline</label>
        <textarea value={form.tagline} onChange={(e) => set('tagline', e.target.value)} rows={2} />
      </div>

      <div className="admin__form-section">About</div>
      <div className="admin__field">
        <label>Bio</label>
        <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={4} />
      </div>
      <ArrayEditor label="Badges" values={form.badges} onChange={(v) => set('badges', v)} placeholder="e.g. Available for projects" />

      <div className="admin__form-section">Philosophy</div>
      <div className="admin__field">
        <label>Philosophy Title</label>
        <input value={form.philosophy_title} onChange={(e) => set('philosophy_title', e.target.value)} />
      </div>
      <div className="admin__field">
        <label>Philosophy Text</label>
        <textarea value={form.philosophy_text} onChange={(e) => set('philosophy_text', e.target.value)} rows={4} />
      </div>

      <div className="admin__form-section">Social Links</div>
      <KVEditor label="Social Links" value={form.social_links} onChange={(v) => set('social_links', v)} />

      <div className="admin__actions">
        <button type="submit" disabled={saving} className="btn btn--primary">{saving ? 'Saving…' : 'Save Profile'}</button>
        <button type="button" onClick={onCancel} className="btn btn--secondary">Cancel</button>
      </div>
    </form>
  );
}

/* ─── Project Form ───────────────────────────────────────────────────────── */

function ProjectForm({ project, profiles, onSave, onCancel, saving }: {
  project: Project | null;
  profiles: Profile[];
  onSave: (p: Partial<Project>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: project?.id || '',
    profile_id: project?.profile_id || profiles[0]?.id || '',
    tag: project?.tag || '',
    title: project?.title || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    impact: project?.impact || '',
    image: project?.image || '',
    site: project?.site || '',
    role: project?.role || '',
    period: project?.period || '',
    location: project?.location || '',
    responsibilities: project?.responsibilities || [],
    challenge: project?.challenge || '',
    challenge_text: project?.challenge_text || '',
    solution: project?.solution || '',
    solution_text: project?.solution_text || '',
    result: project?.result || '',
    result_text: project?.result_text || '',
    is_hidden: project?.is_hidden ?? false,
    sort_order: project?.sort_order ?? 0,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <div className="admin__form-section">Basic Info</div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Project ID</label>
          <input value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. paysika" required />
        </div>
        <div className="admin__field">
          <label>Profile</label>
          <select value={form.profile_id} onChange={(e) => set('profile_id', e.target.value)}>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Tag / Category</label>
          <input value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="e.g. Fintech" />
        </div>
        <div className="admin__field">
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
      </div>
      <div className="admin__field">
        <label>Title</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required />
      </div>
      <div className="admin__field">
        <label>Tagline</label>
        <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
      </div>
      <div className="admin__field">
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} />
      </div>

      <div className="admin__form-section">Details</div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Role</label>
          <input value={form.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div className="admin__field">
          <label>Period</label>
          <input value={form.period} onChange={(e) => set('period', e.target.value)} placeholder="e.g. Jan 2024 – Present" />
        </div>
      </div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Location</label>
          <input value={form.location} onChange={(e) => set('location', e.target.value)} />
        </div>
        <div className="admin__field">
          <label>Impact</label>
          <input value={form.impact} onChange={(e) => set('impact', e.target.value)} />
        </div>
      </div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Site URL</label>
          <input value={form.site} onChange={(e) => set('site', e.target.value)} placeholder="https://..." />
        </div>
        <div className="admin__field">
          <label>Image URL</label>
          <input value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <ArrayEditor label="Responsibilities" values={form.responsibilities} onChange={(v) => set('responsibilities', v)} placeholder="Add a responsibility and press Enter" />

      <div className="admin__form-section">Case Study</div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Challenge Title</label>
          <input value={form.challenge} onChange={(e) => set('challenge', e.target.value)} />
        </div>
        <div className="admin__field">
          <label>Solution Title</label>
          <input value={form.solution} onChange={(e) => set('solution', e.target.value)} />
        </div>
      </div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Challenge Text</label>
          <textarea value={form.challenge_text} onChange={(e) => set('challenge_text', e.target.value)} rows={3} />
        </div>
        <div className="admin__field">
          <label>Solution Text</label>
          <textarea value={form.solution_text} onChange={(e) => set('solution_text', e.target.value)} rows={3} />
        </div>
      </div>
      <div className="admin__field">
        <label>Result Title</label>
        <input value={form.result} onChange={(e) => set('result', e.target.value)} />
      </div>
      <div className="admin__field">
        <label>Result Text</label>
        <textarea value={form.result_text} onChange={(e) => set('result_text', e.target.value)} rows={3} />
      </div>

      <div className="admin__form-section">Visibility</div>
      <div className="admin__field admin__field--checkbox">
        <label>
          <input type="checkbox" checked={form.is_hidden} onChange={(e) => set('is_hidden', e.target.checked)} />
          Hidden (not shown on site)
        </label>
      </div>

      <div className="admin__actions">
        <button type="submit" disabled={saving} className="btn btn--primary">{saving ? 'Saving…' : 'Save Project'}</button>
        <button type="button" onClick={onCancel} className="btn btn--secondary">Cancel</button>
      </div>
    </form>
  );
}

/* ─── Blog Form ──────────────────────────────────────────────────────────── */

function BlogForm({ post, profiles, onSave, onCancel, saving }: {
  post: BlogPost | null;
  profiles: Profile[];
  onSave: (p: Partial<BlogPost>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: post?.id || '',
    profile_id: post?.profile_id || profiles[0]?.id || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    date: post?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    author: post?.author || 'Ndouken Theryx',
    read_time: post?.read_time || '',
    tags: post?.tags || [],
    image: post?.image || '',
    is_hidden: post?.is_hidden ?? true,
    sort_order: post?.sort_order ?? 0,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <div className="admin__form-section">Basic Info</div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Post ID</label>
          <input value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. my-blog-post" required />
        </div>
        <div className="admin__field">
          <label>Profile</label>
          <select value={form.profile_id} onChange={(e) => set('profile_id', e.target.value)}>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="admin__field">
        <label>Title</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required />
      </div>
      <div className="admin__field">
        <label>Excerpt</label>
        <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2} placeholder="Short summary shown in the blog list" />
      </div>

      <div className="admin__form-section">Content</div>
      <div className="admin__field">
        <label>Content (HTML)</label>
        <textarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={12} style={{ fontFamily: 'monospace', fontSize: '13px' }} />
      </div>

      <div className="admin__form-section">Metadata</div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Date</label>
          <input value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="e.g. April 20, 2026" />
        </div>
        <div className="admin__field">
          <label>Read Time</label>
          <input value={form.read_time} onChange={(e) => set('read_time', e.target.value)} placeholder="e.g. 5 min read" />
        </div>
      </div>
      <div className="admin__form-grid">
        <div className="admin__field">
          <label>Author</label>
          <input value={form.author} onChange={(e) => set('author', e.target.value)} />
        </div>
        <div className="admin__field">
          <label>Image URL</label>
          <input value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <ArrayEditor label="Tags" values={form.tags} onChange={(v) => set('tags', v)} placeholder="e.g. Engineering, AI" />

      <div className="admin__form-section">Visibility</div>
      <div className="admin__form-grid">
        <div className="admin__field admin__field--checkbox">
          <label>
            <input type="checkbox" checked={form.is_hidden} onChange={(e) => set('is_hidden', e.target.checked)} />
            Draft (hidden from visitors)
          </label>
        </div>
        <div className="admin__field">
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="admin__actions">
        <button type="submit" disabled={saving} className="btn btn--primary">{saving ? 'Saving…' : 'Save Post'}</button>
        <button type="button" onClick={onCancel} className="btn btn--secondary">Cancel</button>
      </div>
    </form>
  );
}
