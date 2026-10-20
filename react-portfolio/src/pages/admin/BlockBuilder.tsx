import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Code2, LayoutList, Copy } from 'lucide-react';
import type { ProjectBlock } from '../../lib/api';
import { TextArea, TextInput, SelectInput, MarkdownInput, Switch } from './ui';
import { ImageInput } from './AssetPicker';

/* Visual editor for a case study's content_blocks: the ordered sections every
   portfolio site renders. Each block type is described by a small schema, so
   all eleven types get a real form. A JSON mode stays available for anything
   the forms don't cover. */

type Kind = 'text' | 'textarea' | 'markdown' | 'image' | 'url' | 'icon' | 'side';
interface FieldDef { key: string; label: string; kind: Kind; optional?: boolean; hint?: string }
interface ListDef { key: 'items' | 'cards'; label: string; fields: FieldDef[]; blank: Record<string, unknown> }
interface BlockDef { type: ProjectBlock['type']; label: string; description: string; fields: FieldDef[]; list?: ListDef; flags?: { key: string; label: string; on: unknown }[] }

const ICONS = ['', 'users', 'clipboard', 'target', 'chart', 'shield', 'file', 'award', 'sparkles', 'rocket', 'line', 'layers', 'branch', 'message', 'route'];

const eyebrow: FieldDef = { key: 'eyebrow', label: 'Eyebrow', kind: 'text', optional: true, hint: 'Small label above the heading.' };
const heading: FieldDef = { key: 'heading', label: 'Heading', kind: 'text', optional: true };
const text: FieldDef = { key: 'text', label: 'Text', kind: 'textarea', optional: true };

const BLOCKS: BlockDef[] = [
  { type: 'intro', label: 'Intro', description: 'Opening heading and paragraph.', fields: [eyebrow, { ...heading, optional: false }, text] },
  {
    type: 'metrics', label: 'Metrics', description: 'Headline numbers with labels.', fields: [heading, text],
    list: { key: 'items', label: 'Metric', blank: { value: '', label: '' }, fields: [
      { key: 'value', label: 'Value', kind: 'text', hint: 'e.g. 40% or 30 to 10' },
      { key: 'label', label: 'Label', kind: 'text' },
      { key: 'note', label: 'Note', kind: 'text', optional: true },
    ] },
  },
  {
    type: 'stat-cards', label: 'Cards', description: 'Short cards with an icon, title and text.', fields: [],
    flags: [{ key: 'variant', label: 'Artifacts variant (wider grid for placeholder cards)', on: 'artifacts' }],
    list: { key: 'cards', label: 'Card', blank: { title: '', text: '' }, fields: [
      { key: 'icon', label: 'Icon', kind: 'icon', optional: true },
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'text', label: 'Text', kind: 'textarea', optional: true },
      { key: 'note', label: 'Note', kind: 'text', optional: true, hint: 'Small italic caption.' },
    ] },
  },
  {
    type: 'steps', label: 'Steps', description: 'A numbered sequence, optionally with images.', fields: [eyebrow, heading, text],
    list: { key: 'items', label: 'Step', blank: { title: '', text: '' }, fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'text', label: 'Text', kind: 'textarea', optional: true },
      { key: 'image', label: 'Image', kind: 'image', optional: true },
    ] },
  },
  {
    type: 'compare', label: 'Before / after', description: 'Two images side by side.', fields: [eyebrow, heading, text,
      { key: 'left', label: 'Left', kind: 'side' }, { key: 'right', label: 'Right', kind: 'side' }],
  },
  {
    type: 'two-col', label: 'Text and image', description: 'Markdown next to an image.', fields: [eyebrow, heading,
      { key: 'markdown', label: 'Text', kind: 'markdown' },
      { key: 'image', label: 'Image', kind: 'image' },
      { key: 'caption', label: 'Caption', kind: 'text', optional: true }],
    flags: [{ key: 'imageSide', label: 'Image on the left', on: 'left' }],
  },
  {
    type: 'gallery', label: 'Gallery', description: 'Images with titles and descriptions.', fields: [eyebrow, heading, text],
    list: { key: 'items', label: 'Item', blank: { image: '', title: '', description: '' }, fields: [
      { key: 'image', label: 'Image', kind: 'image' },
      { key: 'title', label: 'Title', kind: 'text', optional: true },
      { key: 'description', label: 'Description', kind: 'textarea', optional: true },
    ] },
  },
  {
    type: 'photos', label: 'Photos', description: 'Photos with captions.', fields: [heading, text],
    list: { key: 'items', label: 'Photo', blank: { image: '', caption: '' }, fields: [
      { key: 'image', label: 'Image', kind: 'image' },
      { key: 'caption', label: 'Caption', kind: 'text', optional: true },
    ] },
  },
  {
    type: 'quote', label: 'Quote', description: 'A testimonial or pull quote.', fields: [
      { key: 'text', label: 'Quote', kind: 'textarea' },
      { key: 'attribution', label: 'Who said it', kind: 'text', optional: true },
      { key: 'role', label: 'Their role', kind: 'text', optional: true },
      { key: 'image', label: 'Photo', kind: 'image', optional: true }],
  },
  {
    type: 'embed', label: 'Video / embed', description: 'A video or prototype link.', fields: [heading, text,
      { key: 'url', label: 'URL', kind: 'url', hint: 'YouTube, Vimeo, Loom or Figma link.' },
      { key: 'caption', label: 'Caption', kind: 'text', optional: true },
      { key: 'poster', label: 'Poster image', kind: 'image', optional: true }],
  },
  { type: 'richtext', label: 'Rich text', description: 'Free-form Markdown.', fields: [{ key: 'markdown', label: 'Markdown', kind: 'markdown' }] },
];

const DEF = Object.fromEntries(BLOCKS.map((b) => [b.type, b])) as Record<string, BlockDef>;

function blankBlock(def: BlockDef): ProjectBlock {
  const b: Record<string, unknown> = { type: def.type };
  for (const f of def.fields) {
    if (f.kind === 'side') b[f.key] = { label: '', image: '' };
    else if (!f.optional) b[f.key] = '';
  }
  if (def.list) b[def.list.key] = [{ ...def.list.blank }];
  return b as unknown as ProjectBlock;
}

type Obj = Record<string, unknown>;
const clean = (v: string) => (v === '' ? undefined : v);
let keySeed = 0;
const newKey = () => `b${++keySeed}`;

export function BlockBuilder({ value, onChange }: {
  value: ProjectBlock[] | undefined;
  onChange: (v: ProjectBlock[] | undefined) => void;
}) {
  const blocks = (Array.isArray(value) ? value : []) as unknown as Obj[];
  const [mode, setMode] = useState<'visual' | 'json'>('visual');
  // Stable React keys that follow blocks through moves, so open inputs keep
  // focus. Re-derived when the list changes from outside (e.g. JSON mode).
  const [keys, setKeys] = useState<string[]>(() => blocks.map(() => newKey()));
  if (keys.length !== blocks.length) setKeys(blocks.map(() => newKey()));

  const commit = (next: Obj[], nextKeys: string[]) => {
    setKeys(nextKeys);
    onChange(next.length ? (next as unknown as ProjectBlock[]) : undefined);
  };
  const patch = (i: number, p: Obj) => commit(blocks.map((b, idx) => (idx === i ? { ...b, ...p } : b)), keys);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const n = [...blocks];
    const k = [...keys];
    [n[i], n[j]] = [n[j], n[i]];
    [k[i], k[j]] = [k[j], k[i]];
    commit(n, k);
  };
  const remove = (i: number) => commit(blocks.filter((_, idx) => idx !== i), keys.filter((_, idx) => idx !== i));
  const duplicate = (i: number) => {
    const n = [...blocks];
    const k = [...keys];
    n.splice(i + 1, 0, structuredClone(blocks[i]));
    k.splice(i + 1, 0, newKey());
    commit(n, k);
  };
  const add = (def: BlockDef) => commit([...blocks, blankBlock(def) as unknown as Obj], [...keys, newKey()]);

  return (
    <div className="cms-blocks">
      <div className="cms-row cms-row--between">
        <span className="cms-field__hint">
          {blocks.length ? `${blocks.length} section${blocks.length === 1 ? '' : 's'}` : 'No sections yet'}
        </span>
        <div className="cms-segmented" role="group" aria-label="Editor mode">
          <button type="button" aria-pressed={mode === 'visual'} onClick={() => setMode('visual')}><LayoutList size={13} /> Visual</button>
          <button type="button" aria-pressed={mode === 'json'} onClick={() => setMode('json')}><Code2 size={13} /> JSON</button>
        </div>
      </div>

      {mode === 'json' ? (
        <JsonBlocks value={blocks} onChange={(v) => commit(v, v.map(() => newKey()))} />
      ) : (
        <>
          {blocks.map((block, i) => {
            const def = DEF[String(block.type)];
            return (
              <div key={keys[i] ?? i} className="cms-block">
                <div className="cms-block__head">
                  <span className="cms-block__type">
                    <span className="cms-block__index">{i + 1}</span>
                    {def?.label ?? String(block.type)}
                  </span>
                  <button type="button" className="cms-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move section ${i + 1} up`}><ChevronUp size={15} /></button>
                  <button type="button" className="cms-icon-btn" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label={`Move section ${i + 1} down`}><ChevronDown size={15} /></button>
                  <button type="button" className="cms-icon-btn" onClick={() => duplicate(i)} aria-label={`Duplicate section ${i + 1}`}><Copy size={14} /></button>
                  <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => remove(i)} aria-label={`Delete section ${i + 1}`}><Trash2 size={15} /></button>
                </div>
                <div className="cms-block__body">
                  {def ? <BlockForm def={def} block={block} onPatch={(p) => patch(i, p)} /> : (
                    <p className="cms-field__hint">Unknown section type "{String(block.type)}". Edit it in JSON mode.</p>
                  )}
                </div>
              </div>
            );
          })}
          <div className="cms-section" style={{ padding: 14, gap: 10 }}>
            <span className="cms-field__label">Add a section</span>
            <div className="cms-addmenu">
              {BLOCKS.map((def) => (
                <button key={def.type} type="button" className="cms-btn cms-btn--sm" onClick={() => add(def)} title={def.description}>
                  <Plus size={13} /> {def.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function BlockForm({ def, block, onPatch }: { def: BlockDef; block: Obj; onPatch: (p: Obj) => void }) {
  const list = def.list ? ((block[def.list.key] as Obj[] | undefined) ?? []) : [];
  const setList = (next: Obj[]) => def.list && onPatch({ [def.list.key]: next });

  return (
    <>
      {def.fields.map((f) => (
        <FieldFor key={f.key} def={f} value={block[f.key]} onChange={(v) => onPatch({ [f.key]: v })} />
      ))}
      {def.flags?.map((flag) => (
        <Switch
          key={flag.key}
          label={flag.label}
          checked={block[flag.key] === flag.on}
          onChange={(on) => onPatch({ [flag.key]: on ? flag.on : undefined })}
        />
      ))}
      {def.list && (
        <div className="cms-stack" style={{ gap: 8 }}>
          {list.map((item, ii) => (
            <div key={ii} className="cms-block__item">
              <div className="cms-block__itemhead">
                <span>{def.list!.label} {ii + 1}</span>
                <span className="cms-row" style={{ gap: 2 }}>
                  <button type="button" className="cms-icon-btn" disabled={ii === 0} aria-label={`Move ${def.list!.label.toLowerCase()} ${ii + 1} up`}
                    onClick={() => { const n = [...list]; [n[ii - 1], n[ii]] = [n[ii], n[ii - 1]]; setList(n); }}><ChevronUp size={14} /></button>
                  <button type="button" className="cms-icon-btn" disabled={ii === list.length - 1} aria-label={`Move ${def.list!.label.toLowerCase()} ${ii + 1} down`}
                    onClick={() => { const n = [...list]; [n[ii + 1], n[ii]] = [n[ii], n[ii + 1]]; setList(n); }}><ChevronDown size={14} /></button>
                  <button type="button" className="cms-icon-btn cms-icon-btn--danger" aria-label={`Remove ${def.list!.label.toLowerCase()} ${ii + 1}`}
                    onClick={() => setList(list.filter((_, idx) => idx !== ii))}><Trash2 size={14} /></button>
                </span>
              </div>
              {def.list!.fields.map((f) => (
                <FieldFor key={f.key} def={f} value={item[f.key]}
                  onChange={(v) => setList(list.map((it, idx) => (idx === ii ? { ...it, [f.key]: v } : it)))} />
              ))}
            </div>
          ))}
          <div>
            <button type="button" className="cms-btn cms-btn--sm" onClick={() => setList([...list, { ...def.list!.blank }])}>
              <Plus size={13} /> Add {def.list.label.toLowerCase()}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FieldFor({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const str = typeof value === 'string' ? value : '';
  const set = (v: string) => onChange(def.optional ? clean(v) : v);
  const common = { label: def.label, hint: def.hint, optional: def.optional };
  switch (def.kind) {
    case 'textarea': return <TextArea {...common} value={str} onChange={set} rows={3} />;
    case 'markdown': return <MarkdownInput {...common} value={str} onChange={set} rows={6} />;
    case 'image': return <ImageInput {...common} value={str} onChange={set} />;
    case 'url': return <TextInput {...common} type="url" value={str} onChange={set} placeholder="https://…" />;
    case 'icon': return <SelectInput {...common} value={str} onChange={set} options={ICONS.map((i) => ({ value: i, label: i || 'No icon' }))} />;
    case 'side': {
      const side = (value as Obj | undefined) ?? { label: '', image: '' };
      const setSide = (k: string, v: string) => onChange({ ...side, [k]: k === 'caption' ? clean(v) : v });
      return (
        <div className="cms-block__item">
          <div className="cms-block__itemhead"><span>{def.label} side</span></div>
          <TextInput label="Label" value={String(side.label ?? '')} onChange={(v) => setSide('label', v)} placeholder="e.g. Before" />
          <ImageInput label="Image" value={String(side.image ?? '')} onChange={(v) => setSide('image', v)} />
          <TextInput label="Caption" optional value={String(side.caption ?? '')} onChange={(v) => setSide('caption', v)} />
        </div>
      );
    }
    default: return <TextInput {...common} value={str} onChange={set} />;
  }
}

function JsonBlocks({ value, onChange }: { value: Obj[]; onChange: (v: Obj[]) => void }) {
  const [text, setText] = useState(() => (value.length ? JSON.stringify(value, null, 2) : '[]'));
  const [error, setError] = useState<string | null>(null);
  const handle = (t: string) => {
    setText(t);
    try {
      const parsed = JSON.parse(t || '[]');
      if (!Array.isArray(parsed)) { setError('The top level must be a list of sections: [ … ].'); return; }
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError(`Not valid JSON yet: ${(e as Error).message}`);
    }
  };
  return (
    <TextArea
      label="Sections (JSON)"
      value={text}
      onChange={handle}
      rows={18}
      mono
      error={error}
      hint="Changes apply as soon as the JSON is valid. Switch back to Visual to use the forms."
    />
  );
}
