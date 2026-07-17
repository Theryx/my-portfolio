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

/* ─── Speaking images (Research & Speaking collage, up to 3) ────────────── */

export const MAX_SPEAKING_IMAGES = 3;

export function SpeakingImagesEditor({ value, onChange }: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const slots = Array.from({ length: MAX_SPEAKING_IMAGES }, (_, i) => value[i] ?? '');
  const setSlot = (i: number, v: string) =>
    onChange(slots.map((s, idx) => (idx === i ? v : s)));
  const clearSlot = (i: number) => setSlot(i, '');

  return (
    <div className="cms-field">
      <label>Speaking images</label>
      <p className="cms-field__hint">
        Up to {MAX_SPEAKING_IMAGES} images for the Research &amp; Speaking collage.
        The first image opens the lightbox. Leave a slot empty to skip it.
      </p>
      {slots.map((slot, i) => (
        <div key={i} className="cms-field" style={{ marginBottom: 12 }}>
          <label htmlFor={`af-speaking-image-${i}`}>Image {i + 1}{i === 0 ? ' (hero)' : ''}</label>
          <div className="cms-field__row">
            <input
              id={`af-speaking-image-${i}`}
              value={slot}
              onChange={(e) => setSlot(i, e.target.value)}
              placeholder={i === 0 ? 'https://… or a bundled image filename' : 'Optional — leave empty to skip'}
            />
            <CloudinaryUploadButton onUpload={(url) => setSlot(i, url)} label="Upload" />
            {slot && (
              <button
                type="button"
                className="cms-btn cms-btn--ghost"
                onClick={() => clearSlot(i)}
                aria-label={`Clear image ${i + 1}`}
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
          {slot && /^(https?:\/\/|\/)/.test(slot) && (
            <img src={slot} alt="" className="cms-field__preview" />
          )}
        </div>
      ))}
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

/* ─── FAQ editor (list of question / answer pairs) ──────────────────────── */

export function FaqEditor({ label, value, onChange, hint }: {
  label: string;
  value: { question: string; answer: string }[];
  onChange: (v: { question: string; answer: string }[]) => void;
  hint?: string;
}) {
  const update = (i: number, key: 'question' | 'answer', val: string) =>
    onChange(value.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)));
  const add = () => onChange([...value, { question: '', answer: '' }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="cms-field">
      <label>{label}</label>
      {hint && <p className="cms-field__hint">{hint}</p>}
      {value.map((f, i) => (
        <div
          key={i}
          style={{
            border: '1px solid var(--cms-border, #33333a)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <input
            value={f.question}
            onChange={(e) => update(i, 'question', e.target.value)}
            placeholder={`Question ${i + 1}`}
          />
          <textarea
            value={f.answer}
            onChange={(e) => update(i, 'answer', e.target.value)}
            placeholder="Answer"
            rows={3}
          />
          <button
            type="button"
            className="cms-btn cms-btn--ghost"
            onClick={() => remove(i)}
            style={{ alignSelf: 'flex-start' }}
          >
            <X size={14} /> Remove
          </button>
        </div>
      ))}
      <button type="button" className="cms-btn cms-btn--ghost" onClick={add}>
        <Plus size={14} /> Add FAQ
      </button>
    </div>
  );
}

/* ─── Checkbox group (multi-profile picker) ─────────────────────────────── */

export interface CheckboxOption {
  value: string;
  label: string;
  hint?: string;
}

export function CheckboxGroup({ label, value, options, onChange, hint }: {
  label: string;
  value: string[];
  options: CheckboxOption[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  const toggle = (v: string, checked: boolean) => {
    if (checked) {
      if (!value.includes(v)) onChange([...value, v]);
    } else {
      onChange(value.filter((x) => x !== v));
    }
  };

  return (
    <div className="cms-field">
      <label>{label}</label>
      <div className="cms-checkbox-group" role="group" aria-label={label}>
        {options.map((opt) => {
          const id = `cb-${label.replace(/\s+/g, '-').toLowerCase()}-${opt.value}`;
          return (
            <label key={opt.value} htmlFor={id} className="cms-checkbox-group__row">
              <input
                id={id}
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={(e) => toggle(opt.value, e.target.checked)}
              />
              <span className="cms-checkbox-group__label">{opt.label}</span>
              {opt.hint && <span className="cms-checkbox-group__hint">{opt.hint}</span>}
            </label>
          );
        })}
      </div>
      {hint && <p className="cms-field__hint">{hint}</p>}
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
