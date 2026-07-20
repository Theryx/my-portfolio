import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Code2, LayoutList } from 'lucide-react';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { ImageField, JsonBlocksEditor } from './fields';
import type { ProjectBlock } from '../../lib/api';

/* Visual editor for a project's content_blocks. Edits the same array the JSON
   editor produces; a mode toggle lets power users drop into raw JSON. */

const ICON_OPTIONS = ['', 'users', 'clipboard', 'target', 'chart', 'shield', 'file', 'award', 'sparkles', 'rocket', 'line', 'layers', 'branch', 'message'];

const BLOCK_TYPES: { type: ProjectBlock['type']; label: string }[] = [
  { type: 'intro', label: 'Intro' },
  { type: 'stat-cards', label: 'Stat cards' },
  { type: 'gallery', label: 'Gallery' },
  { type: 'photos', label: 'Photos' },
  { type: 'richtext', label: 'Rich text' },
];

function newBlock(type: ProjectBlock['type']): ProjectBlock {
  switch (type) {
    case 'intro': return { type, heading: '', text: '' };
    case 'stat-cards': return { type, cards: [{ title: '', text: '' }] };
    case 'gallery': return { type, heading: '', items: [{ image: '', title: '', description: '' }] };
    case 'photos': return { type, heading: '', items: [{ image: '', caption: '' }] };
    case 'richtext': return { type, markdown: '' };
  }
}

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(128,128,128,0.25)', borderRadius: 10, padding: 14, marginBottom: 12,
};
const rowStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' };

export function BlockBuilder({ value, onChange }: {
  value: ProjectBlock[] | undefined;
  onChange: (v: ProjectBlock[] | undefined) => void;
}) {
  const blocks: ProjectBlock[] = Array.isArray(value) ? value : [];
  const [mode, setMode] = useState<'visual' | 'json'>('visual');
  const [jsonKey, setJsonKey] = useState(0);

  const commit = (next: ProjectBlock[]) => onChange(next.length ? next : undefined);
  const patchBlock = (i: number, patch: Record<string, unknown>) =>
    commit(blocks.map((b, idx) => (idx === i ? ({ ...b, ...patch } as ProjectBlock) : b)));
  const moveBlock = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const n = [...blocks];
    [n[i], n[j]] = [n[j], n[i]];
    commit(n);
  };
  const removeBlock = (i: number) => commit(blocks.filter((_, idx) => idx !== i));
  const addBlock = (type: ProjectBlock['type']) => commit([...blocks, newBlock(type)]);

  // sub-array (cards / items) helpers
  const patchList = (bi: number, key: 'cards' | 'items', list: unknown[]) => patchBlock(bi, { [key]: list });
  const updateItem = (bi: number, key: 'cards' | 'items', ii: number, patch: Record<string, unknown>, list: Record<string, unknown>[]) =>
    patchList(bi, key, list.map((it, idx) => (idx === ii ? { ...it, ...patch } : it)));
  const moveItem = (bi: number, key: 'cards' | 'items', ii: number, dir: -1 | 1, list: unknown[]) => {
    const j = ii + dir;
    if (j < 0 || j >= list.length) return;
    const n = [...list];
    [n[ii], n[j]] = [n[j], n[ii]];
    patchList(bi, key, n);
  };
  const removeItem = (bi: number, key: 'cards' | 'items', ii: number, list: unknown[]) => patchList(bi, key, list.filter((_, idx) => idx !== ii));

  if (mode === 'json') {
    return (
      <div>
        <ModeToggle mode={mode} onVisual={() => setMode('visual')} onJson={() => { setJsonKey((k) => k + 1); setMode('json'); }} />
        <JsonBlocksEditor
          key={jsonKey}
          label="Content blocks (raw JSON)"
          value={blocks}
          onChange={(v) => commit((v as ProjectBlock[]) ?? [])}
          hint="Advanced. Switch back to Visual to use the form editor."
        />
      </div>
    );
  }

  return (
    <div>
      <ModeToggle mode={mode} onVisual={() => setMode('visual')} onJson={() => { setJsonKey((k) => k + 1); setMode('json'); }} />

      {blocks.length === 0 && <p className="cms-field__hint">No sections yet. Add one below.</p>}

      {blocks.map((block, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ ...rowStyle, marginBottom: 10 }}>
            <strong style={{ textTransform: 'capitalize' }}>{block.type.replace('-', ' ')}</strong>
            <span style={{ display: 'flex', gap: 4 }}>
              <button type="button" className="cms-icon-btn" onClick={() => moveBlock(i, -1)} disabled={i === 0} aria-label="Move up"><ChevronUp size={15} /></button>
              <button type="button" className="cms-icon-btn" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} aria-label="Move down"><ChevronDown size={15} /></button>
              <button type="button" className="cms-icon-btn" onClick={() => removeBlock(i)} aria-label="Delete section"><Trash2 size={15} /></button>
            </span>
          </div>
          {renderBlockEditor(block, i)}
        </div>
      ))}

      <div className="cms-field__row" style={{ flexWrap: 'wrap' }}>
        <span className="cms-field__hint" style={{ marginRight: 4 }}>Add section:</span>
        {BLOCK_TYPES.map((t) => (
          <button key={t.type} type="button" className="cms-btn cms-btn--ghost" onClick={() => addBlock(t.type)}>
            <Plus size={13} /> {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  function renderBlockEditor(block: ProjectBlock, i: number) {
    switch (block.type) {
      case 'intro':
        return (
          <>
            <TextField label="Eyebrow (small label)" value={block.eyebrow || ''} onChange={(v) => patchBlock(i, { eyebrow: v })} />
            <TextField label="Heading" value={block.heading} onChange={(v) => patchBlock(i, { heading: v })} />
            <TextArea label="Text" value={block.text || ''} onChange={(v) => patchBlock(i, { text: v })} />
          </>
        );
      case 'richtext':
        return <MarkdownEditor label="Markdown" value={block.markdown} onChange={(v) => patchBlock(i, { markdown: v })} rows={8} />;
      case 'stat-cards': {
        const cards = block.cards as unknown as Record<string, unknown>[];
        return (
          <>
            <label className="cms-check">
              <input type="checkbox" checked={block.variant === 'artifacts'} onChange={(e) => patchBlock(i, { variant: e.target.checked ? 'artifacts' : undefined })} />
              Artifacts variant (wider grid, for placeholder cards)
            </label>
            {cards.map((c, ci) => (
              <div key={ci} style={{ ...cardStyle, marginTop: 10, background: 'rgba(128,128,128,0.05)' }}>
                <ItemHeader label={`Card ${ci + 1}`} onUp={() => moveItem(i, 'cards', ci, -1, cards)} onDown={() => moveItem(i, 'cards', ci, 1, cards)} onDelete={() => removeItem(i, 'cards', ci, cards)} upDisabled={ci === 0} downDisabled={ci === cards.length - 1} />
                <IconSelect value={(c.icon as string) || ''} onChange={(v) => updateItem(i, 'cards', ci, { icon: v || undefined }, cards)} />
                <TextField label="Title" value={(c.title as string) || ''} onChange={(v) => updateItem(i, 'cards', ci, { title: v }, cards)} />
                <TextArea label="Text" value={(c.text as string) || ''} onChange={(v) => updateItem(i, 'cards', ci, { text: v }, cards)} />
                <TextField label="Note (italic caption, optional)" value={(c.note as string) || ''} onChange={(v) => updateItem(i, 'cards', ci, { note: v || undefined }, cards)} />
              </div>
            ))}
            <button type="button" className="cms-btn cms-btn--ghost" onClick={() => patchList(i, 'cards', [...cards, { title: '', text: '' }])}><Plus size={13} /> Add card</button>
          </>
        );
      }
      case 'gallery':
      case 'photos': {
        const items = block.items as unknown as Record<string, unknown>[];
        const isGallery = block.type === 'gallery';
        return (
          <>
            {isGallery && <TextField label="Eyebrow" value={(block as { eyebrow?: string }).eyebrow || ''} onChange={(v) => patchBlock(i, { eyebrow: v || undefined })} />}
            <TextField label="Heading" value={block.heading || ''} onChange={(v) => patchBlock(i, { heading: v || undefined })} />
            <TextArea label="Text" value={block.text || ''} onChange={(v) => patchBlock(i, { text: v || undefined })} />
            {items.map((it, ii) => (
              <div key={ii} style={{ ...cardStyle, marginTop: 10, background: 'rgba(128,128,128,0.05)' }}>
                <ItemHeader label={`Item ${ii + 1}`} onUp={() => moveItem(i, 'items', ii, -1, items)} onDown={() => moveItem(i, 'items', ii, 1, items)} onDelete={() => removeItem(i, 'items', ii, items)} upDisabled={ii === 0} downDisabled={ii === items.length - 1} />
                <ImageField label="Image" value={(it.image as string) || ''} onChange={(v) => updateItem(i, 'items', ii, { image: v }, items)} hint="Cloudinary URL or bundled filename." />
                {isGallery ? (
                  <>
                    <TextField label="Title" value={(it.title as string) || ''} onChange={(v) => updateItem(i, 'items', ii, { title: v || undefined }, items)} />
                    <TextArea label="Description" value={(it.description as string) || ''} onChange={(v) => updateItem(i, 'items', ii, { description: v || undefined }, items)} />
                  </>
                ) : (
                  <TextField label="Caption" value={(it.caption as string) || ''} onChange={(v) => updateItem(i, 'items', ii, { caption: v || undefined }, items)} />
                )}
              </div>
            ))}
            <button type="button" className="cms-btn cms-btn--ghost" onClick={() => patchList(i, 'items', [...items, isGallery ? { image: '', title: '', description: '' } : { image: '', caption: '' }])}><Plus size={13} /> Add item</button>
          </>
        );
      }
      default:
        return null;
    }
  }
}

function ModeToggle({ mode, onVisual, onJson }: { mode: 'visual' | 'json'; onVisual: () => void; onJson: () => void }) {
  return (
    <div className="cms-field__row" style={{ marginBottom: 10 }}>
      <button type="button" className={`cms-btn ${mode === 'visual' ? 'cms-btn--primary' : 'cms-btn--ghost'}`} onClick={onVisual}><LayoutList size={13} /> Visual</button>
      <button type="button" className={`cms-btn ${mode === 'json' ? 'cms-btn--primary' : 'cms-btn--ghost'}`} onClick={onJson}><Code2 size={13} /> JSON</button>
    </div>
  );
}

function ItemHeader({ label, onUp, onDown, onDelete, upDisabled, downDisabled }: {
  label: string; onUp: () => void; onDown: () => void; onDelete: () => void; upDisabled: boolean; downDisabled: boolean;
}) {
  return (
    <div style={{ ...rowStyle, marginBottom: 8 }}>
      <span className="cms-field__hint">{label}</span>
      <span style={{ display: 'flex', gap: 4 }}>
        <button type="button" className="cms-icon-btn" onClick={onUp} disabled={upDisabled} aria-label="Move up"><ChevronUp size={14} /></button>
        <button type="button" className="cms-icon-btn" onClick={onDown} disabled={downDisabled} aria-label="Move down"><ChevronDown size={14} /></button>
        <button type="button" className="cms-icon-btn" onClick={onDelete} aria-label="Delete"><Trash2 size={14} /></button>
      </span>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="cms-field">
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="cms-field">
      <label>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
    </div>
  );
}

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="cms-field">
      <label>Icon</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o || '(none)'}</option>)}
      </select>
    </div>
  );
}
