/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState } from 'react';
import { Check, Library, Search } from 'lucide-react';
import { getAssets, registerAsset, type Asset } from '../../lib/api';
import { Field, MediaImage, Thumb, type FieldProps } from './ui';
import { Modal } from './dialogs';
import { CloudinaryUploadButton } from './upload';
import { filenameFromUrl } from './assets';

// One fetch per session, shared by every picker; uploads refresh it.
let cache: Promise<Asset[]> | null = null;
export function loadAssets(force = false): Promise<Asset[]> {
  if (!cache || force) {
    cache = getAssets().catch((err) => {
      cache = null;
      throw err;
    });
  }
  return cache;
}

/**
 * Asset library picker. `selected` holds asset ids or stored image refs
 * (the asset's url); confirming returns the chosen assets.
 */
export default function AssetPicker({ title, selected, multiple, onConfirm, onClose }: {
  title: string;
  selected: string[];
  multiple?: boolean;
  onConfirm: (assets: Asset[]) => void;
  onClose: () => void;
}) {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<Set<string>>(new Set());

  useEffect(() => {
    let live = true;
    loadAssets()
      .then((list) => {
        if (!live) return;
        setAssets(list);
        setPicked(new Set(list.filter((a) => selected.includes(a.id) || selected.includes(a.url)).map((a) => a.id)));
      })
      .catch(() => live && setError(true));
    return () => { live = false; };
    // The initial selection is read once when the picker opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = assets ?? [];
    if (!term) return list;
    return list.filter((a) => `${a.filename} ${a.description ?? ''} ${(a.tags ?? []).join(' ')}`.toLowerCase().includes(term));
  }, [assets, search]);

  const toggle = (a: Asset) => {
    setPicked((cur) => {
      if (!multiple) return new Set(cur.has(a.id) ? [] : [a.id]);
      const next = new Set(cur);
      if (next.has(a.id)) next.delete(a.id);
      else next.add(a.id);
      return next;
    });
  };

  const onUpload = async (url: string) => {
    const saved = await registerAsset({ url, filename: filenameFromUrl(url) });
    const list = await loadAssets(true);
    setAssets(list);
    setPicked((cur) => (multiple ? new Set([...cur, saved.id]) : new Set([saved.id])));
  };

  const confirm = () => onConfirm((assets ?? []).filter((a) => picked.has(a.id)));

  return (
    <Modal
      title={title}
      onClose={onClose}
      headExtra={<CloudinaryUploadButton onUpload={onUpload} label="Upload new" small />}
      footer={
        <>
          <span className="cms-field__hint">
            {picked.size ? `${picked.size} selected` : multiple ? 'Select one or more' : 'Select one'}
          </span>
          <div className="cms-row">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="cms-btn cms-btn--primary" onClick={confirm} disabled={!multiple && picked.size === 0}>
              {multiple ? 'Done' : 'Use image'}
            </button>
          </div>
        </>
      }
    >
      <div className="cms-toolbar">
        <div className="cms-search">
          <Search size={15} aria-hidden="true" />
          <input
            className="cms-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, description or tag"
            aria-label="Search assets"
            data-autofocus
          />
        </div>
      </div>
      {error ? (
        <p className="cms-field__error">The asset library could not be loaded.</p>
      ) : !assets ? (
        <p className="cms-field__hint">Loading assets…</p>
      ) : visible.length === 0 ? (
        <p className="cms-field__hint">No assets match.</p>
      ) : (
        <div className="cms-assets">
          {visible.map((a) => {
            const on = picked.has(a.id);
            return (
              <button key={a.id} type="button" className="cms-asset cms-asset--pick" aria-pressed={on} onClick={() => toggle(a)} onDoubleClick={() => !multiple && onConfirm([a])}>
                <span className="cms-asset__thumb"><AssetImage asset={a} /></span>
                {on && <span className="cms-asset__check" aria-hidden="true"><Check size={14} /></span>}
                <span className="cms-asset__body">
                  <span className="cms-asset__name" title={a.filename}>{a.description || a.filename}</span>
                  <span className="cms-asset__desc">{a.filename}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

export function AssetImage({ asset }: { asset: Asset }) {
  return <MediaImage src={asset.url || asset.filename} alt={asset.description ?? ''} iconSize={24} />;
}

// Fresh uploads also go into the asset library, so they can be reused later.
async function addToLibrary(url: string) {
  try {
    await registerAsset({ url, filename: filenameFromUrl(url) });
    await loadAssets(true);
  } catch {
    /* the image is still set on the field; the library entry can be added later */
  }
}

/* An image field: thumbnail, the stored ref, and Library / Upload / Clear. */
export function ImageInput({ value, onChange, ...field }: FieldProps & {
  value: string;
  onChange: (v: string) => void;
}) {
  const [picking, setPicking] = useState(false);
  return (
    <Field {...field}>
      {(id, hintId) => (
        <div className="cms-image">
          <Thumb src={value} size="lg" />
          <div className="cms-image__body">
            <input
              id={id}
              className="cms-input cms-input--mono"
              value={value}
              placeholder="Choose from the library, upload, or paste a URL"
              aria-describedby={hintId}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="cms-row">
              <button type="button" className="cms-btn cms-btn--sm" onClick={() => setPicking(true)}>
                <Library size={14} /> Library
              </button>
              <CloudinaryUploadButton onUpload={(url) => { onChange(url); void addToLibrary(url); }} label="Upload" small />
              {value && (
                <button type="button" className="cms-btn cms-btn--sm cms-btn--ghost" onClick={() => onChange('')}>
                  Clear
                </button>
              )}
            </div>
          </div>
          {picking && (
            <AssetPicker
              title={`Choose ${field.label.toLowerCase()}`}
              selected={value ? [value] : []}
              onClose={() => setPicking(false)}
              onConfirm={(picked) => { onChange(picked[0]?.url ?? ''); setPicking(false); }}
            />
          )}
        </div>
      )}
    </Field>
  );
}
