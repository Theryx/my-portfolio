import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Search, Layers, X } from 'lucide-react';
import {
  getCompanies,
  upsertCompany,
  deleteCompany,
  getWarehouseEntries,
  type Company,
  type WarehouseEntry,
} from '../../lib/api';
import { CompanyForm } from './forms';

type Toast = (message: string, type: 'success' | 'error') => void;

const STATUS_BADGE: Record<string, string> = {
  published: 'cms-badge--live',
  draft: 'cms-badge--muted',
  archived: 'cms-badge--muted',
};

function emptyCompany(): Company {
  return {
    id: '',
    name: '',
    slug: '',
    is_active: false,
    role: '',
    job_description: '',
    job_url: '',
    status: 'draft',
    layout: 'default',
    theme_config: {},
    seo: {},
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
  };
}

/**
 * Company manager: each company is a targeted microsite. Content is pulled from
 * the warehouse and linked per company. Self-contained so Admin only renders it.
 */
export default function CompanyPanel({ addToast }: { addToast: Toast }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [entries, setEntries] = useState<WarehouseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Company | null>(null);
  const [contentFor, setContentFor] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, e] = await Promise.all([
        getCompanies(),
        getWarehouseEntries({ include_hidden: true }),
      ]);
      setCompanies(c);
      setEntries(e);
    } catch {
      addToast('Failed to load companies', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const linkedCount = useCallback(
    (companyId: string) => entries.filter((e) => (e.company_ids ?? []).includes(companyId)).length,
    [entries],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return companies;
    return companies.filter((c) =>
      `${c.name} ${c.id} ${c.slug} ${c.role ?? ''}`.toLowerCase().includes(term));
  }, [companies, search]);

  const save = async (data: Partial<Company>) => {
    setSaving(true);
    try {
      const saved = await upsertCompany(data);
      setCompanies((list) => {
        const exists = list.some((c) => c.id === saved.id);
        return exists ? list.map((c) => (c.id === saved.id ? saved : c)) : [...list, saved];
      });
      setEditing(null);
      addToast('Company saved', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCompany(deleteTarget.id);
      setCompanies((list) => list.filter((c) => c.id !== deleteTarget.id));
      addToast('Company deleted', 'success');
    } catch {
      addToast('Delete failed', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleActive = async (company: Company) => {
    try {
      const saved = await upsertCompany({ ...company, is_active: !company.is_active });
      setCompanies((list) => list.map((c) => (c.id === saved.id ? saved : c)));
      addToast(company.is_active ? 'Company deactivated' : 'Company activated', 'success');
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  if (editing) {
    return (
      <section aria-label="Company editor">
        <div className="cms-list-header">
          <h2 style={{ margin: 0 }}>{editing.id ? `Edit ${editing.name}` : 'New company'}</h2>
          <button className="cms-btn cms-btn--ghost" onClick={() => setEditing(null)}>
            <X size={15} /> Cancel
          </button>
        </div>
        <CompanyForm
          company={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      </section>
    );
  }

  if (contentFor) {
    const linked = entries
      .filter((e) => (e.company_ids ?? []).includes(contentFor.id))
      .sort((a, b) => (a.company_sort_order ?? a.sort_order ?? 0) - (b.company_sort_order ?? b.sort_order ?? 0));
    return (
      <section aria-label="Linked content">
        <div className="cms-list-header">
          <div>
            <h2 style={{ margin: 0 }}>{contentFor.name} · linked content</h2>
            <p className="cms-list-header__hint" style={{ margin: '4px 0 0' }}>
              Warehouse entries shown on this microsite. Reorder and toggle visibility per company in the Warehouse.
            </p>
          </div>
          <button className="cms-btn cms-btn--ghost" onClick={() => setContentFor(null)}>
            <X size={15} /> Close
          </button>
        </div>
        {linked.length === 0 ? (
          <div className="cms-empty">Nothing linked yet. Link entries to this company from the Warehouse.</div>
        ) : (
          <ul className="cms-list">
            {linked.map((e) => (
              <li key={e.id} className="cms-item">
                <div className="cms-item__body">
                  <div className="cms-item__title">
                    {e.title}
                    <span className="cms-badge cms-badge--muted">{e.type}</span>
                    {(e.company_links?.find((l) => l.company_id === contentFor.id)?.is_visible === false || e.is_hidden) && (
                      <span className="cms-badge cms-badge--muted">Hidden</span>
                    )}
                  </div>
                  <div className="cms-item__meta"><code>{e.id}</code></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <section aria-label="Companies">
      <div className="cms-list-header">
        <div className="cms-list-header__filters">
          <div className="cms-search">
            <Search size={15} aria-hidden="true" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies…" aria-label="Search companies" />
          </div>
        </div>
        <button className="cms-btn cms-btn--primary" onClick={() => setEditing(emptyCompany())}>
          <Plus size={15} /> New company
        </button>
      </div>

      {loading ? (
        <div className="cms-empty">Loading companies…</div>
      ) : visible.length === 0 ? (
        <div className="cms-empty">No companies yet. Create one to build a targeted microsite.</div>
      ) : (
        <div className="cms-company-grid">
          {visible.map((company) => (
            <article key={company.id} className="cms-company-card">
              <div className="cms-company-card__top">
                <span className={`cms-badge ${STATUS_BADGE[company.status ?? 'published'] ?? 'cms-badge--muted'}`}>
                  {company.status || 'published'}
                </span>
                {company.is_active && <span className="cms-badge cms-badge--live">Active</span>}
              </div>
              <h3 className="cms-company-card__name">{company.name || '(unnamed)'}</h3>
              <p className="cms-company-card__role">{company.role || 'No target role set'}</p>
              <div className="cms-company-card__meta">
                <code>{company.slug || company.id}</code>
                <span className="cms-company-card__count">
                  <Layers size={13} /> {linkedCount(company.id)} linked
                </span>
              </div>
              <div className="cms-company-card__actions">
                <a className="cms-icon-btn" href={`/c/${company.slug || company.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${company.name}`} title="Preview microsite">
                  <ExternalLink size={15} />
                </a>
                <button className="cms-icon-btn" onClick={() => setContentFor(company)} aria-label={`Linked content for ${company.name}`} title="Linked content">
                  <Layers size={15} />
                </button>
                <button className="cms-icon-btn" onClick={() => toggleActive(company)} aria-label={company.is_active ? 'Deactivate' : 'Activate'} title={company.is_active ? 'Deactivate' : 'Activate'}>
                  <span className={`cms-dot ${company.is_active ? 'cms-dot--on' : ''}`} />
                </button>
                <button className="cms-icon-btn" onClick={() => setEditing(company)} aria-label={`Edit ${company.name}`} title="Edit">
                  <Pencil size={15} />
                </button>
                <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => setDeleteTarget(company)} aria-label={`Delete ${company.name}`} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div
          className="cms-overlay"
          role="alertdialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="cms-dialog">
            <h2>Delete company?</h2>
            <p>
              "{deleteTarget.name}" will be deleted. Its warehouse entries are preserved; only the
              microsite and its links are removed.
            </p>
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
