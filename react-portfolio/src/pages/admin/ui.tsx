import { useId, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ImageIcon, Plus, X } from 'lucide-react';
import { resolveMedia } from './media';

/* Studio primitives. Every control renders its own <label> bound to the input
   through useId, so clicking a label focuses its field and screen readers
   announce what each field is. */

export type FieldProps = {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  aside?: ReactNode;
};

export function Field({ label, hint, error, optional, aside, children }: FieldProps & {
  children: (id: string, describedBy: string | undefined) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="cms-field">
      <div className="cms-field__label">
        <label htmlFor={id}>
          {label}
          {optional && <span className="cms-field__optional"> · optional</span>}
        </label>
        {aside}
      </div>
      {children(id, hintId)}
      {error ? (
        <p className="cms-field__error" role="alert">{error}</p>
      ) : hint ? (
        <p className="cms-field__hint" id={hintId}>{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, type = 'text', mono, disabled, required, ...field }: FieldProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'url' | 'email' | 'date' | 'number';
  mono?: boolean;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <Field {...field}>
      {(id, hintId) => (
        <input
          id={id}
          className={`cms-input${mono ? ' cms-input--mono' : ''}`}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

export function TextArea({ value, onChange, placeholder, rows = 4, mono, ...field }: FieldProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <Field {...field}>
      {(id, hintId) => (
        <textarea
          id={id}
          className={`cms-textarea${mono ? ' cms-textarea--mono' : ''}`}
          rows={rows}
          value={value}
          placeholder={placeholder}
          spellCheck={!mono}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

export type Option = string | { value: string; label: string };

export function SelectInput({ value, onChange, options, ...field }: FieldProps & {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  // Never let the control misreport a stored value it has no option for.
  const known = opts.some((o) => o.value === value);
  return (
    <Field {...field}>
      {(id, hintId) => (
        <select id={id} className="cms-select" value={value} aria-describedby={hintId} onChange={(e) => onChange(e.target.value)}>
          {!known && <option value={value}>{value || '(none)'}</option>}
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
    </Field>
  );
}

export function NumberInput({ value, onChange, min, max, ...field }: FieldProps & {
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
}) {
  return (
    <Field {...field}>
      {(id, hintId) => (
        <input
          id={id}
          className="cms-input cms-input--number"
          type="number"
          min={min}
          max={max}
          value={value ?? ''}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      )}
    </Field>
  );
}

export function Switch({ label, description, checked, onChange, hideLabel }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  /** Keep the label for screen readers but don't show it. */
  hideLabel?: boolean;
}) {
  return (
    <label className="cms-switch" title={hideLabel ? label : undefined}>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="cms-switch__track" aria-hidden="true" />
      <span className={hideLabel ? 'cms-visually-hidden' : 'cms-switch__text'}>
        <span>{label}</span>
        {description && <span className="cms-field__hint">{description}</span>}
      </span>
    </label>
  );
}

export function TagInput({ values, onChange, placeholder, ...field }: FieldProps & {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setDraft('');
  };
  return (
    <Field {...field}>
      {(id, hintId) => (
        <>
          {values.length > 0 && (
            <div className="cms-tags">
              {values.map((v, i) => (
                <span key={`${v}-${i}`} className="cms-tag">
                  {v}
                  <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} aria-label={`Remove ${v}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="cms-row">
            <input
              id={id}
              className="cms-input"
              value={draft}
              placeholder={placeholder ?? 'Type and press Enter'}
              aria-describedby={hintId}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
            />
            <button type="button" className="cms-btn" onClick={add} disabled={!draft.trim()}>
              <Plus size={14} /> Add
            </button>
          </div>
        </>
      )}
    </Field>
  );
}

export function MarkdownInput({ value, onChange, rows = 10, placeholder, ...field }: FieldProps & {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [preview, setPreview] = useState(false);
  return (
    <Field
      {...field}
      aside={
        <span className="cms-md__tabs" role="group" aria-label={`${field.label} view`}>
          <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>Write</button>
          <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>Preview</button>
        </span>
      }
    >
      {(id, hintId) => preview ? (
        <div className="cms-md__preview" id={id} tabIndex={0} aria-describedby={hintId}>
          {value.trim()
            ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            : <p className="cms-field__hint">Nothing to preview yet.</p>}
        </div>
      ) : (
        <textarea
          id={id}
          className="cms-textarea"
          rows={rows}
          value={value}
          placeholder={placeholder ?? 'Write in Markdown…'}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

/* ─── Images ────────────────────────────────────────────────────────────── */

/** An image ref (URL or bundled filename), resolved, with an icon fallback. */
export function MediaImage({ src, alt = '', iconSize = 18 }: { src?: string | null; alt?: string; iconSize?: number }) {
  const url = resolveMedia(src);
  // Remember which url failed, so a new src gets a fresh attempt.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return url && failedUrl !== url
    ? <img src={url} alt={alt} loading="lazy" onError={() => setFailedUrl(url)} />
    : <ImageIcon size={iconSize} aria-hidden="true" />;
}

export function Thumb({ src, size = 'md', alt = '' }: { src?: string | null; size?: 'md' | 'lg'; alt?: string }) {
  return (
    <span className={`cms-thumb${size === 'lg' ? ' cms-thumb--lg' : ''}`}>
      <MediaImage src={src} alt={alt} iconSize={size === 'lg' ? 22 : 16} />
    </span>
  );
}

/* ─── Layout bits ───────────────────────────────────────────────────────── */

export function Section({ title, description, actions, children }: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="cms-section">
      <div className="cms-section__head">
        <div>
          <h2 className="cms-section__title">{title}</h2>
          {description && <p className="cms-section__desc">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Disclosure({ title, children, defaultOpen }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="cms-disclosure" open={defaultOpen}>
      <summary>{title}</summary>
      <div className="cms-disclosure__body">{children}</div>
    </details>
  );
}

export type Tone = 'neutral' | 'green' | 'blue' | 'violet' | 'amber' | 'red';

export function Pill({ tone = 'neutral', plain, children }: { tone?: Tone; plain?: boolean; children: ReactNode }) {
  return <span className={`cms-pill cms-pill--${tone}${plain ? ' cms-pill--plain' : ''}`}>{children}</span>;
}

export function EmptyState({ icon, title, children, action }: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="cms-empty">
      {icon}
      <p className="cms-empty__title">{title}</p>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function PageHead({ title, sub, actions, crumb }: {
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  crumb?: ReactNode;
}) {
  return (
    <>
      {crumb}
      <header className="cms-page-head">
        <div>
          <h1 className="cms-page-head__title">{title}</h1>
          {sub && <p className="cms-page-head__sub">{sub}</p>}
        </div>
        {actions && <div className="cms-page-head__actions">{actions}</div>}
      </header>
    </>
  );
}

export function SaveBar({ dirty, saving, onSave, onCancel, saveLabel = 'Save changes', extra }: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="cms-savebar">
      <span className="cms-savebar__status" aria-live="polite">
        {dirty ? <><span className="cms-savebar__dot" aria-hidden="true" /> Unsaved changes</> : 'All changes saved'}
      </span>
      <div className="cms-row">
        {extra}
        <button type="button" className="cms-btn cms-btn--ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="button" className="cms-btn cms-btn--primary" onClick={onSave} disabled={saving || !dirty}>
          {saving ? 'Saving…' : saveLabel}
        </button>
      </div>
    </div>
  );
}
