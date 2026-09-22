import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import {
  getWarehouseEntries,
  upsertWarehouseEntry,
  deleteWarehouseEntry,
  getAllProfiles,
  type WarehouseEntry,
  type Profile,
  type CompanyLink,
} from '../../lib/api';
import { ArrayEditor } from './fields';

const ENTRY_TYPES = [
  'bio', 'experience', 'skill', 'education', 'project', 'testimonial',
  'note', 'article', 'research', 'contact', 'custom',
];

type Toast = (message: string, type: 'success' | 'error') => void;
const ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;

function emptyEntry(): WarehouseEntry {
  return {
    id: '', type: 'note', title: '', content: '', metadata: {},
    tags: [], is_hidden: false, sort_order: 0, company_ids: [], company_links: [],
  };
}

// Normalise links whether the API returned rich links or just company_ids.
function linksOf(e: WarehouseEntry): CompanyLink[] {
  if (Array.isArray(e.company_links) && e.company_links.length) {
    return e.company_links.map((l) => ({ ...l }));
  }
  return (e.company_ids ?? []).map((cid, i) => ({
    company_id: cid,
    sort_order: i,
    is_visible: true,
    override_content: null,
    override_metadata: null,
  }));
}

/** Per-company links: order, visibility and a company-only content rewrite. */
function CompanyLinksEditor({ links, companies, onChange }: {
  links: CompanyLink[];
  companies: Profile[];
  onChange: (links: CompanyLink[]) => void;
}) {
  const [pick, setPick] = useState('');
  const available = companies.filter((c) => !links.some((l) => l.company_id === c.id));

  const update = (i: number, patch: Partial<CompanyLink>) =>
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((l, idx) => ({ ...l, sort_order: idx })));
  };
  const add = (id: string) => {
    if (!id || links.some((l) => l.company_id === id)) return;
    onChange([...links, {
      company_id: id, sort_order: links.length, is_visible: true,
      override_content: null, override_metadata: null,
    }]);
    setPick('');
  };

  return (
    <div className="cms-field">
      <label>Companies</label>
      <p className="cms-field__hint">
        Which company microsites show this entry. Reorder, hide, or rewrite the
        content for one company only (the override wins just for that company).
      </p>
      {links.length === 0 && <p className="cms-field__hint">Not shown on any company yet.</p>}
      {links.map((l, i) => {
        const name = companies.find((c) => c.id === l.company_id)?.name ?? l.company_id;
        return (
          <div
            key={l.company_id}
            style={{
              border: '1px solid var(--cms-border, #33333a)', borderRadius: 8,
              padding: 12, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <strong style={{ flex: 1, minWidth: 120 }}>{name}</strong>
              <button type="button" className="cms-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${name} up`}>
                <ArrowUp size={14} />
              </button>
              <button type="button" className="cms-icon-btn" onClick={() => move(i, 1)} disabled={i === links.length - 1} aria-label={`Move ${name} down`}>
                <ArrowDown size={14} />
              </button>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={l.is_visible}
                  onChange={(ev) => update(i, { is_visible: ev.target.checked })}
                />
                Visible
              </label>
              <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => remove(i)} aria-label={`Remove ${name}`} title="Remove">
                <X size={15} />
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Optional: rewrite this entry's content for this company only"
              value={l.override_content ?? ''}
              onChange={(ev) => update(i, { override_content: ev.target.value || null })}
            />
          </div>
        );
      })}
      {available.length > 0 && (
        <div className="cms-field__row">
          <select value={pick} onChange={(ev) => add(ev.target.value)} aria-label="Add a company">
            <option value="">Add a company…</option>
            {available.map((c) => <option key={c.id} value={c.id}>{c.name || c.id}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

/**
 * Warehouse manager: the single source of truth for everything "about me".
 * Self-contained (fetches its own data) so Admin.tsx only needs to render it.
 */
export default function WarehousePanel({ addToast }: { addToast: Toast }) {
  const [entries, setEntries] = useState<WarehouseEntry[]>([]);
  const [companies, setCompanies] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<WarehouseEntry | null>(null);
  const [metaText, setMetaText] = useState('{}');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [e, c] = await Promise.all([
        getWarehouseEntries({ include_hidden: true }),
        getAllProfiles(),
      ]);
      setEntries(e);
      setCompanies(c);
    } catch {
      addToast('Failed to load the warehouse', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (term && !`${e.title} ${e.id}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [entries, typeFilter, search]);

  const startNew = () => {
    setEditing(emptyEntry());
    setMetaText('{}');
  };

  const startEdit = (e: WarehouseEntry) => {
    setEditing({ ...e, company_links: linksOf(e), tags: [...(e.tags ?? [])] });
    setMetaText(JSON.stringify(e.metadata ?? {}, null, 2));
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
    setSaving(true);
    try {
      const payload: WarehouseEntry = {
        ...editing,
        metadata,
        company_links: editing.company_links ?? [],
      };
      delete payload.company_ids;
      await upsertWarehouseEntry(payload);
      addToast('Entry saved', 'success');
      setEditing(null);
      await load();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (e: WarehouseEntry) => {
    if (!window.confirm(`Delete "${e.title}"? This cannot be undone.`)) return;
    try {
      await deleteWarehouseEntry(e.id);
      addToast('Entry deleted', 'success');
      await load();
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  if (editing) {
    const exists = entries.some((e) => e.id === editing.id);
    return (
      <section aria-label="Warehouse entry editor">
        <div className="cms-list-header">
          <h2 style={{ margin: 0 }}>{exists ? 'Edit entry' : 'New entry'}</h2>
        </div>
        <div className="cms-editor">
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
          <div className="cms-field">
            <label>Title</label>
            <input value={editing.title} onChange={(ev) => setEditing({ ...editing, title: ev.target.value })} />
          </div>
          <div className="cms-field">
            <label>Content (markdown)</label>
            <textarea rows={10} value={editing.content} onChange={(ev) => setEditing({ ...editing, content: ev.target.value })} />
          </div>
          <ArrayEditor label="Tags" values={editing.tags ?? []} onChange={(tags) => setEditing({ ...editing, tags })} />
          <div className="cms-field">
            <label>Metadata (JSON)</label>
            <textarea rows={6} value={metaText} onChange={(ev) => setMetaText(ev.target.value)} spellCheck={false} style={{ fontFamily: 'monospace' }} />
          </div>
          <CompanyLinksEditor
            links={editing.company_links ?? []}
            companies={companies}
            onChange={(company_links) => setEditing({ ...editing, company_links })}
          />
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
          <div className="cms-field__row">
            <button className="cms-btn cms-btn--primary" onClick={save} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save'}
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
          <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            {ENTRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button className="cms-btn cms-btn--primary" onClick={startNew}>
          <Plus size={15} /> New entry
        </button>
      </div>
      {loading ? (
        <div className="cms-empty">Loading warehouse…</div>
      ) : visible.length === 0 ? (
        <div className="cms-empty">No entries match.</div>
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
                <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => remove(e)} aria-label={`Delete ${e.title}`} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
