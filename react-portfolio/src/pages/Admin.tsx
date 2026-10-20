import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './admin/cms.css';
import {
  LayoutDashboard, Briefcase, Library, Globe, Images, Settings, LogOut, ExternalLink, Search,
  CheckCircle2, AlertTriangle, Sun, Moon, Plus, Upload, ArrowRight, DatabaseZap, GitMerge, Clock,
  type LucideIcon,
} from 'lucide-react';
import {
  login, logout, getSession, syncContentToDatabase, runMultiProfileMigration, type SyncResult,
} from '../lib/api';
import { PasswordInput } from './admin/fields';
import { SecurityForm } from './admin/forms';
import { PageHead, Section, Pill, Disclosure, Thumb } from './admin/ui';
import LibraryPanel from './admin/LibraryPanel';
import ApplicationsPanel, { Fit } from './admin/ApplicationsPanel';
import MainSitePanel from './admin/MainSitePanel';
import AssetPanel from './admin/AssetPanel';
import { useStudioData, isApplication, STAGES, STAGE_BY_ID, stageOf, type StudioData, type Toast } from './admin/data';
import { useHashRoute, hrefFor, type SectionId } from './admin/route';
import { ENTRY_TYPES, typeOf, relativeDate } from './admin/entryTypes';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

interface ToastItem { id: number; message: string; type: 'success' | 'error' }
let toastSeq = 0;

const NAV: { id: SectionId; label: string; short: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', short: 'Home', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', short: 'Apps', icon: Briefcase },
  { id: 'library', label: 'Library', short: 'Library', icon: Library },
  { id: 'assets', label: 'Assets', short: 'Assets', icon: Images },
  { id: 'main-site', label: 'Main site', short: 'Site', icon: Globe },
  { id: 'settings', label: 'Settings', short: 'Settings', icon: Settings },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback<Toast>((message, type) => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  useEffect(() => {
    document.title = 'Studio · Ndouken Theryx';
    getSession()
      .then((ok) => setAuthed(ok))
      .catch(() => undefined)
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) return <div className="cms cms-loading-screen">Opening Studio…</div>;

  return (
    <>
      {authed
        ? <Studio toast={toast} onLogout={() => setAuthed(false)} />
        : <LoginScreen onSuccess={() => setAuthed(true)} toast={toast} />}
      <Toasts toasts={toasts} />
    </>
  );
}

/* ─── Shell ─────────────────────────────────────────────────────────────── */

function Studio({ toast, onLogout }: { toast: Toast; onLogout: () => void }) {
  const data = useStudioData(true, toast);
  const [route, navigate] = useHashRoute();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dark, toggleTheme] = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const counts: Partial<Record<SectionId, number>> = {
    applications: data.companies.filter(isApplication).filter((c) => stageOf(c) !== 'closed').length,
    library: data.entries.length,
  };

  const go = (id: SectionId) => navigate(hrefFor(id));
  const signOut = async () => { await logout(); onLogout(); };

  return (
    <div className="cms">
      <aside className="cms-sidebar" aria-label="Studio">
        <div className="cms-brand"><span className="cms-brand__mark" aria-hidden="true">N</span> Studio</div>
        <button type="button" className="cms-search-trigger" onClick={() => setPaletteOpen(true)}>
          <Search size={14} aria-hidden="true" /><span>Jump to…</span><kbd className="cms-kbd">Ctrl K</kbd>
        </button>
        <nav className="cms-nav" aria-label="Sections">
          {NAV.filter((n) => n.id !== 'settings').map(({ id, label, icon: Icon }) => (
            <a key={id} href={hrefFor(id)} className="cms-nav__link" aria-current={route.section === id ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); go(id); }}>
              <Icon size={17} aria-hidden="true" />
              <span className="cms-nav__label">{label}</span>
              {counts[id] != null && <span className="cms-nav__count">{counts[id]}</span>}
            </a>
          ))}
        </nav>
        <div className="cms-nav__footer">
          <a href={hrefFor('settings')} className="cms-nav__link" aria-current={route.section === 'settings' ? 'page' : undefined}
            onClick={(e) => { e.preventDefault(); go('settings'); }}>
            <Settings size={17} aria-hidden="true" /><span className="cms-nav__label">Settings</span>
          </a>
          <a className="cms-nav__link" href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={17} aria-hidden="true" /><span className="cms-nav__label">View public site</span>
          </a>
          <button type="button" className="cms-nav__link" onClick={toggleTheme}>
            {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            <span className="cms-nav__label">{dark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button type="button" className="cms-nav__link" onClick={signOut}>
            <LogOut size={17} aria-hidden="true" /><span className="cms-nav__label">Sign out</span>
          </button>
        </div>
      </aside>

      <div className="cms-main">
        <div className="cms-mobile-top">
          <div className="cms-brand"><span className="cms-brand__mark" aria-hidden="true">N</span> Studio</div>
          <div className="cms-row" style={{ gap: 2 }}>
            <button type="button" className="cms-icon-btn" onClick={() => setPaletteOpen(true)} aria-label="Jump to"><Search size={17} /></button>
            <button type="button" className="cms-icon-btn" onClick={toggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button type="button" className="cms-icon-btn" onClick={signOut} aria-label="Sign out"><LogOut size={17} /></button>
          </div>
        </div>

        <main className={`cms-page${route.section === 'applications' && !route.id ? ' cms-page--wide' : ''}`}>
          {route.section === 'overview' && <Overview data={data} navigate={navigate} />}
          {route.section === 'applications' && <ApplicationsPanel data={data} route={route} navigate={navigate} toast={toast} />}
          {route.section === 'library' && <LibraryPanel data={data} route={route} navigate={navigate} toast={toast} />}
          {route.section === 'main-site' && <MainSitePanel data={data} route={route} navigate={navigate} toast={toast} />}
          {route.section === 'assets' && <AssetPanel data={data} toast={toast} />}
          {route.section === 'settings' && <SettingsPanel toast={toast} onSynced={data.reload} />}
        </main>
      </div>

      <nav className="cms-tabbar" aria-label="Sections">
        {NAV.map(({ id, short, label, icon: Icon }) => (
          <a key={id} href={hrefFor(id)} className="cms-tabbar__link" aria-current={route.section === id ? 'page' : undefined} aria-label={label}
            onClick={(e) => { e.preventDefault(); go(id); }}>
            <Icon size={19} aria-hidden="true" />
            <span aria-hidden="true">{short}</span>
          </a>
        ))}
      </nav>

      {paletteOpen && <CommandPalette data={data} navigate={navigate} onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}

function useTheme(): [boolean, () => void] {
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') !== 'light');
  const toggle = () => {
    const next = !dark;
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* storage unavailable */ }
    setDark(next);
  };
  return [dark, toggle];
}

/* ─── Overview ──────────────────────────────────────────────────────────── */

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function Overview({ data, navigate }: { data: StudioData; navigate: (href: string) => void }) {
  const apps = data.companies.filter(isApplication);
  const active = apps
    .filter((c) => stageOf(c) !== 'closed')
    .sort((a, b) => STAGES.findIndex((s) => s.id === stageOf(b)) - STAGES.findIndex((s) => s.id === stageOf(a)));
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of data.entries) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, [data.entries]);
  const recent = [...data.entries]
    .filter((e) => e.updated_at)
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    .slice(0, 6);
  const shown = data.companies.find((c) => c.is_active);
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <PageHead title={greeting()} sub={today} />
      <div className="cms-overview">
        <div className="cms-stack">
          <Section
            title="Applications"
            description={active.length ? `${active.length} in progress` : 'Nothing in progress'}
            actions={<button type="button" className="cms-btn cms-btn--sm" onClick={() => navigate(hrefFor('applications'))}>Open board <ArrowRight size={13} /></button>}
          >
            <div className="cms-stagebar">
              {STAGES.map((s) => (
                <button key={s.id} type="button" className="cms-stagebar__item" onClick={() => navigate(hrefFor('applications', undefined, undefined, { stage: s.id }))}>
                  <span className="cms-stagebar__value">{apps.filter((c) => stageOf(c) === s.id).length}</span>
                  <span className="cms-stagebar__label">{s.label}</span>
                </button>
              ))}
            </div>
            {active.length > 0 && (
              <ul className="cms-rows">
                {active.slice(0, 5).map((c) => {
                  const s = STAGE_BY_ID[stageOf(c)];
                  return (
                    <li key={c.id} className="cms-rowitem">
                      <button type="button" className="cms-rowitem__main" onClick={() => navigate(hrefFor('applications', c.id))}>
                        <span className="cms-rowitem__title"><span>{c.name}</span></span>
                        <span className="cms-rowitem__meta">
                          <span>{c.role || 'No role'}</span>
                          {c.application?.fit_score != null && <><span className="cms-dotsep" /><Fit score={c.application.fit_score} /></>}
                        </span>
                      </button>
                      <Pill tone={s.tone}>{s.label}</Pill>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          <Section title="Recently edited" actions={<button type="button" className="cms-btn cms-btn--sm" onClick={() => navigate(hrefFor('library'))}>Library <ArrowRight size={13} /></button>}>
            {recent.length === 0 ? <p className="cms-field__hint">{data.loading ? 'Loading…' : 'Nothing yet.'}</p> : (
              <ul className="cms-rows">
                {recent.map((e) => {
                  const t = typeOf(e.type);
                  return (
                    <li key={e.id} className="cms-rowitem">
                      {t.imageKey ? <Thumb src={String(e.metadata?.[t.imageKey] ?? '')} /> : <span className="cms-thumb"><t.icon size={16} aria-hidden="true" /></span>}
                      <button type="button" className="cms-rowitem__main" onClick={() => navigate(hrefFor('library', e.id))}>
                        <span className="cms-rowitem__title"><span>{e.title}</span></span>
                        <span className="cms-rowitem__meta">{t.label}<span className="cms-dotsep" /><Clock size={12} aria-hidden="true" /> {relativeDate(e.updated_at)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        <div className="cms-stack">
          <Section title="Quick actions">
            <div className="cms-quick">
              <button type="button" className="cms-btn" onClick={() => navigate(hrefFor('applications', 'new'))}><Plus size={14} /> Application</button>
              <button type="button" className="cms-btn" onClick={() => navigate(hrefFor('library', 'new', undefined, { type: 'project' }))}><Plus size={14} /> Project</button>
              <button type="button" className="cms-btn" onClick={() => navigate(hrefFor('assets'))}><Upload size={14} /> Upload</button>
              <a className="cms-btn" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Public site</a>
            </div>
          </Section>

          <Section title="Library" description="What the AI can draw on when it tailors a portfolio.">
            <div className="cms-health">
              {ENTRY_TYPES.filter((t) => t.core || counts[t.type]).map((t) => {
                const n = counts[t.type] ?? 0;
                return (
                  <button key={t.type} type="button" className={`cms-health__item${n ? '' : ' cms-health__item--missing'}`}
                    onClick={() => navigate(n ? hrefFor('library', undefined, undefined, { type: t.type }) : hrefFor('library', 'new', undefined, { type: t.type }))}>
                    <span>{t.plural}</span>
                    <strong>{n || 'Add'}</strong>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Public site">
            <p className="cms-field__hint">
              {shown ? <>Visitors see <strong style={{ color: 'var(--s-text)' }}>{shown.name}</strong>.</> : 'No profile is shown to visitors.'}
            </p>
            <div><button type="button" className="cms-btn cms-btn--sm" onClick={() => navigate(hrefFor('main-site'))}>Manage profiles <ArrowRight size={13} /></button></div>
          </Section>
        </div>
      </div>
    </>
  );
}

/* ─── Settings ──────────────────────────────────────────────────────────── */

function SettingsPanel({ toast, onSynced }: { toast: Toast; onSynced: () => void }) {
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ blog_post_profiles: number; project_profiles: number; log?: string[] } | null>(null);

  const runSync = async () => {
    setSyncing(true);
    setSyncLog([]);
    setSyncResult(null);
    try {
      const result = await syncContentToDatabase((msg) => setSyncLog((l) => [...l, msg]));
      setSyncResult(result);
      toast(result.errors.length ? `Sync finished with ${result.errors.length} error(s)` : 'Sync complete', result.errors.length ? 'error' : 'success');
      onSynced();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const runMigration = async () => {
    setMigrating(true);
    try {
      const result = await runMultiProfileMigration();
      setMigrationResult(result);
      toast('Migration complete', 'success');
      onSynced();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Migration failed';
      toast(/not enabled|migrations are/i.test(msg) ? 'Migrations are off. Set MIGRATIONS_ENABLED=true on Vercel, redeploy, then retry.' : msg, 'error');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <>
      <PageHead title="Settings" />
      <div className="cms-stack">
        <Section title="Sign-in details" description="Change the email or password you use for Studio.">
          <SecurityForm onSuccess={(m) => toast(m, 'success')} onError={(m) => toast(m, 'error')} />
        </Section>

        <Disclosure title={<><DatabaseZap size={16} aria-hidden="true" /> Maintenance</>}>
          <p className="cms-field__hint">One-off tools from earlier migrations. You should rarely need them.</p>

          <div className="cms-section" style={{ gap: 10 }}>
            <h3 className="cms-section__title">Import bundled content</h3>
            <p className="cms-section__desc">
              Copies case studies and posts that live in the code into the Library. It only fills fields that are empty,
              so nothing you edited here is overwritten.
            </p>
            <div><button type="button" className="cms-btn" onClick={runSync} disabled={syncing}>{syncing ? 'Importing…' : 'Import bundled content'}</button></div>
            {(syncLog.length > 0 || syncResult) && (
              <div className="cms-log" role="status" aria-live="polite">
                {syncLog.map((line, i) => <div key={i}>{line}</div>)}
                {syncResult && (
                  <div className="cms-log__summary">
                    {syncResult.errors.length === 0
                      ? <><CheckCircle2 size={14} aria-hidden="true" /> {syncResult.updated.length} updated, {syncResult.created.length} created, {syncResult.skipped.length} already in sync.</>
                      : <><AlertTriangle size={14} aria-hidden="true" /> {syncResult.errors.length} failed: {syncResult.errors.map((e) => e.id).join(', ')}</>}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="cms-section" style={{ gap: 10 }}>
            <h3 className="cms-section__title"><GitMerge size={15} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Multi-profile migration</h3>
            <p className="cms-section__desc">
              Backfills the many-to-many links so one entry can appear on several sites. Safe to re-run. Needs
              {' '}<code>MIGRATIONS_ENABLED=true</code> on Vercel; remove it again afterwards.
            </p>
            <div><button type="button" className="cms-btn" onClick={runMigration} disabled={migrating}>{migrating ? 'Running…' : 'Run migration'}</button></div>
            {migrationResult && (
              <div className="cms-log" role="status" aria-live="polite">
                <div className="cms-log__summary"><CheckCircle2 size={14} aria-hidden="true" /> {migrationResult.blog_post_profiles} post links and {migrationResult.project_profiles} project links created.</div>
                {migrationResult.log?.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            )}
          </div>
        </Disclosure>
      </div>
    </>
  );
}

/* ─── Command palette ───────────────────────────────────────────────────── */

interface PaletteItem { key: string; label: string; kind: string; icon: LucideIcon; href: string; text: string }

function CommandPalette({ data, navigate, onClose }: {
  data: StudioData;
  navigate: (href: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const previous = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);
  useEffect(() => () => previous.current?.focus?.(), []);

  const items = useMemo<PaletteItem[]>(() => [
    ...NAV.map((n) => ({ key: `nav:${n.id}`, label: n.label, kind: 'Go to', icon: n.icon, href: hrefFor(n.id), text: n.label })),
    { key: 'new:app', label: 'New application', kind: 'Create', icon: Plus, href: hrefFor('applications', 'new'), text: 'new application job' },
    ...ENTRY_TYPES.map((t) => ({ key: `new:${t.type}`, label: `New ${t.label.toLowerCase()}`, kind: 'Create', icon: Plus, href: hrefFor('library', 'new', undefined, { type: t.type }), text: `new add ${t.label} ${t.plural}` })),
    ...data.companies.map((c) => {
      const app = isApplication(c);
      return { key: `co:${c.id}`, label: c.name, kind: app ? 'Application' : 'Profile', icon: app ? Briefcase : Globe, href: hrefFor(app ? 'applications' : 'main-site', c.id), text: `${c.name} ${c.role ?? ''} ${c.id}` };
    }),
    ...data.entries.map((e) => {
      const t = typeOf(e.type);
      return { key: `e:${e.id}`, label: e.title || e.id, kind: t.label, icon: t.icon, href: hrefFor('library', e.id), text: `${e.title} ${e.id} ${e.type}` };
    }),
  ], [data.companies, data.entries]);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const list = words.length ? items.filter((it) => words.every((w) => it.text.toLowerCase().includes(w))) : items.slice(0, NAV.length + 1);
    return list.slice(0, 40);
  }, [items, query]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const pick = (it: PaletteItem | undefined) => {
    if (!it) return;
    onClose();
    navigate(it.href);
  };

  return (
    <div className="cms-overlay cms-overlay--top" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-palette" role="dialog" aria-modal="true" aria-label="Jump to">
        <input
          className="cms-palette__input"
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
          placeholder="Jump to a section, application or entry…"
          role="combobox"
          aria-expanded="true"
          aria-controls="cms-palette-list"
          aria-activedescendant={results[index] ? `pal-${index}` : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); onClose(); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
            else if (e.key === 'Enter') { e.preventDefault(); pick(results[index]); }
          }}
        />
        {results.length === 0 ? <p className="cms-palette__empty">No matches.</p> : (
          <ul className="cms-palette__list" id="cms-palette-list" role="listbox" ref={listRef}>
            {results.map((it, i) => (
              <li key={it.key} role="presentation">
                <button type="button" id={`pal-${i}`} role="option" aria-selected={i === index} className="cms-palette__item"
                  onMouseMove={() => setIndex(i)} onClick={() => pick(it)} tabIndex={-1}>
                  <it.icon size={16} aria-hidden="true" />
                  <span>{it.label}</span>
                  <span className="cms-palette__kind">{it.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── Sign in ───────────────────────────────────────────────────────────── */

function LoginScreen({ onSuccess, toast }: { onSuccess: () => void; toast: Toast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getLockout = () => {
    try {
      const raw = localStorage.getItem('admin_lockout');
      return raw ? (JSON.parse(raw) as { attempts: number; since: number }) : null;
    } catch { return null; }
  };
  const setLockout = (v: { attempts: number; since: number } | null) => {
    try {
      if (v) localStorage.setItem('admin_lockout', JSON.stringify(v));
      else localStorage.removeItem('admin_lockout');
    } catch { /* storage unavailable */ }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const lockout = getLockout();
    if (lockout && lockout.attempts >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - lockout.since;
      if (elapsed < LOCKOUT_MS) {
        const remaining = Math.ceil((LOCKOUT_MS - elapsed) / 60000);
        toast(`Too many failed attempts. Try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.`, 'error');
        return;
      }
      setLockout(null);
    }
    setSubmitting(true);
    try {
      await login(email, password);
      setLockout(null);
      onSuccess();
    } catch {
      const current = getLockout();
      const attempts = (current?.attempts ?? 0) + 1;
      setLockout({ attempts, since: current?.since ?? Date.now() });
      toast(attempts >= MAX_ATTEMPTS ? 'Locked for 15 minutes after too many failed attempts.' : 'That email and password do not match.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cms-login">
      <form className="cms-login__card" onSubmit={handleLogin}>
        <div className="cms-brand" style={{ padding: 0 }}><span className="cms-brand__mark" aria-hidden="true">N</span> Studio</div>
        <h1>Sign in</h1>
        <p className="cms-login__sub">Manage your library, applications and sites.</p>
        <div className="cms-field">
          <label className="cms-field__label" htmlFor="login-email">Email</label>
          <input id="login-email" className="cms-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="cms-field">
          <label className="cms-field__label" htmlFor="login-password">Password</label>
          <PasswordInput id="login-password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>
        <button type="submit" disabled={submitting} className="cms-btn cms-btn--primary cms-btn--block">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <a className="cms-btn cms-btn--ghost cms-btn--block" href="/">Back to the public site</a>
      </form>
    </div>
  );
}

/* ─── Toasts ────────────────────────────────────────────────────────────── */

function Toasts({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="cms-toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`cms-toast cms-toast--${t.type}`}>
          {t.type === 'success' ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
