import { useState } from 'react';
import { Eye, EyeOff, X, Plus } from 'lucide-react';

/* ─── Password input with show/hide toggle ──────────────────────────────── */

export function PasswordInput({ id, value, onChange, placeholder, autoComplete }: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="cms-password">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="cms-password__toggle"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

/* ─── Cloudinary upload widget ──────────────────────────────────────────── */

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: { secure_url: string } }) => void
      ) => { open: () => void };
    };
  }
}

export function CloudinaryUploadButton({ onUpload, label }: { onUpload: (url: string) => void; label?: string }) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  const handleClick = () => {
    if (!window.cloudinary || !cloudName || !uploadPreset) {
      alert('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      { cloudName, uploadPreset, multiple: false, maxFiles: 1, resourceType: 'image' },
      (error, result) => {
        if (!error && result?.event === 'success') {
          onUpload(result.info.secure_url);
        }
      }
    );
    widget.open();
  };

  return (
    <button type="button" className="cms-btn cms-btn--ghost" onClick={handleClick}>
      {label ?? 'Upload image'}
    </button>
  );
}

/* ─── Image field with upload + manual URL ──────────────────────────────── */

export function ImageField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div className="cms-field">
      <label>{label}</label>
      <div className="cms-field__row">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or a bundled image filename"
        />
        <CloudinaryUploadButton onUpload={onChange} label="Upload" />
      </div>
      {hint && <p className="cms-field__hint">{hint}</p>}
      {value && /^(https?:\/\/|\/)/.test(value) && (
        <img src={value} alt="" className="cms-field__preview" />
      )}
    </div>
  );
}

/* ─── Array (tag list) editor ───────────────────────────────────────────── */

export function ArrayEditor({ label, values, onChange, placeholder }: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft('');
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div className="cms-field">
      <label>{label}</label>
      {values.length > 0 && (
        <div className="cms-tags">
          {values.map((v, i) => (
            <span key={`${v}-${i}`} className="cms-tag">
              {v}
              <button type="button" onClick={() => remove(i)} aria-label={`Remove ${v}`}><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
      <div className="cms-field__row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder || 'Type and press Enter'}
        />
        <button type="button" className="cms-btn cms-btn--ghost" onClick={add} aria-label="Add item"><Plus size={14} /> Add</button>
      </div>
    </div>
  );
}

/* ─── Key-value editor (social links etc.) ──────────────────────────────── */

export function KVEditor({ label, value, onChange, hint }: {
  label: string;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  hint?: string;
}) {
  const [draftKey, setDraftKey] = useState('');
  const [draftVal, setDraftVal] = useState('');
  const entries = Object.entries(value);
  const add = () => {
    const k = draftKey.trim(), v = draftVal.trim();
    if (k && v) { onChange({ ...value, [k]: v }); setDraftKey(''); setDraftVal(''); }
  };
  const remove = (k: string) => {
    const next = { ...value };
    delete next[k];
    onChange(next);
  };

  return (
    <div className="cms-field">
      <label>{label}</label>
      {hint && <p className="cms-field__hint">{hint}</p>}
      {entries.length > 0 && (
        <div className="cms-tags">
          {entries.map(([k, v]) => (
            <span key={k} className="cms-tag">
              <strong>{k}</strong>&nbsp;{v.length > 36 ? `${v.slice(0, 36)}…` : v}
              <button type="button" onClick={() => remove(k)} aria-label={`Remove ${k}`}><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
      <div className="cms-field__row cms-field__row--kv">
        <input value={draftKey} onChange={(e) => setDraftKey(e.target.value)} placeholder="key (e.g. linkedin, email, resume)" />
        <input value={draftVal} onChange={(e) => setDraftVal(e.target.value)} placeholder="URL or value" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        <button type="button" className="cms-btn cms-btn--ghost" onClick={add} aria-label="Add link"><Plus size={14} /> Add</button>
      </div>
    </div>
  );
}
