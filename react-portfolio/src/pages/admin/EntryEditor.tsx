import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Trash2, X, Info } from 'lucide-react';
import {
  upsertWarehouseEntry, deleteWarehouseEntry,
  type WarehouseEntry, type Company, type CompanyLink, type ProjectBlock, type Asset,
} from '../../lib/api';
import {
  Section, Disclosure, TextInput, TextArea, MarkdownInput, TagInput, Switch, NumberInput,
  PageHead, SaveBar, Pill, MediaImage,
} from './ui';
import { ConfirmDialog } from './dialogs';
import AssetPicker, { ImageInput, loadAssets } from './AssetPicker';
import { BlockBuilder } from './BlockBuilder';
import { typeOf, knownKeys, slugify, ENTRY_ID_RE, estimateReadTime, type MetaField } from './entryTypes';
import { isApplication, type Toast } from './data';
import { useUnsavedGuard } from './route';

type Meta = Record<string, unknown>;

interface Draft {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  is_hidden: boolean;
  sort_order: number;
  meta: Meta;
  otherText: string;
  links: CompanyLink[];
  asset_ids: string[];
}

function toDraft(e: WarehouseEntry): Draft {
  const known = knownKeys(e.type);
  const other = Object.fromEntries(Object.entries(e.metadata ?? {}).filter(([k]) => !known.has(k)));
  return {
    id: e.id,
    type: e.type,
    title: e.title ?? '',
    content: e.content ?? '',
    tags: [...(e.tags ?? [])],
    is_hidden: !!e.is_hidden,
    sort_order: e.sort_order ?? 0,
    meta: Object.fromEntries(Object.entries(e.metadata ?? {}).filter(([k]) => known.has(k))),
    otherText: Object.keys(other).length ? JSON.stringify(other, null, 2) : '',
    links: (e.company_links ?? []).map((l) => ({ ...l })),
    asset_ids: [...(e.asset_ids ?? [])],
  };
}

function blankEntry(type: string): WarehouseEntry {
  return { id: '', type, title: '', content: '', metadata: {}, tags: [], is_hidden: false, sort_order: 0, company_links: [], asset_ids: [] };
}

export default function EntryEditor({ entry, newType, companies, onBack, onSaved, onDeleted, toast }: {
  entry: WarehouseEntry | null;
  newType?: string;
  companies: Company[];
  onBack: () => void;
  onSaved: (e: WarehouseEntry, wasNew: boolean) => void;
  onDeleted: (id: string) => void;
  toast: Toast;
}) {
  const isNew = !entry;
  const initial = useMemo(() => toDraft(entry ?? blankEntry(newType || 'project')), [entry, newType]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [idEdited, setIdEdited] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [otherError, setOtherError] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  useUnsavedGuard(dirty && !saving);

  const t = typeOf(draft.type);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const setMeta = (k: string, v: unknown) => setDraft((d) => {
    const meta = { ...d.meta };
    if (v === '' || v === undefined || (Array.isArray(v) && v.length === 0)) delete meta[k];
    else meta[k] = v;
    return { ...d, meta };
  });

  const setTitle = (title: string) => setDraft((d) => ({
    ...d,
    title,
    id: isNew && !idEdited ? (slugify(title) ? `${d.type}:${slugify(title)}` : '') : d.id,
  }));

  const save = async () => {
    if (!draft.title.trim()) { toast('Give the entry a title first.', 'error'); return; }
    if (!ENTRY_ID_RE.test(draft.id)) { toast('The id may use letters, numbers, ":", "-" and "_" only.', 'error'); return; }
    let other: Meta = {};
    if (draft.otherText.trim()) {
      try {
        const parsed = JSON.parse(draft.otherText);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('must be an object');
        other = parsed;
        setOtherError(null);
      } catch (e) {
        setOtherError(`Other metadata is not valid JSON: ${(e as Error).message}`);
        return;
      }
    }
    const metadata: Meta = { ...other, ...draft.meta };
    if (draft.type === 'article') metadata.read_time = estimateReadTime(draft.content);
    setSaving(true);
    try {
      const saved = await upsertWarehouseEntry({
        id: draft.id,
        type: draft.type,
        title: draft.title.trim(),
        content: draft.content,
        metadata,
        tags: draft.tags,
        is_hidden: draft.is_hidden,
        sort_order: draft.sort_order,
        company_links: draft.links,
        asset_ids: draft.asset_ids,
      });
      toast(isNew ? 'Entry created' : 'Changes saved', 'success');
      onSaved(saved, isNew);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setConfirmDelete(false);
    try {
      await deleteWarehouseEntry(draft.id);
      toast('Entry deleted', 'success');
      onDeleted(draft.id);
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const Icon = t.icon;
  const halfFields = t.fields.filter((f) => f.half);
  const fullFields = t.fields.filter((f) => !f.half && f.kind !== 'image' && f.kind !== 'list');
  const imageFields = t.fields.filter((f) => f.kind === 'image');
  const listFields = t.fields.filter((f) => f.kind === 'list');

  return (
    <>
      <PageHead
        crumb={<button type="button" className="cms-crumb" onClick={onBack}><ArrowLeft size={14} /> Library</button>}
        title={draft.title || (isNew ? `New ${t.label.toLowerCase()}` : 'Untitled')}
        sub={<span className="cms-row" style={{ gap: 6 }}><Icon size={14} aria-hidden="true" /> {t.label}{draft.id && <> <span className="cms-dotsep" /> <code>{draft.id}</code></>}</span>}
      />

      <div className="cms-editor">
        <div className="cms-stack">
          <Section title="Basics">
            <TextInput label="Title" value={draft.title} onChange={setTitle} required />
            {fullFields.map((f) => <MetaInput key={f.key} field={f} value={draft.meta[f.key]} onChange={(v) => setMeta(f.key, v)} />)}
            {halfFields.length > 0 && (
              <div className="cms-grid-2">
                {halfFields.map((f) => <MetaInput key={f.key} field={f} value={draft.meta[f.key]} onChange={(v) => setMeta(f.key, v)} />)}
              </div>
            )}
            {imageFields.map((f) => <MetaInput key={f.key} field={f} value={draft.meta[f.key]} onChange={(v) => setMeta(f.key, v)} />)}
            {listFields.map((f) => <MetaInput key={f.key} field={f} value={draft.meta[f.key]} onChange={(v) => setMeta(f.key, v)} />)}
          </Section>

          {t.blocks && (
            <Section title="Case study sections" description="The sections every site renders, in order. Company sites can override them per application.">
              <BlockBuilder
                value={draft.meta.content_blocks as ProjectBlock[] | undefined}
                onChange={(v) => setMeta('content_blocks', v)}
              />
            </Section>
          )}

          {t.contentLabel && (
            <Section title={t.contentLabel} description={t.contentHint}>
              <MarkdownInput
                label={t.contentLabel}
                value={draft.content}
                onChange={(v) => set('content', v)}
                rows={draft.type === 'article' || draft.type === 'project' ? 16 : 8}
                hint={draft.type === 'article' ? estimateReadTime(draft.content) : undefined}
              />
            </Section>
          )}

          {draft.type === 'project' && (
            <Disclosure title="Challenge, solution and result (older format)">
              <p className="cms-field__hint">Used by older case-study layouts. Leave empty if the sections above tell the story.</p>
              {(['challenge', 'solution', 'result'] as const).map((k) => (
                <div key={k} className="cms-stack" style={{ gap: 10 }}>
                  <TextInput label={`${k[0].toUpperCase()}${k.slice(1)} heading`} optional value={String(draft.meta[k] ?? '')} onChange={(v) => setMeta(k, v)} />
                  <TextArea label={`${k[0].toUpperCase()}${k.slice(1)} text`} optional value={String(draft.meta[`${k}_text`] ?? '')} onChange={(v) => setMeta(`${k}_text`, v)} rows={3} />
                </div>
              ))}
            </Disclosure>
          )}
        </div>

        <aside className="cms-editor__side" aria-label="Entry settings">
          <Section title="Visibility">
            <Switch
              label="Visible"
              description={draft.is_hidden ? 'Hidden everywhere, on every site.' : 'Shown on every site it is linked to.'}
              checked={!draft.is_hidden}
              onChange={(v) => set('is_hidden', !v)}
            />
          </Section>

          <SitesPicker companies={companies} links={draft.links} onChange={(links) => set('links', links)} />

          <AttachedAssets ids={draft.asset_ids} onChange={(ids) => set('asset_ids', ids)} />

          <Disclosure title="Advanced">
            <TextInput
              label="Id"
              mono
              value={draft.id}
              disabled={!isNew}
              onChange={(v) => { setIdEdited(true); set('id', v); }}
              hint={isNew ? 'Made from the type and title. It cannot change after the first save.' : 'Fixed after creation, it is part of shared links.'}
            />
            <TagInput label="Tags" values={draft.tags} onChange={(v) => set('tags', v)} />
            <NumberInput label="Default order" value={draft.sort_order} onChange={(v) => set('sort_order', v ?? 0)} hint="Lower numbers come first when a site has no order of its own." />
            <TextArea
              label="Other metadata"
              optional
              mono
              rows={6}
              value={draft.otherText}
              onChange={(v) => set('otherText', v)}
              error={otherError}
              hint="JSON for fields the form above doesn't cover. Kept as is on save."
            />
          </Disclosure>

          {!isNew && (
            <button type="button" className="cms-btn cms-btn--ghost cms-btn--danger-quiet" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={14} /> Delete entry
            </button>
          )}
        </aside>
      </div>

      <SaveBar dirty={dirty || isNew} saving={saving} onSave={save} onCancel={onBack} saveLabel={isNew ? 'Create entry' : 'Save changes'} />

      {confirmDelete && (
        <ConfirmDialog title="Delete this entry?" confirmLabel="Delete" danger onConfirm={remove} onCancel={() => setConfirmDelete(false)}>
          <p>"{draft.title}" is removed from the Library and from every site that shows it. This cannot be undone.</p>
        </ConfirmDialog>
      )}
    </>
  );
}

function MetaInput({ field, value, onChange }: { field: MetaField; value: unknown; onChange: (v: unknown) => void }) {
  const str = typeof value === 'string' ? value : '';
  const common = { label: field.label, hint: field.hint, optional: true };
  switch (field.kind) {
    case 'textarea': return <TextArea {...common} value={str} onChange={onChange} placeholder={field.placeholder} rows={3} />;
    case 'image': return <ImageInput {...common} value={str} onChange={onChange} />;
    case 'list': return <TagInput {...common} values={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={field.placeholder} />;
    case 'url': return <TextInput {...common} type="url" value={str} onChange={onChange} placeholder={field.placeholder ?? 'https://…'} />;
    default: return <TextInput {...common} value={str} onChange={onChange} placeholder={field.placeholder} />;
  }
}

/* Which sites show this entry, with per-site order, visibility and text. */
function SitesPicker({ companies, links, onChange }: {
  companies: Company[];
  links: CompanyLink[];
  onChange: (links: CompanyLink[]) => void;
}) {
  const byId = new Map(links.map((l) => [l.company_id, l]));
  const groups = [
    { label: 'Applications', list: companies.filter(isApplication) },
    { label: 'Main site', list: companies.filter((c) => !isApplication(c)) },
  ].filter((g) => g.list.length);

  const toggle = (c: Company, on: boolean) => onChange(on
    ? [...links, { company_id: c.id, sort_order: links.length, is_visible: true, override_content: null, override_metadata: null }]
    : links.filter((l) => l.company_id !== c.id));
  const patch = (id: string, p: Partial<CompanyLink>) => onChange(links.map((l) => (l.company_id === id ? { ...l, ...p } : l)));

  return (
    <Section title="Shown on" description={links.length ? `${links.length} site${links.length === 1 ? '' : 's'}` : 'Not on any site yet.'}>
      {groups.map((g) => (
        <div key={g.label} className="cms-stack" style={{ gap: 6 }}>
          <span className="cms-nav__group" style={{ margin: 0 }}>{g.label}</span>
          <div className="cms-links">
            {g.list.map((c) => {
              const link = byId.get(c.id);
              return (
                <div key={c.id} className={`cms-link${link ? ' cms-link--on' : ''}`}>
                  <div className="cms-link__head">
                    <label className="cms-checkbox cms-link__name">
                      <input type="checkbox" checked={!!link} onChange={(e) => toggle(c, e.target.checked)} />
                      {c.name || c.id}
                    </label>
                    {link && !link.is_visible && <Pill tone="amber" plain>Hidden here</Pill>}
                    {link?.override_metadata && <Pill tone="violet" plain>Custom story</Pill>}
                  </div>
                  {link && (
                    <div className="cms-link__body">
                      <div className="cms-row">
                        <Switch label="Show on this site" checked={link.is_visible} onChange={(v) => patch(c.id, { is_visible: v })} />
                      </div>
                      <NumberInput label="Order on this site" value={link.sort_order} onChange={(v) => patch(c.id, { sort_order: v ?? 0 })} />
                      <details>
                        <summary className="cms-field__hint" style={{ cursor: 'pointer' }}>Text for this site only</summary>
                        <div style={{ marginTop: 8 }}>
                          <TextArea
                            label="Replacement text"
                            optional
                            rows={4}
                            value={link.override_content ?? ''}
                            onChange={(v) => patch(c.id, { override_content: v.trim() ? v : null })}
                            hint="Leave empty to use the entry's own text."
                          />
                        </div>
                      </details>
                      {link.override_metadata && (
                        <p className="cms-field__hint" style={{ display: 'flex', gap: 6 }}>
                          <Info size={13} style={{ flex: 'none', marginTop: 2 }} aria-hidden="true" />
                          This site has its own story and fields for this entry. They are kept when you save.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {companies.length === 0 && <p className="cms-field__hint">No sites yet.</p>}
    </Section>
  );
}

function AttachedAssets({ ids, onChange }: { ids: string[]; onChange: (ids: string[]) => void }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [picking, setPicking] = useState(false);
  useEffect(() => {
    let live = true;
    loadAssets().then((a) => live && setAssets(a)).catch(() => undefined);
    return () => { live = false; };
  }, []);
  const attached = ids.map((id) => assets.find((a) => a.id === id)).filter(Boolean) as Asset[];

  return (
    <Section
      title="Images"
      description="Files from the asset library that belong to this entry."
      actions={<button type="button" className="cms-btn cms-btn--sm" onClick={() => setPicking(true)}><Plus size={13} /> Add</button>}
    >
      {attached.length === 0 ? (
        <p className="cms-field__hint">None attached.</p>
      ) : (
        <div className="cms-attached">
          {attached.map((a) => (
            <div key={a.id} className="cms-attached__item" title={a.description || a.filename}>
              <MediaImage src={a.url || a.filename} alt={a.description ?? ''} />
              <button type="button" onClick={() => onChange(ids.filter((x) => x !== a.id))} aria-label={`Detach ${a.filename}`}><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
      {picking && (
        <AssetPicker
          title="Attach images"
          multiple
          selected={ids}
          onClose={() => setPicking(false)}
          onConfirm={(picked) => { onChange(picked.map((a) => a.id)); setPicking(false); }}
        />
      )}
    </Section>
  );
}
