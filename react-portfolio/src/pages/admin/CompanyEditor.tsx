import { useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, Plus, ChevronUp, ChevronDown, X, Search, Trash2, Database } from 'lucide-react';
import {
  upsertCompany, deleteCompany, upsertWarehouseEntry,
  type Company, type WarehouseEntry, type CompanyLink, type CompanyApplication, type AboutContent,
} from '../../lib/api';
import {
  Section, TextInput, TextArea, SelectInput, NumberInput, TagInput, Switch, PageHead, SaveBar,
  Pill, Thumb, EmptyState, Disclosure,
} from './ui';
import { ConfirmDialog, Modal } from './dialogs';
import { FaqEditor, SpeakingImagesEditor } from './fields';
import { typeOf } from './entryTypes';
import { isApplication, STAGES, OUTCOMES, siteUrl, fitTone, type StudioData, type Toast } from './data';
import { hrefFor, useUnsavedGuard } from './route';

const STATUSES = [
  { value: 'published', label: 'Published: anyone with the link can open it' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];
const LAYOUTS = ['default', 'minimal', 'candidate-brief', 'bento'];

type Tab = 'job' | 'content' | 'words' | 'site';

export default function CompanyEditor({ company, data, tab, navigate, toast, backHref, backLabel }: {
  company: Company | null;
  data: StudioData;
  tab?: string;
  navigate: (href: string, opts?: { force?: boolean }) => void;
  toast: Toast;
  backHref: string;
  backLabel: string;
}) {
  const isNew = !company;
  const isApp = company ? isApplication(company) : backLabel === 'Applications';
  const section = isApp ? 'applications' : 'main-site';
  const tabs: { id: Tab; label: string }[] = isApp
    ? [{ id: 'job', label: 'Job & status' }, { id: 'content', label: 'Projects shown' }, { id: 'words', label: 'Words' }, { id: 'site', label: 'Site settings' }]
    : [{ id: 'words', label: 'Words' }, { id: 'content', label: 'Projects shown' }, { id: 'site', label: 'Site settings' }];
  const active: Tab = isNew ? (isApp ? 'job' : 'words') : ((tabs.find((t) => t.id === tab)?.id) ?? tabs[0].id);

  const initial = useMemo<Company>(() => company ?? {
    id: '', name: '', slug: '', is_active: false, role: '', job_description: '', job_url: '',
    status: 'published', layout: 'default', theme_config: {}, seo: {}, bio: '', tagline: '',
    hero_title: '', hero_subtitle: '', philosophy_title: '', philosophy_text: '', intro_expanded_text: '',
    badges: [], social_links: {}, about_content: {},
    application: isApp ? { kind: 'application', stage: 'researching' } : { kind: 'persona' },
  }, [company, isApp]);

  const [draft, setDraft] = useState<Company>(initial);
  const [themeText, setThemeText] = useState(() => JSON.stringify(initial.theme_config ?? {}, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial)
    || themeText !== JSON.stringify(initial.theme_config ?? {}, null, 2);
  useUnsavedGuard(dirty && !saving);

  // The pipeline needs the companies.application column; rows from a database
  // without it simply have no such key.
  const pipelineReady = data.companies.length === 0 || data.companies.some((c) => 'application' in c);

  const set = <K extends keyof Company>(k: K, v: Company[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const setApp = (p: Partial<CompanyApplication>) => setDraft((d) => ({ ...d, application: { ...(d.application ?? {}), ...p } }));
  const setAbout = (k: keyof AboutContent, v: unknown) => setDraft((d) => ({ ...d, about_content: { ...(d.about_content ?? {}), [k]: v } }));
  const setLink = (k: string, v: string) => setDraft((d) => ({ ...d, social_links: { ...(d.social_links ?? {}), [k]: v } }));
  const setSeo = (k: string, v: string) => setDraft((d) => ({ ...d, seo: { ...(d.seo ?? {}), [k]: v } }));

  const save = async () => {
    if (!draft.name.trim()) { toast('Give it a name first.', 'error'); return; }
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(draft.id)) { toast('The id may use letters, numbers, "-" and "_" only.', 'error'); return; }
    let theme: Record<string, unknown> = {};
    try {
      theme = themeText.trim() ? JSON.parse(themeText) : {};
      if (!theme || typeof theme !== 'object' || Array.isArray(theme)) throw new Error('must be an object');
      setJsonError(null);
    } catch (e) {
      setJsonError(`Theme is not valid JSON: ${(e as Error).message}`);
      return;
    }
    setSaving(true);
    try {
      const saved = await upsertCompany({ ...draft, slug: draft.slug || draft.id, theme_config: theme });
      data.putCompany(saved);
      toast(isNew ? 'Created' : 'Changes saved', 'success');
      navigate(hrefFor(section, saved.id, active), { force: true });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setConfirmDelete(false);
    try {
      await deleteCompany(draft.id);
      data.dropCompany(draft.id);
      toast('Deleted', 'success');
      navigate(backHref, { force: true });
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const about = draft.about_content ?? {};
  const links = draft.social_links ?? {};
  const seo = (draft.seo ?? {}) as Record<string, string>;
  const app = draft.application ?? {};

  return (
    <>
      <PageHead
        crumb={<button type="button" className="cms-crumb" onClick={() => navigate(backHref)}><ArrowLeft size={14} /> {backLabel}</button>}
        title={draft.name || (isApp ? 'New application' : 'New profile')}
        sub={isApp ? (draft.role || 'No role yet') : 'Main site profile'}
        actions={!isNew && (
          <a className="cms-btn" href={isApp ? siteUrl(draft) : `/?profile=${draft.id}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} /> Open site
          </a>
        )}
      />

      {!isNew && (
        <div className="cms-tabs" role="tablist" aria-label="Sections">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={active === t.id} onClick={() => navigate(hrefFor(section, draft.id, t.id), { force: true })}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {active === 'job' && (
        <div className="cms-editor">
          <div className="cms-stack">
            <Section title="The job">
              <div className="cms-grid-2">
                <TextInput label="Company" value={draft.name} onChange={(v) => set('name', v)} required />
                <TextInput label="Role" value={draft.role ?? ''} onChange={(v) => set('role', v)} placeholder="e.g. Global Customer Experience Lead" />
              </div>
              <TextInput label="Job posting" type="url" optional value={draft.job_url ?? ''} onChange={(v) => set('job_url', v)} placeholder="https://…" />
              <TextArea label="Job description" value={draft.job_description ?? ''} onChange={(v) => set('job_description', v)} rows={14} hint="The full text. The fit check and the site's copy are based on it." />
            </Section>
          </div>
          <aside className="cms-editor__side">
            <Section title="Status">
              {!pipelineReady && (
                <p className="cms-field__hint">
                  Status tracking needs a one-time database update. Run <code>node scripts/migrate-applications.mjs --apply</code> in
                  {' '}<code>react-portfolio</code>.
                </p>
              )}
              <fieldset disabled={!pipelineReady} className="cms-stack" style={{ border: 0, padding: 0, margin: 0 }}>
                <SelectInput label="Stage" value={app.stage ?? 'building'} onChange={(v) => setApp({ stage: v as CompanyApplication['stage'] })} options={STAGES.map((s) => ({ value: s.id, label: s.label }))} />
                {app.stage === 'closed' && (
                  <SelectInput label="Outcome" value={app.outcome ?? ''} onChange={(v) => setApp({ outcome: (v || null) as CompanyApplication['outcome'] })} options={OUTCOMES} />
                )}
                <NumberInput label="Fit score" min={0} max={100} value={app.fit_score ?? null} onChange={(v) => setApp({ fit_score: v })}
                  hint={app.fit_score == null ? 'From the fit check, 0 to 100.' : app.fit_score < 60 ? 'Below 60: the skill advises not applying.' : app.fit_score >= 75 ? 'A strong fit.' : 'Worth applying, with gaps.'} />
                {app.fit_score != null && (
                  <span className="cms-fit__bar" style={{ width: '100%' }}><span style={{ width: `${app.fit_score}%`, background: fitTone(app.fit_score) }} /></span>
                )}
                <TextInput label="Applied on" type="date" optional value={app.applied_at ?? ''} onChange={(v) => setApp({ applied_at: v || null })} />
                <TextArea label="Notes" optional rows={4} value={app.notes ?? ''} onChange={(v) => setApp({ notes: v || null })} placeholder="Contacts, interview dates, follow-ups" />
              </fieldset>
            </Section>
          </aside>
        </div>
      )}

      {active === 'content' && company && (
        <SiteContent company={company} data={data} navigate={navigate} toast={toast} />
      )}

      {active === 'words' && (
        <div className="cms-stack">
          {!isApp && (
            <Section title="Profile">
              <TextInput label="Name" value={draft.name} onChange={(v) => set('name', v)} required hint="Only you see this name." />
            </Section>
          )}
          <Section title="Hero" description="The first thing a visitor reads.">
            <TextInput label="Title" value={draft.hero_title ?? ''} onChange={(v) => set('hero_title', v)} />
            <TextArea label="Introduction" value={draft.hero_subtitle ?? ''} onChange={(v) => set('hero_subtitle', v)} rows={4} />
            <TextArea label="Tagline" value={draft.tagline ?? ''} onChange={(v) => set('tagline', v)} rows={2} />
            <TagInput label="Badges" values={draft.badges ?? []} onChange={(v) => set('badges', v)} placeholder="e.g. Design systems" />
          </Section>
          <Section title="How you work">
            <TextInput label="Heading" optional value={draft.philosophy_title ?? ''} onChange={(v) => set('philosophy_title', v)} />
            <TextArea label="Text" optional value={draft.philosophy_text ?? ''} onChange={(v) => set('philosophy_text', v)} rows={4} />
            <TextArea label="Longer introduction" optional value={draft.intro_expanded_text ?? ''} onChange={(v) => set('intro_expanded_text', v)} rows={4} hint="Shown when a visitor expands the intro." />
          </Section>
          <Section title="About">
            <TextArea label="Bio" optional value={draft.bio ?? ''} onChange={(v) => set('bio', v)} rows={4} />
            <div className="cms-grid-2">
              <TextInput label="Location" optional value={about.location ?? ''} onChange={(v) => setAbout('location', v)} />
              <TextInput label="Location caption" optional value={about.location_label ?? ''} onChange={(v) => setAbout('location_label', v)} />
              <TextInput label="Languages" optional value={about.languages ?? ''} onChange={(v) => setAbout('languages', v)} />
              <TextInput label="Languages caption" optional value={about.languages_label ?? ''} onChange={(v) => setAbout('languages_label', v)} />
            </div>
            <TextArea label="Fun fact" optional value={about.fun_fact ?? ''} onChange={(v) => setAbout('fun_fact', v)} rows={2} />
            <TextArea label="Research and speaking" optional value={about.speaking_intro ?? ''} onChange={(v) => setAbout('speaking_intro', v)} rows={4} hint="Wrap words in **double asterisks** for bold. A blank line starts a new paragraph." />
          </Section>
          <Disclosure title="Speaking images">
            <SpeakingImagesEditor
              value={about.speaking_images ?? (about.speaking_image ? [about.speaking_image] : [])}
              onChange={(urls) => setDraft((d) => ({ ...d, about_content: { ...(d.about_content ?? {}), speaking_images: urls, speaking_image: urls[0] ?? '' } }))}
            />
          </Disclosure>
          <Disclosure title={`Questions and answers${about.faqs?.length ? ` (${about.faqs.length})` : ''}`}>
            <FaqEditor value={about.faqs ?? []} onChange={(v) => setAbout('faqs', v)} />
          </Disclosure>
          <Section title="Contact">
            <div className="cms-grid-2">
              <TextInput label="Email" type="email" value={links.email ?? ''} onChange={(v) => setLink('email', v)} />
              <TextInput label="LinkedIn" type="url" value={links.linkedin ?? ''} onChange={(v) => setLink('linkedin', v)} />
            </div>
            <TextInput label="CV link" type="url" value={links.resume ?? ''} onChange={(v) => setLink('resume', v)} />
            <div className="cms-grid-2">
              <TextArea label="Projects page subtitle" optional rows={2} value={links.projects_intro ?? ''} onChange={(v) => setLink('projects_intro', v)} />
              <TextArea label="Writing page subtitle" optional rows={2} value={links.blog_intro ?? ''} onChange={(v) => setLink('blog_intro', v)} />
            </div>
          </Section>
        </div>
      )}

      {active === 'site' && (
        <div className="cms-stack">
          <Section title="Address">
            <div className="cms-grid-2">
              <TextInput label="Id" mono value={draft.id} disabled={!isNew} onChange={(v) => set('id', v)} hint={isNew ? 'Lowercase letters, numbers and "-".' : 'Fixed after creation.'} />
              <TextInput label="Link" mono value={draft.slug ?? ''} onChange={(v) => set('slug', v)} hint={isApp ? <>Opens at <code>/c/{draft.slug || draft.id || 'link'}</code></> : <>Profile links use the id: <code>/?profile={draft.id || 'id'}</code></>} />
            </div>
            <div className="cms-grid-2">
              <SelectInput label="Status" value={draft.status ?? 'published'} onChange={(v) => set('status', v)} options={STATUSES} />
              <SelectInput label="Layout" value={draft.layout ?? 'default'} onChange={(v) => set('layout', v)} options={LAYOUTS}
                hint={isApp ? 'Hand-built company sites ignore this.' : undefined} />
            </div>
            {(!isApp || initial.is_active) && (
              <Switch
                label="Show on the public site"
                description="The public site shows the first profile with this on. Others open only through a ?profile= link."
                checked={!!draft.is_active}
                onChange={(v) => set('is_active', v)}
              />
            )}
          </Section>
          <Section title="Search and sharing">
            <TextInput label="Page title" optional value={seo.title ?? ''} onChange={(v) => setSeo('title', v)} />
            <TextArea label="Description" optional rows={2} value={seo.description ?? ''} onChange={(v) => setSeo('description', v)} />
          </Section>
          <Disclosure title="Theme (JSON)">
            <TextArea label="Theme settings" mono rows={8} value={themeText} onChange={setThemeText} error={jsonError}
              hint="Colours and tokens the site reads, e.g. accent, paper, ink." />
          </Disclosure>
          <Disclosure title={isApp ? 'Classification' : 'Classification'}>
            <p className="cms-field__hint">
              {isApp ? 'This is a job application. Move it to the main site if it is really a general profile.' : 'This is a main site profile. Move it to Applications if it was made for a specific job.'}
            </p>
            <div>
              <button type="button" className="cms-btn cms-btn--sm" disabled={!pipelineReady}
                onClick={() => setApp({ kind: isApp ? 'persona' : 'application', stage: isApp ? undefined : (app.stage ?? 'researching') })}>
                {isApp ? 'Move to main site' : 'Move to applications'}
              </button>
            </div>
          </Disclosure>
          {!isNew && (
            <div>
              <button type="button" className="cms-btn cms-btn--ghost cms-btn--danger-quiet" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={14} /> Delete {isApp ? 'application' : 'profile'}
              </button>
            </div>
          )}
        </div>
      )}

      {active !== 'content' && (
        <SaveBar dirty={dirty || isNew} saving={saving} onSave={save} onCancel={() => navigate(backHref)} saveLabel={isNew ? 'Create' : 'Save changes'} />
      )}

      {confirmDelete && (
        <ConfirmDialog title={`Delete ${draft.name}?`} confirmLabel="Delete" danger onConfirm={remove} onCancel={() => setConfirmDelete(false)}>
          <p>The site and its links are removed. Library entries stay as they are.</p>
        </ConfirmDialog>
      )}
    </>
  );
}

/* ─── Projects shown on one site ────────────────────────────────────────── */

function linkOf(e: WarehouseEntry, companyId: string): CompanyLink | undefined {
  return (e.company_links ?? []).find((l) => l.company_id === companyId);
}

function SiteContent({ company, data, navigate, toast }: {
  company: Company;
  data: StudioData;
  navigate: (href: string, opts?: { force?: boolean }) => void;
  toast: Toast;
}) {
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  const linked = data.entries
    .filter((e) => linkOf(e, company.id))
    .sort((a, b) => (linkOf(a, company.id)!.sort_order ?? 0) - (linkOf(b, company.id)!.sort_order ?? 0));

  // Saves one entry with this site's link changed (or removed), keeping every
  // other site's link and override untouched.
  const saveLinks = async (e: WarehouseEntry, next: CompanyLink | null) => {
    const others = (e.company_links ?? []).filter((l) => l.company_id !== company.id);
    const saved = await upsertWarehouseEntry({
      id: e.id, type: e.type, title: e.title, content: e.content, metadata: e.metadata, tags: e.tags,
      is_hidden: e.is_hidden, sort_order: e.sort_order, asset_ids: e.asset_ids,
      company_links: next ? [...others, next] : others,
    });
    data.putEntry(saved);
  };

  const run = async (fn: () => Promise<void>, ok?: string) => {
    setBusy(true);
    try {
      await fn();
      if (ok) toast(ok, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error');
    } finally {
      setBusy(false);
    }
  };

  const move = (i: number, dir: -1 | 1) => run(async () => {
    const order = [...linked];
    const j = i + dir;
    [order[i], order[j]] = [order[j], order[i]];
    for (const [idx, e] of order.entries()) {
      const l = linkOf(e, company.id)!;
      if (l.sort_order !== idx) await saveLinks(e, { ...l, sort_order: idx });
    }
  });

  const setVisible = (e: WarehouseEntry, v: boolean) => run(() => saveLinks(e, { ...linkOf(e, company.id)!, is_visible: v }));
  const unlink = (e: WarehouseEntry) => run(() => saveLinks(e, null), `Removed "${e.title}" from ${company.name}`);
  const add = (picked: WarehouseEntry[]) => run(async () => {
    let order = linked.length;
    for (const e of picked) {
      await saveLinks(e, { company_id: company.id, sort_order: order++, is_visible: true, override_content: null, override_metadata: null });
    }
  }, picked.length ? `Added ${picked.length} to ${company.name}` : undefined);

  return (
    <div className="cms-stack">
      <div className="cms-row cms-row--between">
        <p className="cms-field__hint">In the order the site shows them. Changes here save straight away.</p>
        <button type="button" className="cms-btn cms-btn--primary" onClick={() => setAdding(true)} disabled={busy}><Plus size={15} /> Add from Library</button>
      </div>
      {linked.length === 0 ? (
        <EmptyState icon={<Database size={22} />} title="Nothing on this site yet" action={<button type="button" className="cms-btn" onClick={() => setAdding(true)}><Plus size={14} /> Add from Library</button>} />
      ) : (
        <ul className="cms-rows" aria-busy={busy}>
          {linked.map((e, i) => {
            const l = linkOf(e, company.id)!;
            const t = typeOf(e.type);
            return (
              <li key={e.id} className="cms-rowitem">
                {t.imageKey ? <Thumb src={String(e.metadata?.[t.imageKey] ?? '')} /> : <span className="cms-thumb"><t.icon size={16} aria-hidden="true" /></span>}
                <button type="button" className="cms-rowitem__main" onClick={() => navigate(hrefFor('library', e.id))}>
                  <span className="cms-rowitem__title">
                    <span>{e.title}</span>
                    {l.override_metadata && <Pill tone="violet" plain>Custom story</Pill>}
                    {(e.is_hidden || !l.is_visible) && <Pill tone="amber" plain>Hidden</Pill>}
                  </span>
                  <span className="cms-rowitem__meta">{t.label}{e.is_hidden && <><span className="cms-dotsep" />hidden everywhere in the Library</>}</span>
                </button>
                <div className="cms-rowitem__actions">
                  <Switch hideLabel label={`Show ${e.title} on ${company.name}`} checked={l.is_visible} onChange={(v) => setVisible(e, v)} />
                  <button type="button" className="cms-icon-btn" disabled={busy || i === 0} onClick={() => move(i, -1)} aria-label={`Move ${e.title} up`}><ChevronUp size={15} /></button>
                  <button type="button" className="cms-icon-btn" disabled={busy || i === linked.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${e.title} down`}><ChevronDown size={15} /></button>
                  <button type="button" className="cms-icon-btn cms-icon-btn--danger" disabled={busy} onClick={() => unlink(e)} aria-label={`Remove ${e.title} from this site`}><X size={15} /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {adding && (
        <AddFromLibrary
          entries={data.entries.filter((e) => !linkOf(e, company.id))}
          onClose={() => setAdding(false)}
          onAdd={(picked) => { setAdding(false); void add(picked); }}
        />
      )}
    </div>
  );
}

function AddFromLibrary({ entries, onClose, onAdd }: {
  entries: WarehouseEntry[];
  onClose: () => void;
  onAdd: (picked: WarehouseEntry[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const term = search.trim().toLowerCase();
  const visible = entries
    .filter((e) => !term || `${e.title} ${e.type} ${e.id}`.toLowerCase().includes(term))
    .sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title));

  return (
    <Modal
      title="Add from the Library"
      onClose={onClose}
      footer={
        <>
          <span className="cms-field__hint">{picked.size ? `${picked.size} selected` : 'Select entries to show on this site'}</span>
          <div className="cms-row">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="cms-btn cms-btn--primary" disabled={!picked.size} onClick={() => onAdd(entries.filter((e) => picked.has(e.id)))}>Add {picked.size || ''}</button>
          </div>
        </>
      }
    >
      <div className="cms-toolbar">
        <div className="cms-search">
          <Search size={15} aria-hidden="true" />
          <input className="cms-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the Library" aria-label="Search the Library" data-autofocus />
        </div>
      </div>
      {visible.length === 0 ? <p className="cms-field__hint">Nothing left to add.</p> : (
        <ul className="cms-rows">
          {visible.map((e) => {
            const t = typeOf(e.type);
            return (
              <li key={e.id} className="cms-rowitem">
                <label className="cms-checkbox" style={{ flex: 1, minWidth: 0 }}>
                  <input type="checkbox" checked={picked.has(e.id)} onChange={(ev) => setPicked((cur) => {
                    const n = new Set(cur);
                    if (ev.target.checked) n.add(e.id); else n.delete(e.id);
                    return n;
                  })} />
                  {t.imageKey ? <Thumb src={String(e.metadata?.[t.imageKey] ?? '')} /> : <span className="cms-thumb"><t.icon size={16} aria-hidden="true" /></span>}
                  <span className="cms-stack" style={{ gap: 2, minWidth: 0 }}>
                    <strong style={{ fontSize: 14 }}>{e.title}</strong>
                    <span className="cms-field__hint">{t.label}{e.is_hidden ? ' · hidden' : ''}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
