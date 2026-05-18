import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

export function MarkdownEditor({ label, value, onChange, rows = 16, placeholder }: Props) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  return (
    <div className="admin__field">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ margin: 0 }}>{label}</label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '4px',
                border: '1px solid var(--color-border, #333)',
                background: tab === t ? 'var(--color-accent, #fff)' : 'transparent',
                color: tab === t ? 'var(--color-bg, #000)' : 'inherit',
                cursor: 'pointer',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder ?? '# Heading\n\nWrite **markdown** here…'}
          style={{ fontFamily: 'monospace', fontSize: '13px', width: '100%' }}
        />
      ) : (
        <div
          className="markdown-preview"
          style={{
            minHeight: `${rows * 1.5}em`,
            padding: '12px',
            border: '1px solid var(--color-border, #333)',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p style={{ opacity: 0.4, fontStyle: 'italic' }}>Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
