import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trash2, Pencil, Search, Images, Copy } from 'lucide-react';
import { registerAsset, deleteAsset, type Asset } from '../../lib/api';
import { PageHead, EmptyState, TextArea, TagInput, Pill } from './ui';
import { ConfirmDialog, Modal } from './dialogs';
import { CloudinaryUploadButton } from './upload';
import { AssetImage, loadAssets } from './AssetPicker';
import { filenameFromUrl, formatSize } from './assets';
import type { StudioData, Toast } from './data';

/** The asset library: every image and file the Library and sites can use. */
export default function AssetPanel({ data, toast }: { data: StudioData; toast: Toast }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Asset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    try {
      setAssets(await loadAssets(force));
    } catch {
      toast('Could not load assets', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { void load(); }, [load]);

  // How many Library entries use each asset, attached or referenced by its url.
  const usage = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of data.entries) {
      const blob = JSON.stringify(e.metadata ?? {});
      for (const a of assets) {
        if ((e.asset_ids ?? []).includes(a.id) || (a.url && blob.includes(`"${a.url}"`))) {
          m.set(a.id, (m.get(a.id) ?? 0) + 1);
        }
      }
    }
    return m;
  }, [assets, data.entries]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assets;
    return assets.filter((a) => `${a.filename} ${a.description ?? ''} ${(a.tags ?? []).join(' ')}`.toLowerCase().includes(term));
  }, [assets, search]);

  const onUpload = async (url: string) => {
    try {
      await registerAsset({ url, filename: filenameFromUrl(url) });
      toast('Uploaded and added to the library', 'success');
      await load(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not add the upload', 'error');
    }
  };

  const remove = async () => {
    const a = deleteTarget;
    setDeleteTarget(null);
    if (!a) return;
    try {
      await deleteAsset(a.id);
      toast('Removed from the library', 'success');
      await load(true);
    } catch {
      toast('Delete failed', 'error');
    }
  };

  return (
    <>
      <PageHead
        title="Assets"
        sub="Images and files your entries and sites use."
        actions={<CloudinaryUploadButton onUpload={onUpload} label="Upload" primary />}
      />
      <div className="cms-toolbar">
        <div className="cms-search">
          <Search size={15} aria-hidden="true" />
          <input className="cms-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search names, descriptions and tags" aria-label="Search assets" />
        </div>
        <span className="cms-field__hint">{assets.length} files</span>
      </div>

      {loading && assets.length === 0 ? (
        <p className="cms-field__hint">Loading assets…</p>
      ) : visible.length === 0 ? (
        <EmptyState icon={<Images size={22} />} title={search ? 'Nothing matches that search' : 'No assets yet'} />
      ) : (
        <div className="cms-assets">
          {visible.map((a) => {
            const used = usage.get(a.id) ?? 0;
            return (
              <figure key={a.id} className="cms-asset" style={{ margin: 0 }}>
                <div className="cms-asset__thumb"><AssetImage asset={a} /></div>
                <figcaption className="cms-asset__body">
                  <span className="cms-asset__name" title={a.filename}>{a.description || a.filename}</span>
                  <span className="cms-asset__desc">{a.filename}</span>
                  <span className="cms-row" style={{ gap: 6, marginTop: 4 }}>
                    {used ? <Pill tone="green" plain>Used in {used}</Pill> : <Pill plain>Unused</Pill>}
                    {formatSize(a.size) && <span className="cms-field__hint">{formatSize(a.size)}</span>}
                  </span>
                </figcaption>
                <div className="cms-asset__actions">
                  <button type="button" className="cms-icon-btn" onClick={() => { void navigator.clipboard?.writeText(a.url); toast('Reference copied', 'success'); }} aria-label={`Copy the reference for ${a.filename}`} title="Copy reference"><Copy size={14} /></button>
                  <button type="button" className="cms-icon-btn" onClick={() => setEditing(a)} aria-label={`Edit ${a.filename}`} title="Edit"><Pencil size={14} /></button>
                  <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => setDeleteTarget(a)} aria-label={`Delete ${a.filename}`} title="Delete"><Trash2 size={14} /></button>
                </div>
              </figure>
            );
          })}
        </div>
      )}

      {editing && (
        <AssetEditor
          asset={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => { setAssets((list) => list.map((x) => (x.id === saved.id ? saved : x))); void loadAssets(true); setEditing(null); toast('Asset updated', 'success'); }}
          onError={(m) => toast(m, 'error')}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog title="Remove from the library?" confirmLabel="Remove" danger onConfirm={remove} onCancel={() => setDeleteTarget(null)}>
          <p>
            "{deleteTarget.filename}" leaves the library. The file itself stays on Cloudinary
            {(usage.get(deleteTarget.id) ?? 0) > 0 ? ', and entries that use it keep their reference.' : '.'}
          </p>
        </ConfirmDialog>
      )}
    </>
  );
}

function AssetEditor({ asset, onClose, onSaved, onError }: {
  asset: Asset;
  onClose: () => void;
  onSaved: (a: Asset) => void;
  onError: (m: string) => void;
}) {
  const [description, setDescription] = useState(asset.description ?? '');
  const [tags, setTags] = useState<string[]>(asset.tags ?? []);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      onSaved(await registerAsset({ ...asset, description, tags }));
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not update the asset');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={asset.filename}
      narrow
      onClose={onClose}
      footer={
        <>
          <span />
          <div className="cms-row">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="cms-btn cms-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </>
      }
    >
      <div className="cms-stack">
        <div className="cms-asset" style={{ maxWidth: 320 }}>
          <div className="cms-asset__thumb"><AssetImage asset={asset} /></div>
        </div>
        <TextArea label="Description" value={description} onChange={setDescription} rows={3} hint="Shown in pickers and used as the image's alt text." />
        <TagInput label="Tags" values={tags} onChange={setTags} />
        <p className="cms-field__hint">Reference: <code>{asset.url}</code></p>
      </div>
    </Modal>
  );
}
