import { useState } from 'react';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { changePassword, type Profile, type Project, type BlogPost, type ProjectBlock, type Company } from '../../lib/api';
import { PasswordInput, ImageField, ArrayEditor, FaqEditor, CheckboxGroup, SpeakingImagesEditor } from './fields';
import { BlockBuilder } from './BlockBuilder';

// The forms below each edit a slice of a company but SAVE THE WHOLE object (the
// API upserts every column, so a partial body would blank the rest). They spread
// the loaded company and override only their fields, merging social_links.

/* ─── Company (microsite) form ──────────────────────────────────────────── */

const COMPANY_STATUSES = ['draft', 'published', 'archived'];
const COMPANY_LAYOUTS = ['default', 'minimal', 'candidate-brief', 'bento'];

// Parse a JSON-object textarea into an object, returning an error message when
// the text is not a valid JSON object.
function parseJsonObject(text: string, label: string): { value?: Record<string, unknown>; error?: string } {
  if (!text.trim()) return { value: {} };
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { error: `${label} must be a JSON object.` };
    }
    return { value: parsed as Record<string, unknown> };
  } catch (e) {
    return { error: `${label} is not valid JSON: ${(e as Error).message}` };
  }
}

export function CompanyForm({ company, onSave, onCancel, saving }: {
  company: Company | null;
  onSave: (c: Partial<Company>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [id, setId] = useState(company?.id || '');
  const [name, setName] = useState(company?.name || '');
  const [slug, setSlug] = useState(company?.slug || company?.id || '');
  const [status, setStatus] = useState(company?.status || 'published');
  const [layout, setLayout] = useState(company?.layout || 'default');
  const [role, setRole] = useState(company?.role || '');
  const [isActive, setIsActive] = useState(company?.is_active ?? true);

  const [jobUrl, setJobUrl] = useState(company?.job_url || '');
  const [jobDescription, setJobDescription] = useState(company?.job_description || '');

  const [heroTitle, setHeroTitle] = useState(company?.hero_title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(company?.hero_subtitle || '');
  const [tagline, setTagline] = useState(company?.tagline || '');
  const [badges, setBadges] = useState<string[]>(company?.badges || []);

  const [philosophyTitle, setPhilosophyTitle] = useState(company?.philosophy_title || '');
  const [philosophyText, setPhilosophyText] = useState(company?.philosophy_text || '');
  const [introExpandedText, setIntroExpandedText] = useState(company?.intro_expanded_text || '');

  const [bio, setBio] = useState(company?.bio || '');
  const [about, setAboutState] = useState(company?.about_content || {});
  const setAbout = (k: string, v: unknown) => setAboutState((a) => ({ ...a, [k]: v }));

  const links = company?.social_links ?? {};
  const [email, setEmail] = useState(links.email || '');
  const [linkedin, setLinkedin] = useState(links.linkedin || '');
  const [resume, setResume] = useState(links.resume || '');
  const [projectsIntro, setProjectsIntro] = useState(links.projects_intro || '');
  const [blogIntro, setBlogIntro] = useState(links.blog_intro || '');

  const [themeText, setThemeText] = useState(() => JSON.stringify(company?.theme_config ?? {}, null, 2));
  const [seoText, setSeoText] = useState(() => JSON.stringify(company?.seo ?? {}, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const isNew = !company?.id;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const theme = parseJsonObject(themeText, 'Theme config');
    const seo = parseJsonObject(seoText, 'SEO');
    if (theme.error || seo.error) {
      setJsonError(theme.error || seo.error || null);
      return;
    }
    setJsonError(null);
    onSave({
      ...(company ?? {}),
      id,
      name,
      slug: slug || id,
      status,
      layout,
      role,
      is_active: isActive,
      job_url: jobUrl,
      job_description: jobDescription,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      tagline,
      badges,
      philosophy_title: philosophyTitle,
      philosophy_text: philosophyText,
      intro_expanded_text: introExpandedText,
      bio,
      about_content: about,
      theme_config: theme.value,
      seo: seo.value,
      social_links: {
        ...(company?.social_links ?? {}),
        email,
        linkedin,
        resume,
        projects_intro: projectsIntro,
        blog_intro: blogIntro,
      },
    });
  };

  return (
    <form className="cms-form" onSubmit={submit}>
      <fieldset className="cms-form__section">
        <legend>Identity</legend>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="cf-id">Company ID</label>
            <input id="cf-id" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. trust-wallet" required disabled={!isNew} />
            {!isNew
              ? <p className="cms-field__hint">The ID can't change once created; it's part of shared URLs.</p>
              : <p className="cms-field__hint">Lowercase letters, numbers, "-" and "_".</p>}
          </div>
          <div className="cms-field">
            <label htmlFor="cf-name">Display name</label>
            <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Trust Wallet" required />
          </div>
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="cf-slug">URL slug</label>
            <input id="cf-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. trust-wallet" />
            <p className="cms-field__hint">Public microsite: <code>/c/{slug || id || 'slug'}</code></p>
          </div>
          <div className="cms-field">
            <label htmlFor="cf-role">Target role</label>
            <input id="cf-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Design Engineer" />
          </div>
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="cf-status">Status</label>
            <select id="cf-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {COMPANY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="cms-field">
            <label htmlFor="cf-layout">Layout</label>
            <select id="cf-layout" value={layout} onChange={(e) => setLayout(e.target.value)}>
              {COMPANY_LAYOUTS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <label className="cms-check">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active: visitors landing on the site without a <code>?profile=</code> link see the first active company
        </label>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Job context</legend>
        <div className="cms-field">
          <label htmlFor="cf-job-url">Job posting URL</label>
          <input id="cf-job-url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://jobs.ashbyhq.com/…" />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-job-desc">Job description</label>
          <textarea id="cf-job-desc" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5} placeholder="Paste the role's mandate / requirements." />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Hero</legend>
        <div className="cms-field">
          <label htmlFor="cf-hero-title">Hero title</label>
          <input id="cf-hero-title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="e.g. From Figma to React Native." />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-hero-subtitle">Hero subtitle</label>
          <textarea id="cf-hero-subtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={3} />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-tagline">Tagline</label>
          <textarea id="cf-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} rows={2} />
        </div>
        <ArrayEditor label="Badges" values={badges} onChange={setBadges} placeholder="e.g. Design Systems & Tokens" />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Philosophy &amp; intro</legend>
        <div className="cms-field">
          <label htmlFor="cf-philo-title">Philosophy title</label>
          <input id="cf-philo-title" value={philosophyTitle} onChange={(e) => setPhilosophyTitle(e.target.value)} />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-philo-text">Philosophy text</label>
          <textarea id="cf-philo-text" value={philosophyText} onChange={(e) => setPhilosophyText(e.target.value)} rows={4} />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-intro-expanded">Intro expander text</label>
          <textarea id="cf-intro-expanded" value={introExpandedText} onChange={(e) => setIntroExpandedText(e.target.value)} rows={4} />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>About</legend>
        <div className="cms-field">
          <label htmlFor="cf-bio">Bio</label>
          <textarea id="cf-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="cf-location">Location</label>
            <input id="cf-location" value={about.location ?? ''} onChange={(e) => setAbout('location', e.target.value)} placeholder="e.g. Douala" />
          </div>
          <div className="cms-field">
            <label htmlFor="cf-location-label">Location caption</label>
            <input id="cf-location-label" value={about.location_label ?? ''} onChange={(e) => setAbout('location_label', e.target.value)} placeholder="e.g. Cameroon 🇨🇲" />
          </div>
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="cf-languages">Languages</label>
            <input id="cf-languages" value={about.languages ?? ''} onChange={(e) => setAbout('languages', e.target.value)} placeholder="e.g. EN & FR" />
          </div>
          <div className="cms-field">
            <label htmlFor="cf-languages-label">Languages caption</label>
            <input id="cf-languages-label" value={about.languages_label ?? ''} onChange={(e) => setAbout('languages_label', e.target.value)} placeholder="e.g. Bilingual, fully fluent" />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="cf-funfact">Fun fact</label>
          <textarea id="cf-funfact" value={about.fun_fact ?? ''} onChange={(e) => setAbout('fun_fact', e.target.value)} rows={2} />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-speaking-intro">Research &amp; speaking intro</label>
          <textarea id="cf-speaking-intro" value={about.speaking_intro ?? ''} onChange={(e) => setAbout('speaking_intro', e.target.value)} rows={4} placeholder="Wrap **text** in double asterisks for bold. Use a blank line to separate paragraphs." />
        </div>
        <SpeakingImagesEditor
          value={about.speaking_images ?? (about.speaking_image ? [about.speaking_image] : [])}
          onChange={(urls) => {
            setAbout('speaking_images', urls);
            // Keep speaking_image in sync so older consumers still get a value.
            setAbout('speaking_image', urls[0] ?? '');
          }}
        />
        <FaqEditor
          label="Frequently asked questions"
          value={about.faqs ?? []}
          onChange={(v) => setAbout('faqs', v)}
          hint="Question-and-answer pairs shown in the FAQ accordion."
        />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Contact links</legend>
        <div className="cms-field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-linkedin">LinkedIn URL</label>
          <input id="cf-linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/…" />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-resume">Résumé / CV URL</label>
          <input id="cf-resume" value={resume} onChange={(e) => setResume(e.target.value)} placeholder="https://…" />
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="cf-projects-intro">Projects page subtitle</label>
            <textarea id="cf-projects-intro" value={projectsIntro} onChange={(e) => setProjectsIntro(e.target.value)} rows={2} />
          </div>
          <div className="cms-field">
            <label htmlFor="cf-blog-intro">Blog page subtitle</label>
            <textarea id="cf-blog-intro" value={blogIntro} onChange={(e) => setBlogIntro(e.target.value)} rows={2} />
          </div>
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Advanced</legend>
        <p className="cms-field__hint">Free-form JSON merged into the microsite's theme and SEO metadata.</p>
        <div className="cms-field">
          <label htmlFor="cf-theme">Theme config (JSON)</label>
          <textarea id="cf-theme" value={themeText} onChange={(e) => setThemeText(e.target.value)} rows={5} spellCheck={false} style={{ fontFamily: 'monospace' }} />
        </div>
        <div className="cms-field">
          <label htmlFor="cf-seo">SEO (JSON)</label>
          <textarea id="cf-seo" value={seoText} onChange={(e) => setSeoText(e.target.value)} rows={5} spellCheck={false} style={{ fontFamily: 'monospace' }} />
        </div>
        {jsonError && <p className="cms-field__hint" style={{ color: 'var(--color-error, #e5484d)' }}>{jsonError}</p>}
      </fieldset>

      <div className="cms-form__actions">
        <button type="submit" disabled={saving} className="cms-btn cms-btn--primary">{saving ? 'Saving…' : 'Save company'}</button>
        <button type="button" onClick={onCancel} className="cms-btn">Cancel</button>
      </div>
    </form>
  );
}

/* ─── Project form ──────────────────────────────────────────────────────── */

export function ProjectForm({ project, profiles, onSave, onCancel, saving }: {
  project: Project | null;
  profiles: Profile[];
  onSave: (p: Partial<Project>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: project?.id || '',
    profile_ids: project?.profile_ids?.length ? project.profile_ids : (profiles[0]?.id ? [profiles[0].id] : []),
    tag: project?.tag || '',
    title: project?.title || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    impact: project?.impact || '',
    image: project?.image || '',
    site: project?.site || '',
    role: project?.role || '',
    period: project?.period || '',
    location: project?.location || '',
    responsibilities: project?.responsibilities || [],
    challenge: project?.challenge || 'The Challenge',
    challenge_text: project?.challenge_text || '',
    solution: project?.solution || 'The Solution',
    solution_text: project?.solution_text || '',
    result: project?.result || 'The Result',
    result_text: project?.result_text || '',
    is_hidden: project?.is_hidden ?? false,
    sort_order: project?.sort_order ?? 0,
    content: project?.content || '',
    content_blocks: project?.content_blocks,
  });
  const isNew = !project?.id;
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form className="cms-form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <fieldset className="cms-form__section">
        <legend>Basics</legend>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pj-id">Project ID</label>
            <input id="pj-id" value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. paysika_default" required disabled={!isNew} />
            {!isNew && <p className="cms-field__hint">The ID can't change once created; it's part of the project URL.</p>}
          </div>
          <div className="cms-field">
            <CheckboxGroup
              label="Profiles"
              value={form.profile_ids}
              options={profiles.map((p) => ({ value: p.id, label: p.name }))}
              onChange={(v) => set('profile_ids', v)}
              hint="A post can appear under one or more profiles. Uncheck all to hide it everywhere."
            />
          </div>
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pj-title">Title</label>
            <input id="pj-title" value={form.title} onChange={(e) => set('title', e.target.value)} required />
          </div>
          <div className="cms-field">
            <label htmlFor="pj-tag">Tag / category</label>
            <input id="pj-tag" value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="e.g. Fintech Innovation" />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="pj-tagline">Tagline</label>
          <input id="pj-tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="One line shown on the project card" />
        </div>
        <ImageField
          label="Cover image"
          value={form.image}
          onChange={(v) => set('image', v)}
          hint="A Cloudinary URL, or the filename of a bundled image (e.g. paysika_mockup.png)."
        />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Engagement details</legend>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pj-role">Role</label>
            <input id="pj-role" value={form.role} onChange={(e) => set('role', e.target.value)} />
          </div>
          <div className="cms-field">
            <label htmlFor="pj-period">Period</label>
            <input id="pj-period" value={form.period} onChange={(e) => set('period', e.target.value)} placeholder="e.g. Nov 2022 - Aug 2026" />
          </div>
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pj-location">Location</label>
            <input id="pj-location" value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div className="cms-field">
            <label htmlFor="pj-site">Site URL</label>
            <input id="pj-site" value={form.site} onChange={(e) => set('site', e.target.value)} placeholder="https://…" />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="pj-impact">Impact (one line)</label>
          <input id="pj-impact" value={form.impact} onChange={(e) => set('impact', e.target.value)} />
        </div>
        <ArrayEditor label="Responsibilities" values={form.responsibilities} onChange={(v) => set('responsibilities', v)} placeholder="Add a responsibility and press Enter" />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Story: challenge, solution, result</legend>
        <MarkdownEditor label="Overview (short description)" value={form.description} onChange={(v) => set('description', v)} rows={3} />
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pj-challenge">Challenge heading</label>
            <input id="pj-challenge" value={form.challenge} onChange={(e) => set('challenge', e.target.value)} />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="pj-challenge-text">Challenge text</label>
          <textarea id="pj-challenge-text" value={form.challenge_text} onChange={(e) => set('challenge_text', e.target.value)} rows={4} />
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pj-solution">Solution heading</label>
            <input id="pj-solution" value={form.solution} onChange={(e) => set('solution', e.target.value)} />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="pj-solution-text">Solution text</label>
          <textarea id="pj-solution-text" value={form.solution_text} onChange={(e) => set('solution_text', e.target.value)} rows={4} />
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pj-result">Result heading</label>
            <input id="pj-result" value={form.result} onChange={(e) => set('result', e.target.value)} />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="pj-result-text">Result text</label>
          <textarea id="pj-result-text" value={form.result_text} onChange={(e) => set('result_text', e.target.value)} rows={4} />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Full case study</legend>
        <MarkdownEditor label="Case study content (Markdown)" value={form.content} onChange={(v) => set('content', v)} rows={18} placeholder="Write the detailed case study using Markdown…" />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Case-study sections (structured blocks)</legend>
        <p className="cms-field__hint" style={{ marginBottom: 10 }}>
          Structured sections rendered above the markdown: intro, stat cards, gallery, photos, rich text.
          Rewritable anytime; the site applies the styling. Build them visually, or switch to JSON.
        </p>
        <BlockBuilder
          value={form.content_blocks as ProjectBlock[] | undefined}
          onChange={(v) => set('content_blocks', v)}
        />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Visibility & ordering</legend>
        <div className="cms-form__grid">
          <label className="cms-check">
            <input type="checkbox" checked={form.is_hidden} onChange={(e) => set('is_hidden', e.target.checked)} />
            Hidden (not shown on the site)
          </label>
          <div className="cms-field">
            <label htmlFor="pj-sort">Sort order</label>
            <input id="pj-sort" type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
        </div>
      </fieldset>

      <div className="cms-form__actions">
        <button type="submit" disabled={saving} className="cms-btn cms-btn--primary">{saving ? 'Saving…' : 'Save project'}</button>
        <button type="button" onClick={onCancel} className="cms-btn">Cancel</button>
      </div>
    </form>
  );
}

/* ─── Blog form ─────────────────────────────────────────────────────────── */

// Build a URL-safe slug from a title: lowercase, accents stripped, non-alphanumerics
// collapsed to single hyphens, no leading/trailing hyphens.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Estimate reading time at ~200 words/min, after stripping HTML tags and common
// Markdown punctuation so the word count reflects prose, not syntax.
function estimateReadTime(content: string): string {
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~[\]()!-]+/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function BlogForm({ post, profiles, onSave, onCancel, saving }: {
  post: BlogPost | null;
  profiles: Profile[];
  onSave: (p: Partial<BlogPost>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: post?.id || '',
    profile_ids: post?.profile_ids?.length ? post.profile_ids : (profiles[0]?.id ? [profiles[0].id] : []),
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    date: post?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    author: post?.author || 'Ndouken Theryx',
    read_time: post?.read_time || '',
    tags: post?.tags || [],
    image: post?.image || '',
    is_hidden: post?.is_hidden ?? true,
    sort_order: post?.sort_order ?? 0,
  });
  const isNew = !post?.id;
  // Once the user hand-edits the slug, stop auto-deriving it from the title.
  const [slugEdited, setSlugEdited] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  // Read time is always derived from the current content.
  const readTime = estimateReadTime(form.content);

  return (
    <form className="cms-form" onSubmit={(e) => { e.preventDefault(); onSave({ ...form, read_time: readTime }); }}>
      <fieldset className="cms-form__section">
        <legend>Basics</legend>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="bp-id">Post ID (slug)</label>
            <input
              id="bp-id"
              value={form.id}
              onChange={(e) => { set('id', slugify(e.target.value)); setSlugEdited(true); }}
              placeholder="e.g. my-blog-post"
              required
              disabled={!isNew}
            />
            {isNew
              ? <p className="cms-field__hint">Auto-generated from the title; edit to customize.</p>
              : <p className="cms-field__hint">The ID can't change once created; it's part of the post URL.</p>}
          </div>
          <div className="cms-field">
            <CheckboxGroup
              label="Profiles"
              value={form.profile_ids}
              options={profiles.map((p) => ({ value: p.id, label: p.name }))}
              onChange={(v) => set('profile_ids', v)}
              hint="A post can appear under one or more profiles. Uncheck all to hide it everywhere."
            />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="bp-title">Title</label>
          <input
            id="bp-title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              set('title', title);
              if (isNew && !slugEdited) set('id', slugify(title));
            }}
            required
          />
        </div>
        <div className="cms-field">
          <label htmlFor="bp-excerpt">Excerpt</label>
          <textarea id="bp-excerpt" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2} placeholder="Short summary shown in the blog list" />
        </div>
        <ImageField label="Cover image" value={form.image} onChange={(v) => set('image', v)} />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Content</legend>
        <MarkdownEditor
          label="Content (Markdown)"
          value={form.content}
          onChange={(v) => set('content', v)}
          placeholder="Write your blog post in **markdown**…"
        />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Metadata</legend>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="bp-date">Date</label>
            <input id="bp-date" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="e.g. April 20, 2026" />
          </div>
          <div className="cms-field">
            <label htmlFor="bp-read">Read time</label>
            <input id="bp-read" value={readTime} readOnly placeholder="e.g. 5 min read" />
            <p className="cms-field__hint">Auto-calculated from the content (~200 words per minute).</p>
          </div>
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="bp-author">Author</label>
            <input id="bp-author" value={form.author} onChange={(e) => set('author', e.target.value)} />
          </div>
          <div className="cms-field">
            <label htmlFor="bp-sort">Sort order</label>
            <input id="bp-sort" type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <ArrayEditor label="Tags" values={form.tags} onChange={(v) => set('tags', v)} placeholder="e.g. Design, Open Source" />
        <label className="cms-check">
          <input type="checkbox" checked={form.is_hidden} onChange={(e) => set('is_hidden', e.target.checked)} />
          Draft (hidden from visitors)
        </label>
      </fieldset>

      <div className="cms-form__actions">
        <button type="submit" disabled={saving} className="cms-btn cms-btn--primary">{saving ? 'Saving…' : 'Save post'}</button>
        <button type="button" onClick={onCancel} className="cms-btn">Cancel</button>
      </div>
    </form>
  );
}

/* ─── Security / credentials form ───────────────────────────────────────── */

export function SecurityForm({ onSuccess, onError }: { onSuccess: (m: string) => void; onError: (m: string) => void }) {
  const [form, setForm] = useState({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      onError('New passwords do not match');
      return;
    }
    if (form.newPassword && form.newPassword.length < 8) {
      onError('New password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await changePassword(
        form.currentPassword,
        form.newPassword || undefined,
        form.newEmail || undefined,
      );
      onSuccess('Credentials updated successfully');
      setForm({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="cms-form cms-form--narrow" onSubmit={handleSubmit}>
      <fieldset className="cms-form__section">
        <legend>Verify it's you</legend>
        <div className="cms-field">
          <label htmlFor="sec-current">Current password <span className="cms-required">*</span></label>
          <PasswordInput id="sec-current" value={form.currentPassword} onChange={(v) => set('currentPassword', v)} autoComplete="current-password" />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>New credentials (leave blank to keep current)</legend>
        <div className="cms-field">
          <label htmlFor="sec-email">New email</label>
          <input id="sec-email" type="email" value={form.newEmail} onChange={(e) => set('newEmail', e.target.value)} autoComplete="email" />
        </div>
        <div className="cms-field">
          <label htmlFor="sec-new">New password</label>
          <PasswordInput id="sec-new" value={form.newPassword} onChange={(v) => set('newPassword', v)} autoComplete="new-password" />
        </div>
        <div className="cms-field">
          <label htmlFor="sec-confirm">Confirm new password</label>
          <PasswordInput id="sec-confirm" value={form.confirmPassword} onChange={(v) => set('confirmPassword', v)} autoComplete="new-password" />
        </div>
      </fieldset>

      <div className="cms-form__actions">
        <button type="submit" disabled={saving} className="cms-btn cms-btn--primary">{saving ? 'Saving…' : 'Update credentials'}</button>
      </div>
    </form>
  );
}
