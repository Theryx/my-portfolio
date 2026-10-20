import { useMemo, useState } from 'react';
import { Plus, Search, Eye, EyeOff, Trash2, Library as LibraryIcon, Sparkles } from 'lucide-react';
import { updateWarehouseEntry, deleteWarehouseEntry, type WarehouseEntry } from '../../lib/api';
import { PageHead, Pill, Thumb, EmptyState } from './ui';
import { ConfirmDialog, Modal } from './dialogs';
import EntryEditor from './EntryEditor';
import { ENTRY_TYPES, typeOf, relativeDate } from './entryTypes';
import { isApplication, type StudioData, type Toast } from './data';
import { hrefFor, type Route } from './route';

type Sort = 'updated' | 'title' | 'type';

/* The Library: every fact about you (projects, experience, skills, writing),
   in one place. Sites and the tailored-portfolio skill read from here. */
export default function LibraryPanel({ data, route, navigate, toast }: {
  data: StudioData;
  route: Route;
  navigate: (href: string, opts?: { force?: boolean }) => void;
  toast: Toast;
}) {
  const { entries, companies, loading } = data;

  if (route.id) {
    const isNew = route.id === 'new';
    const entry = isNew ? null : entries.find((e) => e.id === route.id) ?? null;
    if (!isNew && !entry) {
      return loading ? <p className="cms-field__hint">Loading…</p> : (
        <EmptyState title="Entry not found" action={<a className="cms-btn" href={hrefFor('library')}>Back to the Library</a>}>
          It may have been deleted.
        </EmptyState>
      );
    }
    return (
      <EntryEditor
        key={route.id}
        entry={entry}
        newType={route.query.get('type') ?? undefined}
        companies={companies}
        toast={toast}
        onBack={() => navigate(hrefFor('library', undefined, undefined, typeQuery(route)))}
        onSaved={(saved, wasNew) => {
          data.putEntry(saved);
          if (wasNew) navigate(hrefFor('library', saved.id), { force: true });
        }}
        onDeleted={(id) => { data.dropEntry(id); navigate(hrefFor('library'), { force: true }); }}
      />
    );
  }

  return <LibraryList data={data} route={route} navigate={navigate} toast={toast} />;
}

function typeQuery(route: Route): Record<string, string> | undefined {
  const t = route.query.get('type');
  return t ? { type: t } : undefined;
}

function LibraryList({ data, route, navigate, toast }: {
  data: StudioData;
  route: Route;
  navigate: (href: string, opts?: { force?: boolean }) => void;
  toast: Toast;
}) {
  const { entries, companies, loading } = data;
  const typeFilter = route.query.get('type') ?? 'all';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('updated');
  const [choosing, setChoosing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WarehouseEntry | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of entries) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, [entries]);

  const companyName = useMemo(() => new Map(companies.map((c) => [c.id, c.name])), [companies]);
  const appIds = useMemo(() => new Set(companies.filter(isApplication).map((c) => c.id)), [companies]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = entries.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (!term) return true;
      return `${e.title} ${e.id} ${(e.tags ?? []).join(' ')} ${String(e.metadata?.tagline ?? '')}`.toLowerCase().includes(term);
    });
    return list.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'type') return a.type.localeCompare(b.type) || a.title.localeCompare(b.title);
      return String(b.updated_at ?? '').localeCompare(String(a.updated_at ?? ''));
    });
  }, [entries, typeFilter, search, sort]);

  const missing = ENTRY_TYPES.filter((t) => t.core && !counts[t.type]);
  const presentTypes = ENTRY_TYPES.filter((t) => counts[t.type]);

  const toggleHidden = async (e: WarehouseEntry) => {
    try {
      const saved = await updateWarehouseEntry(e.id, { is_hidden: !e.is_hidden });
      data.putEntry({ ...e, ...saved });
      toast(e.is_hidden ? `"${e.title}" is visible again` : `"${e.title}" is hidden`, 'success');
    } catch {
      toast('Could not change visibility', 'error');
    }
  };

  const remove = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    if (!target) return;
    try {
      await deleteWarehouseEntry(target.id);
      data.dropEntry(target.id);
      toast('Entry deleted', 'success');
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const setType = (t: string) => navigate(hrefFor('library', undefined, undefined, t === 'all' ? undefined : { type: t }));
  const newOf = (type: string) => navigate(hrefFor('library', 'new', undefined, { type }));

  return (
    <>
      <PageHead
        title="Library"
        sub="Everything about your work, in one place. Every portfolio site and the tailored-portfolio skill read from here."
        actions={<button type="button" className="cms-btn cms-btn--primary" onClick={() => setChoosing(true)}><Plus size={15} /> New entry</button>}
      />

      {!loading && missing.length > 0 && (
        <div className="cms-callout" style={{ marginBottom: 16 }}>
          <Sparkles size={16} aria-hidden="true" />
          <div className="cms-stack" style={{ gap: 8 }}>
            <span>
              The AI judges your fit for a job from this Library. It has no{' '}
              {missing.map((t) => t.plural.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' or $1')} yet.
            </span>
            <div className="cms-row">
              {missing.map((t) => (
                <button key={t.type} type="button" className="cms-btn cms-btn--sm" onClick={() => newOf(t.type)}>
                  <Plus size={13} /> Add {t.label.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="cms-toolbar">
        <div className="cms-search">
          <Search size={15} aria-hidden="true" />
          <input className="cms-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search titles, ids and tags" aria-label="Search the Library" />
        </div>
        <span className="cms-toolbar__spacer" />
        <label className="cms-visually-hidden" htmlFor="lib-sort">Sort by</label>
        <select id="lib-sort" className="cms-select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="updated">Recently updated</option>
          <option value="title">Title</option>
          <option value="type">Type</option>
        </select>
      </div>

      <div className="cms-segmented" role="tablist" aria-label="Entry type" style={{ marginBottom: 14 }}>
        <button type="button" role="tab" aria-selected={typeFilter === 'all'} onClick={() => setType('all')}>
          All <span className="cms-segmented__count">{entries.length}</span>
        </button>
        {presentTypes.map((t) => (
          <button key={t.type} type="button" role="tab" aria-selected={typeFilter === t.type} onClick={() => setType(t.type)}>
            {t.plural} <span className="cms-segmented__count">{counts[t.type]}</span>
          </button>
        ))}
      </div>

      {loading && entries.length === 0 ? (
        <p className="cms-field__hint">Loading the Library…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<LibraryIcon size={22} />}
          title={search ? 'Nothing matches that search' : 'Nothing here yet'}
          action={typeFilter !== 'all' ? <button type="button" className="cms-btn" onClick={() => newOf(typeFilter)}><Plus size={14} /> Add {typeOf(typeFilter).label.toLowerCase()}</button> : undefined}
        />
      ) : (
        <ul className="cms-rows">
          {visible.map((e) => {
            const t = typeOf(e.type);
            const sites = (e.company_ids ?? []);
            const apps = sites.filter((id) => appIds.has(id)).length;
            const image = t.imageKey ? String(e.metadata?.[t.imageKey] ?? '') : '';
            return (
              <li key={e.id} className="cms-rowitem">
                {t.imageKey ? <Thumb src={image} /> : <span className="cms-thumb"><t.icon size={16} aria-hidden="true" /></span>}
                <button type="button" className="cms-rowitem__main" onClick={() => navigate(hrefFor('library', e.id, undefined, typeQuery(route)))}>
                  <span className="cms-rowitem__title">
                    <span>{e.title || 'Untitled'}</span>
                    {e.is_hidden && <Pill tone="amber" plain>Hidden</Pill>}
                  </span>
                  <span className="cms-rowitem__meta">
                    <span>{t.label}</span>
                    <span className="cms-dotsep" />
                    <span title={sites.map((id) => companyName.get(id) ?? id).join(', ')}>
                      {sites.length === 0 ? 'Not on any site' : `${sites.length} site${sites.length === 1 ? '' : 's'}${apps ? ` (${apps} application${apps === 1 ? '' : 's'})` : ''}`}
                    </span>
                    {e.updated_at && <><span className="cms-dotsep" /><span>Updated {relativeDate(e.updated_at)}</span></>}
                  </span>
                </button>
                <div className="cms-rowitem__actions">
                  <button type="button" className="cms-icon-btn" onClick={() => toggleHidden(e)} aria-label={e.is_hidden ? `Show ${e.title}` : `Hide ${e.title}`} title={e.is_hidden ? 'Show everywhere' : 'Hide everywhere'}>
                    {e.is_hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button type="button" className="cms-icon-btn cms-icon-btn--danger cms-hide-sm" onClick={() => setDeleteTarget(e)} aria-label={`Delete ${e.title}`} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {choosing && (
        <Modal title="What are you adding?" narrow onClose={() => setChoosing(false)}>
          <ul className="cms-rows">
            {ENTRY_TYPES.map((t) => (
              <li key={t.type} className="cms-rowitem">
                <span className="cms-thumb"><t.icon size={16} aria-hidden="true" /></span>
                <button type="button" className="cms-rowitem__main" onClick={() => { setChoosing(false); newOf(t.type); }}>
                  <span className="cms-rowitem__title"><span>{t.label}</span>{t.core && !counts[t.type] && <Pill tone="amber" plain>Missing</Pill>}</span>
                  <span className="cms-rowitem__meta">{t.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Delete this entry?" confirmLabel="Delete" danger onConfirm={remove} onCancel={() => setDeleteTarget(null)}>
          <p>"{deleteTarget.title}" is removed from the Library and from every site that shows it. This cannot be undone.</p>
        </ConfirmDialog>
      )}
    </>
  );
}
