import {
  FolderKanban, Newspaper, Briefcase, GraduationCap, Sparkles, MessageSquareQuote,
  FlaskConical, UserRound, StickyNote, AtSign, Shapes, type LucideIcon,
} from 'lucide-react';

/* What each warehouse entry type holds. Structured fields live in the entry's
   metadata; anything not listed here is kept and shown as "Other metadata". */

export type MetaKind = 'text' | 'textarea' | 'url' | 'image' | 'list' | 'date';

export interface MetaField {
  key: string;
  label: string;
  kind: MetaKind;
  hint?: string;
  placeholder?: string;
  half?: boolean;
}

export interface EntryType {
  type: string;
  label: string;
  plural: string;
  icon: LucideIcon;
  description: string;
  fields: MetaField[];
  /** Label for the markdown body, or null when the type has no body. */
  contentLabel: string | null;
  contentHint?: string;
  /** Case-study sections (content_blocks). */
  blocks?: boolean;
  /** Metadata key holding the cover image, for list thumbnails. */
  imageKey?: string;
  /** Read by the tailored-portfolio skill when judging fit. */
  core?: boolean;
}

const period: MetaField = { key: 'period', label: 'Period', kind: 'text', placeholder: 'e.g. Nov 2022 - Aug 2026', half: true };
const location: MetaField = { key: 'location', label: 'Location', kind: 'text', placeholder: 'e.g. Douala, Cameroon', half: true };

export const ENTRY_TYPES: EntryType[] = [
  {
    type: 'project', label: 'Project', plural: 'Projects', icon: FolderKanban, core: true,
    description: 'A case study: what you did, for whom, and what changed.',
    imageKey: 'image', blocks: true,
    contentLabel: 'Long-form write-up', contentHint: 'Optional Markdown shown below the sections. Most case studies use sections only.',
    fields: [
      { key: 'tagline', label: 'Tagline', kind: 'text', hint: 'One line shown on project cards.' },
      { key: 'tag', label: 'Category', kind: 'text', placeholder: 'e.g. Fintech · Product design', half: true },
      { key: 'role', label: 'Your role', kind: 'text', placeholder: 'e.g. UX Design Lead', half: true },
      period,
      location,
      { key: 'site', label: 'Live site', kind: 'url', placeholder: 'https://…', half: true },
      { key: 'impact', label: 'Impact', kind: 'text', hint: 'One line, the outcome in numbers if you have them.', half: true },
      { key: 'description', label: 'Summary', kind: 'textarea', hint: 'A short paragraph used on cards and as the intro.' },
      { key: 'image', label: 'Cover image', kind: 'image' },
      { key: 'responsibilities', label: 'Responsibilities', kind: 'list', placeholder: 'Add a responsibility and press Enter' },
    ],
  },
  {
    type: 'experience', label: 'Experience', plural: 'Experience', icon: Briefcase, core: true,
    description: 'A role you held: the organisation, your title and what you were responsible for.',
    contentLabel: 'What you did', contentHint: 'The scope, the decisions and the results. Plain facts the AI can reuse.',
    fields: [
      { key: 'organisation', label: 'Organisation', kind: 'text', half: true },
      { key: 'role', label: 'Title', kind: 'text', half: true },
      period,
      location,
      { key: 'site', label: 'Website', kind: 'url', half: true },
      { key: 'highlights', label: 'Highlights', kind: 'list', placeholder: 'Add a result and press Enter' },
    ],
  },
  {
    type: 'skill', label: 'Skill', plural: 'Skills', icon: Sparkles, core: true,
    description: 'A skill or tool, with where you used it.',
    contentLabel: 'Evidence', contentHint: 'Where you used it and what came of it.',
    fields: [
      { key: 'category', label: 'Category', kind: 'text', placeholder: 'e.g. Research, Tools, Leadership', half: true },
      { key: 'level', label: 'Level', kind: 'text', placeholder: 'e.g. Daily use, 4 years', half: true },
    ],
  },
  {
    type: 'education', label: 'Education', plural: 'Education', icon: GraduationCap, core: true,
    description: 'A degree, course or certification.',
    contentLabel: 'Notes', contentHint: 'Optional.',
    fields: [
      { key: 'school', label: 'School or issuer', kind: 'text', half: true },
      { key: 'degree', label: 'Degree or certificate', kind: 'text', half: true },
      period,
      { key: 'credential_url', label: 'Credential link', kind: 'url', half: true },
    ],
  },
  {
    type: 'research', label: 'Research', plural: 'Research & talks', icon: FlaskConical, core: true,
    description: 'A study, report or talk you led or gave.',
    imageKey: 'image',
    contentLabel: 'Summary', contentHint: 'The question, the method and what you found.',
    fields: [
      { key: 'venue', label: 'Venue or publisher', kind: 'text', placeholder: 'e.g. DevFest Douala', half: true },
      period,
      { key: 'link', label: 'Link', kind: 'url', half: true },
      { key: 'image', label: 'Image', kind: 'image' },
    ],
  },
  {
    type: 'testimonial', label: 'Testimonial', plural: 'Testimonials', icon: MessageSquareQuote, core: true,
    description: 'Something a colleague, client or manager said about your work.',
    imageKey: 'image',
    contentLabel: 'Quote', contentHint: 'Their words, exactly as given.',
    fields: [
      { key: 'author', label: 'Who said it', kind: 'text', half: true },
      { key: 'author_role', label: 'Their role', kind: 'text', placeholder: 'e.g. CTO, PaySika', half: true },
      { key: 'image', label: 'Photo', kind: 'image' },
    ],
  },
  {
    type: 'article', label: 'Article', plural: 'Articles', icon: Newspaper,
    description: 'A blog post or essay.',
    imageKey: 'image',
    contentLabel: 'Article', contentHint: 'Markdown. The read time is worked out for you.',
    fields: [
      { key: 'excerpt', label: 'Excerpt', kind: 'textarea', hint: 'Short summary shown in the blog list.' },
      { key: 'date', label: 'Date', kind: 'text', placeholder: 'e.g. June 30, 2026', half: true },
      { key: 'author', label: 'Author', kind: 'text', half: true },
      { key: 'image', label: 'Cover image', kind: 'image' },
    ],
  },
  {
    type: 'bio', label: 'Bio', plural: 'Bios', icon: UserRound,
    description: 'A version of your bio.',
    contentLabel: 'Bio', fields: [],
  },
  {
    type: 'note', label: 'Note', plural: 'Notes', icon: StickyNote,
    description: 'Anything else worth remembering: job targets, preferences, context for the AI.',
    contentLabel: 'Note', fields: [],
  },
  {
    type: 'contact', label: 'Contact', plural: 'Contacts', icon: AtSign,
    description: 'A way to reach you.',
    contentLabel: 'Details', fields: [
      { key: 'kind', label: 'Kind', kind: 'text', placeholder: 'e.g. email, LinkedIn', half: true },
      { key: 'value', label: 'Value', kind: 'text', half: true },
    ],
  },
  {
    type: 'custom', label: 'Custom', plural: 'Custom', icon: Shapes,
    description: 'An entry that fits nowhere else.',
    contentLabel: 'Content', fields: [],
  },
];

export const TYPE_BY_ID: Record<string, EntryType> = Object.fromEntries(ENTRY_TYPES.map((t) => [t.type, t]));

export function typeOf(type: string): EntryType {
  return TYPE_BY_ID[type] ?? { ...TYPE_BY_ID.custom, type, label: type, plural: type };
}

/** Metadata keys handled by the structured form for a type (plus internals). */
export function knownKeys(type: string): Set<string> {
  const t = typeOf(type);
  const keys = new Set(t.fields.map((f) => f.key));
  if (t.blocks) keys.add('content_blocks');
  if (type === 'article') keys.add('read_time');
  // Older case-study fields, edited in their own group on projects.
  if (type === 'project') ['challenge', 'challenge_text', 'solution', 'solution_text', 'result', 'result_text'].forEach((k) => keys.add(k));
  return keys;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const ENTRY_ID_RE = /^[a-zA-Z0-9_:-]{1,120}$/;

// ~200 words a minute, ignoring Markdown and HTML syntax.
export function estimateReadTime(content: string): string {
  const words = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~[\]()!-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function relativeDate(iso?: string | null): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
