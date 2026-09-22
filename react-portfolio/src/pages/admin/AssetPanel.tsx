import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
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

/** Asset library: images, PDFs, resumes the warehouse can reference. */
export default function AssetPanel({ addToast }: { addToast: Toast }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
      `${a.filename} ${a.description ?? ''} ${a.url}`.toLowerCase().includes(term));
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
          <input placeholder="Search assets…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <CloudinaryUploadButton onUpload={onUpload} label="Upload asset" />
      </div>
      {loading ? (
        <div className="cms-empty">Loading assets…</div>
      ) : visible.length === 0 ? (
        <div className="cms-empty">No assets yet. Upload one to get started.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {visible.map((a) => (
            <figure key={a.id} className="cms-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, margin: 0 }}>
              <div style={{
                aspectRatio: '4 / 3', background: 'var(--cms-surface, #1c1c22)',
                border: '1px solid var(--cms-border, #33333a)', borderRadius: 8,
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isImage(a.mime_type, a.url) ? (
                  <img src={a.url} alt={a.description ?? a.filename} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{(a.mime_type || 'file')}</span>
                )}
              </div>
              <figcaption className="cms-item__meta" style={{ wordBreak: 'break-all' }}>{a.filename}</figcaption>
              <button className="cms-icon-btn cms-icon-btn--danger" onClick={() => remove(a)} aria-label={`Delete ${a.filename}`} title="Delete">
                <Trash2 size={15} />
              </button>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
