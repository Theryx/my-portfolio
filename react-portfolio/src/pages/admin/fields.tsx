import { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { TextArea, TextInput } from './ui';
import { ImageInput } from './AssetPicker';

/* ─── Password input with show/hide toggle ──────────────────────────────── */

export function PasswordInput({ id, value, onChange, placeholder, autoComplete }: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="cms-password">
      <input
        id={id}
        className="cms-input"
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

/* ─── FAQ editor (question / answer pairs) ──────────────────────────────── */

export function FaqEditor({ value, onChange }: {
  value: { question: string; answer: string }[];
  onChange: (v: { question: string; answer: string }[]) => void;
}) {
  const update = (i: number, key: 'question' | 'answer', val: string) =>
    onChange(value.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)));

  return (
    <div className="cms-stack">
      {value.length === 0 && <p className="cms-field__hint">No questions yet.</p>}
      {value.map((f, i) => (
        <div key={i} className="cms-block__item">
          <div className="cms-block__itemhead">
            <span>Question {i + 1}</span>
            <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label={`Remove question ${i + 1}`}>
              <Trash2 size={14} />
            </button>
          </div>
          <TextInput label="Question" value={f.question} onChange={(v) => update(i, 'question', v)} />
          <TextArea label="Answer" value={f.answer} onChange={(v) => update(i, 'answer', v)} rows={3} />
        </div>
      ))}
      <div>
        <button type="button" className="cms-btn cms-btn--sm" onClick={() => onChange([...value, { question: '', answer: '' }])}>
          <Plus size={14} /> Add question
        </button>
      </div>
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
  const setSlot = (i: number, v: string) => onChange(slots.map((s, idx) => (idx === i ? v : s)));

  return (
    <div className="cms-stack">
      {slots.map((slot, i) => (
        <ImageInput
          key={i}
          label={i === 0 ? 'Image 1 (opens the lightbox)' : `Image ${i + 1}`}
          optional={i > 0}
          value={slot}
          onChange={(v) => setSlot(i, v)}
        />
      ))}
    </div>
  );
}
