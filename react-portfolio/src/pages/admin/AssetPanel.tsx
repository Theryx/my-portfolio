import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trash2, Pencil, X, Save } from 'lucide-react';
import { getAssets, registerAsset, deleteAsset, type Asset } from '../../lib/api';
import { CloudinaryUploadButton } from './fields';

type Toast = (message: string, type: 'success' | 'error') => void;

function filenameFromUrl(url: string): string {
  const clean = url.split('?')[0].split('#')[0];
  return clean.split('/').filter(Boolean).pop() || 'asset';
}

function isImage(mime?: string | null, url?: string): boolean {
  if (mime && mime.startsWith('image/')) return true;
  return /\.(png|jpe?g|jfif|webp|gif|svg|avif)$/i.test(url ?? '');
}

function formatSize(bytes?: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Asset library: images, PDFs, resumes the warehouse can reference. */
export default function AssetPanel({ addToast }: { addToast: Toast }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Asset | null>(null);
  const [descDraft, setDescDraft] = useState('');
  const [tagsDraft, setTagsDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAssets(await getAssets());
    } catch {
      addToast('Failed to load assets', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assets;
    return assets.filter((a) =>
      `${a.filename} ${a.description ?? ''} ${(a.tags ?? []).join(' ')} ${a.url}`.toLowerCase().includes(term));
  }, [assets, search]);

  const onUpload = async (url: string) => {
    try {
      await registerAsset({ url, filename: filenameFromUrl(url) });
      addToast('Asset added', 'success');
      await load();
    } catch {
      addToast('Failed to register asset', 'error');
    }
  };

  const startEdit = (a: Asset) => {
    setEditing(a);
    setDescDraft(a.description ?? '');
    setTagsDraft((a.tags ?? []).join(', '));
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const tags = tagsDraft.split(',').map((t) => t.trim()).filter(Boolean);
      const saved = await registerAsset({ ...editing, description: descDraft, tags });
      setAssets((list) => list.map((a) => (a.id === saved.id ? saved : a)));
      addToast('Asset updated', 'success');
      setEditing(null);
    } catch {
      addToast('Failed to update asset', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a: Asset) => {
    if (!window.confirm(`Delete asset "${a.filename}"? The file stays on Cloudinary.`)) return;
    try {
      await deleteAsset(a.id);
      addToast('Asset removed', 'success');
      await load();
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  return (
    <section aria-label="Assets">
      <div className="cms-list-header">
        <div className="cms-list-header__filters">
          <input placeholder="Search assets…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search assets" />
        </div>
        <CloudinaryUploadButton onUpload={onUpload} label="Upload asset" />
      </div>
      {loading ? (
        <div className="cms-empty">Loading assets…</div>
      ) : visible.length === 0 ? (
        <div className="cms-empty">No assets yet. Upload one to get started.</div>
      ) : (
        <div className="cms-asset-grid">
          {visible.map((a) => (
            <figure key={a.id} className="cms-asset-card">
              <div className="cms-asset-card__thumb">
                {isImage(a.mime_type, a.url) ? (
                  <img src={a.url} alt={a.description ?? a.filename} loading="lazy" />
                ) : (
                  <span className="cms-asset-card__type">{a.mime_type || 'file'}</span>
                )}
              </div>
              {editing?.id === a.id ? (
                <div className="cms-asset-card__edit">
                  <div className="cms-field">
                    <label htmlFor={`asset-desc-${a.id}`}>Description</label>
                    <textarea id={`asset-desc-${a.id}`} rows={2} value={descDraft} onChange={(e) => setDescDraft(e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label htmlFor={`asset-tags-${a.id}`}>Tags (comma separated)</label>
                    <input id={`asset-tags-${a.id}`} value={tagsDraft} onChange={(e) => setTagsDraft(e.target.value)} />
                  </div>
                  <div className="cms-field__row">
                    <button className="cms-btn cms-btn--primary" onClick={saveEdit} disabled={saving}>
                      <Save size={14} /> {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button className="cms-btn cms-btn--ghost" onClick={() => setEditing(null)} disabled={saving}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <figcaption className="cms-asset-card__body">
                    <span className="cms-asset-card__name" title={a.filename}>{a.filename}</span>
                    {a.description && <span className="cms-asset-card__desc">{a.description}</span>}
                    <span className="cms-asset-card__meta">
                      {formatSize(a.size)}{formatSize(a.size) && (a.tags?.length ?? 0) > 0 ? ' · ' : ''}
                      {(a.tags ?? []).join(', ')}
                    </span>
                  </figcaption>
                  <div className="cms-asset-card__actions">
                    <button className="cms-icon-btn" onClick={() => startEdit(a)} aria-label={`Edit ${a.filename}`} title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => remove(a)} aria-label={`Delete ${a.filename}`} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </>
              )}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
