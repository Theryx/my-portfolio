import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Search, List, LayoutGrid } from 'lucide-react';
import {
  getWarehouseEntries,
  upsertWarehouseEntry,
  updateWarehouseEntry,
  deleteWarehouseEntry,
  getCompanies,
  getAssets,
  type WarehouseEntry,
  type Company,
  type Asset,
  type CompanyLink,
} from '../../lib/api';
import { ArrayEditor } from './fields';

const ENTRY_TYPES = [
  'bio', 'experience', 'skill', 'education', 'project', 'testimonial',
  'note', 'article', 'research', 'contact', 'custom',
];

type Toast = (message: string, type: 'success' | 'error') => void;
const ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;

// Draft row for the per-company link editor.
interface LinkDraft {
  company_id: string;
  linked: boolean;
  sort_order: number;
  is_visible: boolean;
  override_content: string;
  override_metadata: Record<string, unknown> | null;
}

function emptyEntry(): WarehouseEntry {
  return {
    id: '', type: 'note', title: '', content: '', metadata: {},
    tags: [], is_hidden: false, sort_order: 0, company_ids: [], asset_ids: [],
  };
}

/**
 * Warehouse manager: the single source of truth for everything "about me".
 * Self-contained (fetches its own data) so Admin.tsx only needs to render it.
 */
export default function WarehousePanel({ addToast }: { addToast: Toast }) {
  const [entries, setEntries] = useState<WarehouseEntry[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [editing, setEditing] = useState<WarehouseEntry | null>(null);
  const [metaText, setMetaText] = useState('{}');
  const [linkDrafts, setLinkDrafts] = useState<LinkDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WarehouseEntry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [e, c, a] = await Promise.all([
        getWarehouseEntries({ include_hidden: true }),
        getCompanies(),
        getAssets(),
      ]);
      setEntries(e);
      setCompanies(c);
      setAssets(a);
    } catch {
      addToast('Failed to load the warehouse', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: entries.length };
    for (const e of entries) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, [entries]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (term && !`${e.title} ${e.id}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [entries, typeFilter, search]);

  const buildLinkDrafts = useCallback((entry: WarehouseEntry): LinkDraft[] => {
    const byCompany = new Map((entry.company_links ?? []).map((l) => [l.company_id, l]));
    const ids = entry.company_ids ?? [];
    return companies.map((c) => {
      const link = byCompany.get(c.id);
      return {
        company_id: c.id,
        linked: ids.includes(c.id) || !!link,
        sort_order: link?.sort_order ?? 0,
        is_visible: link?.is_visible ?? true,
        override_content: link?.override_content ?? '',
        override_metadata: link?.override_metadata ?? null,
      };
    });
  }, [companies]);

  const startNew = () => {
    setEditing(emptyEntry());
    setMetaText('{}');
    setLinkDrafts(buildLinkDrafts(emptyEntry()));
  };

  const startEdit = (e: WarehouseEntry) => {
    setEditing({ ...e, company_ids: [...(e.company_ids ?? [])], tags: [...(e.tags ?? [])] });
    setMetaText(JSON.stringify(e.metadata ?? {}, null, 2));
    setLinkDrafts(buildLinkDrafts(e));
  };

  const setLink = (companyId: string, patch: Partial<LinkDraft>) => {
    setLinkDrafts((list) => list.map((l) => (l.company_id === companyId ? { ...l, ...patch } : l)));
  };

  const toggleAsset = (assetId: string) => {
    setEditing((cur) => {
      if (!cur) return cur;
      const ids = cur.asset_ids ?? [];
      const next = ids.includes(assetId) ? ids.filter((x) => x !== assetId) : [...ids, assetId];
      return { ...cur, asset_ids: next };
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!ID_RE.test(editing.id)) {
      addToast('Id may only contain letters, numbers, "-" and "_"', 'error');
      return;
    }
    if (!editing.title.trim()) {
      addToast('Title is required', 'error');
      return;
    }
    let metadata: Record<string, unknown> = {};
    try {
      metadata = metaText.trim() ? JSON.parse(metaText) : {};
    } catch {
      addToast('Metadata is not valid JSON', 'error');
      return;
    }
    const company_links: CompanyLink[] = linkDrafts
      .filter((l) => l.linked)
      .map((l) => ({
        company_id: l.company_id,
        sort_order: l.sort_order,
        is_visible: l.is_visible,
        override_content: l.override_content.trim() ? l.override_content : null,
        override_metadata: l.override_metadata,
      }));
    setSaving(true);
    try {
      await upsertWarehouseEntry({ ...editing, metadata, company_links });
      addToast('Entry saved', 'success');
      setEditing(null);
      await load();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleHidden = async (e: WarehouseEntry) => {
    try {
      const saved = await updateWarehouseEntry(e.id, { is_hidden: !e.is_hidden });
      setEntries((list) => list.map((x) => (x.id === saved.id ? { ...x, is_hidden: saved.is_hidden } : x)));
      addToast(e.is_hidden ? 'Now visible' : 'Hidden', 'success');
    } catch {
      addToast('Failed to update visibility', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteWarehouseEntry(deleteTarget.id);
      addToast('Entry deleted', 'success');
      setEntries((list) => list.filter((x) => x.id !== deleteTarget.id));
    } catch {
      addToast('Delete failed', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (editing) {
    const exists = entries.some((e) => e.id === editing.id);
    const selectedAssets = new Set(editing.asset_ids ?? []);
    return (
      <section aria-label="Warehouse entry editor">
        <div className="cms-list-header">
          <h2 style={{ margin: 0 }}>{exists ? 'Edit entry' : 'New entry'}</h2>
          <button className="cms-btn cms-btn--ghost" onClick={() => setEditing(null)} disabled={saving}>
            <X size={15} /> Cancel
          </button>
        </div>
        <div className="cms-editor">
          <fieldset className="cms-form__section">
            <legend>Basics</legend>
            <div className="cms-form__grid">
              <div className="cms-field">
                <label>Id</label>
                <input
                  value={editing.id}
                  onChange={(ev) => setEditing({ ...editing, id: ev.target.value })}
                  placeholder="e.g. experience-paysika"
                  disabled={exists}
                />
              </div>
              <div className="cms-field">
                <label>Type</label>
                <select value={editing.type} onChange={(ev) => setEditing({ ...editing, type: ev.target.value })}>
                  {ENTRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="cms-field">
              <label>Title</label>
              <input value={editing.title} onChange={(ev) => setEditing({ ...editing, title: ev.target.value })} />
            </div>
            <div className="cms-field">
              <label>Content (markdown)</label>
              <textarea rows={10} value={editing.content} onChange={(ev) => setEditing({ ...editing, content: ev.target.value })} />
            </div>
            <ArrayEditor label="Tags" values={editing.tags ?? []} onChange={(tags) => setEditing({ ...editing, tags })} />
          </fieldset>

          <fieldset className="cms-form__section">
            <legend>Companies</legend>
            <p className="cms-field__hint">Link this entry to one or more microsites, with per-company ordering and visibility.</p>
            {companies.length === 0 ? (
              <p className="cms-field__hint">No companies yet. Create one in the Companies section.</p>
            ) : (
              <div className="cms-links">
                {linkDrafts.map((l) => {
                  const company = companies.find((c) => c.id === l.company_id);
                  return (
                    <div key={l.company_id} className={`cms-link-row ${l.linked ? 'cms-link-row--on' : ''}`}>
                      <label className="cms-link-row__main">
                        <input
                          type="checkbox"
                          checked={l.linked}
                          onChange={(ev) => setLink(l.company_id, { linked: ev.target.checked })}
                        />
                        <span className="cms-link-row__name">{company?.name || l.company_id}</span>
                      </label>
                      {l.linked && (
                        <div className="cms-link-row__opts">
                          <label title="Order within the company">
                            #
                            <input
                              type="number"
                              value={l.sort_order}
                              onChange={(ev) => setLink(l.company_id, { sort_order: Number(ev.target.value) || 0 })}
                            />
                          </label>
                          <label title="Visible on this company">
                            <input
                              type="checkbox"
                              checked={l.is_visible}
                              onChange={(ev) => setLink(l.company_id, { is_visible: ev.target.checked })}
                            />
                            Visible
                          </label>
                        </div>
                      )}
                      {l.linked && (
                        <details className="cms-link-row__override">
                          <summary>Content override</summary>
                          <textarea
                            rows={4}
                            value={l.override_content}
                            placeholder="Leave empty to use the entry's content as-is."
                            onChange={(ev) => setLink(l.company_id, { override_content: ev.target.value })}
                          />
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </fieldset>

          <fieldset className="cms-form__section">
            <legend>Assets</legend>
            <p className="cms-field__hint">Attach files from the asset library to this entry.</p>
            {assets.length === 0 ? (
              <p className="cms-field__hint">No assets yet. Upload some in the Assets section.</p>
            ) : (
              <div className="cms-asset-picker">
                {assets.map((a) => (
                  <label key={a.id} className={`cms-asset-chip ${selectedAssets.has(a.id) ? 'cms-asset-chip--on' : ''}`}>
                    <input type="checkbox" checked={selectedAssets.has(a.id)} onChange={() => toggleAsset(a.id)} />
                    <span>{a.filename}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset className="cms-form__section">
            <legend>Metadata & ordering</legend>
            <div className="cms-field">
              <label>Metadata (JSON)</label>
              <textarea rows={6} value={metaText} onChange={(ev) => setMetaText(ev.target.value)} spellCheck={false} style={{ fontFamily: 'monospace' }} />
              <p className="cms-field__hint">Structured fields (tag, role, impact, content_blocks…) for project and article entries.</p>
            </div>
            <div className="cms-field__row" style={{ alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={editing.is_hidden} onChange={(ev) => setEditing({ ...editing, is_hidden: ev.target.checked })} />
                Hidden
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Sort order
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(ev) => setEditing({ ...editing, sort_order: Number(ev.target.value) })}
                  style={{ width: 90 }}
                />
              </label>
            </div>
          </fieldset>

          <div className="cms-form__actions">
            <button className="cms-btn cms-btn--primary" onClick={save} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save entry'}
            </button>
            <button className="cms-btn cms-btn--ghost" onClick={() => setEditing(null)} disabled={saving}>
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Warehouse">
      <div className="cms-list-header">
        <div className="cms-list-header__filters">
          <div className="cms-search">
            <Search size={15} aria-hidden="true" />
            <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search warehouse" />
          </div>
        </div>
        <div className="cms-view-toggle" role="group" aria-label="View mode">
          <button className={`cms-icon-btn ${view === 'list' ? 'cms-icon-btn--active' : ''}`} onClick={() => setView('list')} aria-label="List view" aria-pressed={view === 'list'}><List size={16} /></button>
          <button className={`cms-icon-btn ${view === 'grid' ? 'cms-icon-btn--active' : ''}`} onClick={() => setView('grid')} aria-label="Grid view" aria-pressed={view === 'grid'}><LayoutGrid size={16} /></button>
        </div>
        <button className="cms-btn cms-btn--primary" onClick={startNew}>
          <Plus size={15} /> New entry
        </button>
      </div>

      <div className="cms-tabs" role="tablist" aria-label="Entry types">
        <button
          role="tab"
          aria-selected={typeFilter === 'all'}
          className={`cms-tab ${typeFilter === 'all' ? 'cms-tab--active' : ''}`}
          onClick={() => setTypeFilter('all')}
        >
          All <span className="cms-tab__count">{counts.all ?? 0}</span>
        </button>
        {ENTRY_TYPES.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={typeFilter === t}
            className={`cms-tab ${typeFilter === t ? 'cms-tab--active' : ''}`}
            onClick={() => setTypeFilter(t)}
          >
            {t} <span className="cms-tab__count">{counts[t] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="cms-empty">Loading warehouse…</div>
      ) : visible.length === 0 ? (
        <div className="cms-empty">No entries match.</div>
      ) : view === 'grid' ? (
        <div className="cms-warehouse-grid">
          {visible.map((e) => (
            <article key={e.id} className="cms-warehouse-card">
              <div className="cms-warehouse-card__top">
                <span className="cms-badge cms-badge--muted">{e.type}</span>
                {e.is_hidden && <span className="cms-badge cms-badge--muted">Hidden</span>}
              </div>
              <h3 className="cms-warehouse-card__title">{e.title}</h3>
              <p className="cms-warehouse-card__meta"><code>{e.id}</code></p>
              <p className="cms-warehouse-card__companies">
                {(e.company_ids ?? []).map((cid) => companies.find((c) => c.id === cid)?.name ?? cid).join(', ') || 'no company'}
              </p>
              <div className="cms-company-card__actions">
                <button className="cms-icon-btn" onClick={() => startEdit(e)} aria-label={`Edit ${e.title}`} title="Edit"><Pencil size={15} /></button>
                <button className="cms-icon-btn" onClick={() => toggleHidden(e)} aria-label={e.is_hidden ? 'Show' : 'Hide'} title={e.is_hidden ? 'Show' : 'Hide'}>
                  {e.is_hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setDeleteTarget(e)} aria-label={`Delete ${e.title}`} title="Delete"><Trash2 size={15} /></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ul className="cms-list">
          {visible.map((e) => (
            <li key={e.id} className="cms-item">
              <div className="cms-item__body">
                <div className="cms-item__title">
                  {e.title}
                  <span className="cms-badge cms-badge--muted">{e.type}</span>
                  {e.is_hidden && <span className="cms-badge cms-badge--muted">Hidden</span>}
                </div>
                <div className="cms-item__meta">
                  <code>{e.id}</code>
                  {' · '}
                  {(e.company_ids ?? []).map((cid) => companies.find((c) => c.id === cid)?.name ?? cid).join(', ') || 'no company'}
                </div>
              </div>
              <div className="cms-item__actions">
                <button className="cms-icon-btn" onClick={() => startEdit(e)} aria-label={`Edit ${e.title}`} title="Edit">
                  <Pencil size={15} />
                </button>
                <button className="cms-icon-btn" onClick={() => toggleHidden(e)} aria-label={e.is_hidden ? 'Show' : 'Hide'} title={e.is_hidden ? 'Show' : 'Hide'}>
                  {e.is_hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setDeleteTarget(e)} aria-label={`Delete ${e.title}`} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleteTarget && (
        <div
          className="cms-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="cms-wh-delete-title"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="cms-dialog">
            <h2 id="cms-wh-delete-title">Delete entry?</h2>
            <p>"{deleteTarget.title}" will be permanently deleted. This cannot be undone.</p>
            <div className="cms-form__actions">
              <button className="cms-btn" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="cms-btn cms-btn--danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
