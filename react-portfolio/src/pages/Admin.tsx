import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './admin/cms.css';
import {
  LayoutDashboard, Building2, FolderKanban, Newspaper, Settings, LogOut, RefreshCw,
  ExternalLink, Search, Eye, EyeOff, Pencil, Trash2, Copy, ArrowUp, ArrowDown,
  ArrowLeft, DatabaseZap, CheckCircle2, AlertTriangle, GitMerge, Images, Plus, Upload,
} from 'lucide-react';
import {
  login, logout, getSession,
  getAllProfiles, getAllProjects, getAllBlogPosts,
  upsertProject, updateProject, deleteProject,
  upsertBlogPost, updateBlogPost, deleteBlogPost, syncContentToDatabase,
  runMultiProfileMigration,
  getWarehouseEntries,
  type Profile, type Project, type BlogPost, type SyncResult, type WarehouseEntry,
} from '../lib/api';
import { ProjectForm, BlogForm, SecurityForm } from './admin/forms';
import { PasswordInput } from './admin/fields';
import WarehousePanel from './admin/WarehousePanel';
import CompanyPanel from './admin/CompanyPanel';
import AssetPanel from './admin/AssetPanel';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type Section = 'overview' | 'warehouse' | 'companies' | 'assets' | 'projects' | 'articles' | 'settings';
type Editing =
  | { kind: 'project'; item: Project | null }
  | { kind: 'post'; item: BlogPost | null };
type DeleteTarget = { kind: 'project' | 'post'; id: string; label: string };

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

let toastIdCounter = 0;

const NAV: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'warehouse', label: 'Warehouse', icon: DatabaseZap },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'assets', label: 'Assets', icon: Images },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'articles', label: 'Articles', icon: Newspaper },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [section, setSection] = useState<Section>('overview');
  const [editing, setEditing] = useState<Editing | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [warehouseEntries, setWarehouseEntries] = useState<WarehouseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [search, setSearch] = useState('');
  const [profileFilter, setProfileFilter] = useState<string>('all');
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
      try {
        setWarehouseEntries(await getWarehouseEntries({ include_hidden: true }));
      } catch {
        setWarehouseEntries([]);
      }
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
      } else {
        await deleteBlogPost(deleteTarget.id);
        setBlogPosts((l) => l.filter((p) => p.id !== deleteTarget.id));
      }
      addToast('Deleted', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete', 'error');
    } finally {
      setDeleteTarget(null);
      lastFocusRef.current?.focus();
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
              {id === 'warehouse' && <span className="cms-sidebar__count">{warehouseEntries.length}</span>}
              {id === 'companies' && <span className="cms-sidebar__count">{profiles.length}</span>}
              {id === 'projects' && <span className="cms-sidebar__count">{projects.length}</span>}
              {id === 'articles' && <span className="cms-sidebar__count">{blogPosts.length}</span>}
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
          {editing ? (
            <div className="cms-editor">
              {editing.kind === 'project' && (
                <ProjectForm project={editing.item} profiles={profiles} onSave={saveProject} onCancel={() => setEditing(null)} saving={saving} />
              )}
              {editing.kind === 'post' && (
                <BlogForm post={editing.item} profiles={profiles} onSave={saveBlogPost} onCancel={() => setEditing(null)} saving={saving} />
              )}
            </div>
          ) : section === 'warehouse' ? (
            <WarehousePanel addToast={addToast} />
          ) : section === 'companies' ? (
            <CompanyPanel addToast={addToast} />
          ) : section === 'assets' ? (
            <AssetPanel addToast={addToast} />
          ) : section === 'overview' ? (
            <Overview
              profiles={profiles}
              projects={projects}
              posts={blogPosts}
              entries={warehouseEntries}
              onNavigate={setSection}
            />
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
                          <code>{project.id}</code> · {project.tag || 'no tag'} · {(project.profile_ids ?? []).map((pid) => profiles.find((p) => p.id === pid)?.name ?? pid).join(', ') || 'no company'}
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
          ) : section === 'articles' ? (
            <section aria-label="Articles">
              <ListControls
                search={search} onSearch={setSearch}
                profileFilter={profileFilter} onProfileFilter={setProfileFilter}
                profiles={profiles}
                actionLabel="New article"
                onAction={() => setEditing({ kind: 'post', item: null })}
              />
              {visiblePosts.length === 0 ? (
                <div className="cms-empty">No articles match.</div>
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
                          <code>{post.id}</code> · {post.date} · {(post.profile_ids ?? []).map((pid) => profiles.find((p) => p.id === pid)?.name ?? pid).join(', ') || 'no company'}
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
            <SettingsSection addToast={addToast} onSynced={fetchAll} />
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
        <select value={profileFilter} onChange={(e) => onProfileFilter(e.target.value)} aria-label="Filter by company">
          <option value="all">All companies</option>
          {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <button className="cms-btn cms-btn--primary" onClick={onAction}>{actionLabel}</button>
    </div>
  );
}

/* ─── Overview ──────────────────────────────────────────────────────────── */

function Overview({ profiles, projects, posts, entries, onNavigate }: {
  profiles: Profile[]; projects: Project[]; posts: BlogPost[]; entries: WarehouseEntry[];
  onNavigate: (s: Section) => void;
}) {
  const activeProfile = profiles.find((p) => p.is_active);
  const hiddenEntries = entries.filter((e) => e.is_hidden).length;
  const drafts = posts.filter((p) => p.is_hidden).length;
  const hiddenProjects = projects.filter((p) => p.is_hidden).length;

  const typeCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of entries) c[e.type] = (c[e.type] ?? 0) + 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const linkedCount = (companyId: string) => entries.filter((e) => (e.company_ids ?? []).includes(companyId)).length;

  return (
    <div className="cms-dashboard">
      <div className="cms-stats">
        <button className="cms-stat" onClick={() => onNavigate('companies')}>
          <span className="cms-stat__value">{profiles.length}</span>
          <span className="cms-stat__label">Companies</span>
          <span className="cms-stat__sub">{activeProfile ? `Active: ${activeProfile.name}` : 'No active company'}</span>
        </button>
        <button className="cms-stat" onClick={() => onNavigate('warehouse')}>
          <span className="cms-stat__value">{entries.length}</span>
          <span className="cms-stat__label">Warehouse entries</span>
          <span className="cms-stat__sub">{hiddenEntries} hidden</span>
        </button>
        <button className="cms-stat" onClick={() => onNavigate('projects')}>
          <span className="cms-stat__value">{projects.length}</span>
          <span className="cms-stat__label">Projects</span>
          <span className="cms-stat__sub">{hiddenProjects} hidden</span>
        </button>
        <button className="cms-stat" onClick={() => onNavigate('articles')}>
          <span className="cms-stat__value">{posts.length}</span>
          <span className="cms-stat__label">Articles</span>
          <span className="cms-stat__sub">{drafts} draft{drafts === 1 ? '' : 's'}</span>
        </button>
      </div>

      <div className="cms-overview-grid">
        <div className="cms-card">
          <div className="cms-card__header">
            <Building2 size={18} aria-hidden="true" />
            <h2>Company microsites</h2>
          </div>
          {profiles.length === 0 ? (
            <p>No companies yet. Create one to start building a targeted microsite.</p>
          ) : (
            <ul className="cms-overview-list">
              {profiles.map((c) => (
                <li key={c.id}>
                  <span className="cms-overview-list__name">
                    {c.name}
                    {c.is_active && <span className="cms-badge cms-badge--live">Active</span>}
                  </span>
                  <span className="cms-overview-list__meta">{linkedCount(c.id)} linked</span>
                </li>
              ))}
            </ul>
          )}
          <button className="cms-btn cms-btn--primary" onClick={() => onNavigate('companies')}>
            <Plus size={15} /> Manage companies
          </button>
        </div>

        <div className="cms-card">
          <div className="cms-card__header">
            <DatabaseZap size={18} aria-hidden="true" />
            <h2>Warehouse by type</h2>
          </div>
          {typeCounts.length === 0 ? (
            <p>The warehouse is empty. Add bios, experience, projects, articles and more.</p>
          ) : (
            <div className="cms-chip-row">
              {typeCounts.map(([type, count]) => (
                <span key={type} className="cms-chip">
                  {type} <strong>{count}</strong>
                </span>
              ))}
            </div>
          )}
          <div className="cms-card__actions">
            <button className="cms-btn cms-btn--primary" onClick={() => onNavigate('warehouse')}>
              <DatabaseZap size={15} /> Open warehouse
            </button>
            <button className="cms-btn" onClick={() => onNavigate('assets')}>
              <Upload size={15} /> Upload asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Settings (security + one-shot tools) ──────────────────────────────── */

function SettingsSection({ addToast, onSynced }: {
  addToast: (m: string, t: 'success' | 'error') => void;
  onSynced: () => void;
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ ok: boolean; blog_post_profiles: number; project_profiles: number; log?: string[] } | null>(null);

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
    <section aria-label="Settings" className="cms-dashboard">
      <div className="cms-card">
        <div className="cms-card__header">
          <Settings size={18} aria-hidden="true" />
          <h2>Credentials</h2>
        </div>
        <SecurityForm onSuccess={(m) => addToast(m, 'success')} onError={(m) => addToast(m, 'error')} />
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
          company. Run this once after deploying the multi-profile update; every step is idempotent.
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
    </section>
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
