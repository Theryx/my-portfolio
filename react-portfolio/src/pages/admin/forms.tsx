import { useState } from 'react';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { changePassword, type Profile, type Project, type BlogPost } from '../../lib/api';
import { PasswordInput, ImageField, ArrayEditor, FaqEditor, CheckboxGroup, SpeakingImagesEditor, JsonBlocksEditor } from './fields';

// The page forms below each edit a slice of a profile but SAVE THE WHOLE object
// (the API upserts every column, so a partial body would blank the rest). They
// spread the loaded profile and override only their fields, merging social_links.

/* ─── Home page form ────────────────────────────────────────────────────── */

export function HomeForm({ profile, onSave, onCancel, saving }: {
  profile: Profile;
  onSave: (p: Partial<Profile>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [heroTitle, setHeroTitle] = useState(profile.hero_title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(profile.hero_subtitle || '');
  const [introExpandedText, setIntroExpandedText] = useState(profile.intro_expanded_text || '');
  const [now, setNow] = useState(profile.social_links?.now || '');
  const [metricLabel, setMetricLabel] = useState(profile.social_links?.metric_label || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      intro_expanded_text: introExpandedText,
      social_links: { ...profile.social_links, now, metric_label: metricLabel },
    });
  };

  return (
    <form className="cms-form" onSubmit={submit}>
      <fieldset className="cms-form__section">
        <legend>Hero</legend>
        <div className="cms-field">
          <label htmlFor="hf-hero-title">Hero title</label>
          <input id="hf-hero-title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="e.g. Product Designer & Builder" />
          <p className="cms-field__hint">The role shown after your name in the intro card.</p>
        </div>
        <div className="cms-field">
          <label htmlFor="hf-hero-subtitle">Hero subtitle</label>
          <textarea id="hf-hero-subtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={3} placeholder="The sentence under your name in the intro card." />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Intro expander (“click to expand” card)</legend>
        <p className="cms-field__hint">Shown as a second paragraph when a visitor expands your intro card on the home page, independent of the About page's Philosophy section.</p>
        <div className="cms-field">
          <label htmlFor="hf-intro-expanded">Expander text</label>
          <textarea id="hf-intro-expanded" value={introExpandedText} onChange={(e) => setIntroExpandedText(e.target.value)} rows={4} />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Bento tiles</legend>
        <div className="cms-field">
          <label htmlFor="hf-now">“Now” status</label>
          <input id="hf-now" value={now} onChange={(e) => setNow(e.target.value)} placeholder="e.g. Shipping my next venture with AI-assisted design & code" />
          <p className="cms-field__hint">Shown in the “Now” tile on the home page.</p>
        </div>
        <div className="cms-field">
          <label htmlFor="hf-metric">Years-metric label</label>
          <input id="hf-metric" value={metricLabel} onChange={(e) => setMetricLabel(e.target.value)} placeholder="e.g. years designing & building products" />
          <p className="cms-field__hint">Caption under the auto-counted years number.</p>
        </div>
      </fieldset>

      <div className="cms-form__actions">
        <button type="submit" disabled={saving} className="cms-btn cms-btn--primary">{saving ? 'Saving…' : 'Save home page'}</button>
        <button type="button" onClick={onCancel} className="cms-btn">Cancel</button>
      </div>
    </form>
  );
}

/* ─── About page form ───────────────────────────────────────────────────── */

export function AboutForm({ profile, onSave, onCancel, saving }: {
  profile: Profile;
  onSave: (p: Partial<Profile>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [bio, setBio] = useState(profile.bio || '');
  const [tagline, setTagline] = useState(profile.tagline || '');
  const [philosophyTitle, setPhilosophyTitle] = useState(profile.philosophy_title || '');
  const [philosophyText, setPhilosophyText] = useState(profile.philosophy_text || '');
  const [about, setAboutState] = useState(profile.about_content || {});
  const setAbout = (k: string, v: unknown) => setAboutState((a) => ({ ...a, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      bio,
      tagline,
      philosophy_title: philosophyTitle,
      philosophy_text: philosophyText,
      about_content: about,
    });
  };

  return (
    <form className="cms-form" onSubmit={submit}>
      <fieldset className="cms-form__section">
        <legend>Intro</legend>
        <div className="cms-field">
          <label htmlFor="af-bio">Bio</label>
          <textarea id="af-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>
        <div className="cms-field">
          <label htmlFor="af-tagline">Tagline</label>
          <textarea id="af-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} rows={2} />
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="af-location">Location</label>
            <input id="af-location" value={about.location ?? ''} onChange={(e) => setAbout('location', e.target.value)} placeholder="e.g. Douala" />
          </div>
          <div className="cms-field">
            <label htmlFor="af-location-label">Location caption</label>
            <input id="af-location-label" value={about.location_label ?? ''} onChange={(e) => setAbout('location_label', e.target.value)} placeholder="e.g. Cameroon 🇨🇲" />
          </div>
        </div>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="af-languages">Languages</label>
            <input id="af-languages" value={about.languages ?? ''} onChange={(e) => setAbout('languages', e.target.value)} placeholder="e.g. EN & FR" />
          </div>
          <div className="cms-field">
            <label htmlFor="af-languages-label">Languages caption</label>
            <input id="af-languages-label" value={about.languages_label ?? ''} onChange={(e) => setAbout('languages_label', e.target.value)} placeholder="e.g. Bilingual, fully fluent" />
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="af-funfact">Fun fact</label>
          <textarea id="af-funfact" value={about.fun_fact ?? ''} onChange={(e) => setAbout('fun_fact', e.target.value)} rows={2} />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Philosophy</legend>
        <p className="cms-field__hint">Shown only on this About page, independent of the home page's intro expander.</p>
        <div className="cms-field">
          <label htmlFor="af-philo-title">Philosophy title</label>
          <input id="af-philo-title" value={philosophyTitle} onChange={(e) => setPhilosophyTitle(e.target.value)} />
        </div>
        <div className="cms-field">
          <label htmlFor="af-philo-text">Philosophy text</label>
          <textarea id="af-philo-text" value={philosophyText} onChange={(e) => setPhilosophyText(e.target.value)} rows={4} />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Research &amp; speaking</legend>
        <div className="cms-field">
          <label htmlFor="af-speaking-intro">Intro</label>
          <textarea id="af-speaking-intro" value={about.speaking_intro ?? ''} onChange={(e) => setAbout('speaking_intro', e.target.value)} rows={4} placeholder="Wrap **text** in double asterisks for bold. Use a blank line to separate paragraphs." />
        </div>
        <SpeakingImagesEditor
          value={about.speaking_images ?? (about.speaking_image ? [about.speaking_image] : [])}
          onChange={(urls) => {
            setAbout('speaking_images', urls);
            // Keep speaking_image in sync so older consumers still get a value.
            setAbout('speaking_image', urls[0] ?? '');
          }}
        />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>FAQs</legend>
        <FaqEditor
          label="Frequently asked questions"
          value={about.faqs ?? []}
          onChange={(v) => setAbout('faqs', v)}
          hint="Question-and-answer pairs shown in the FAQ accordion."
        />
      </fieldset>

      <div className="cms-form__actions">
        <button type="submit" disabled={saving} className="cms-btn cms-btn--primary">{saving ? 'Saving…' : 'Save about page'}</button>
        <button type="button" onClick={onCancel} className="cms-btn">Cancel</button>
      </div>
    </form>
  );
}

/* ─── Profile meta form (identity, links, page intros) ──────────────────── */

export function ProfileMetaForm({ profile, onSave, onCancel, saving }: {
  profile: Profile | null;
  onSave: (p: Partial<Profile>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [id, setId] = useState(profile?.id || '');
  const [name, setName] = useState(profile?.name || '');
  const [isActive, setIsActive] = useState(profile?.is_active ?? true);
  const [badges, setBadges] = useState<string[]>(profile?.badges || []);
  const links = profile?.social_links ?? {};
  const [email, setEmail] = useState(links.email || '');
  const [linkedin, setLinkedin] = useState(links.linkedin || '');
  const [resume, setResume] = useState(links.resume || '');
  const [projectsIntro, setProjectsIntro] = useState(links.projects_intro || '');
  const [blogIntro, setBlogIntro] = useState(links.blog_intro || '');
  const isNew = !profile?.id;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(profile ?? {}),
      id,
      name,
      is_active: isActive,
      badges,
      social_links: {
        ...(profile?.social_links ?? {}),
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
            <label htmlFor="pm-id">Profile ID (slug)</label>
            <input id="pm-id" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. fintech, design-engineer" required disabled={!isNew} />
            {!isNew && <p className="cms-field__hint">The ID can't change once created; it's part of shared URLs.</p>}
          </div>
          <div className="cms-field">
            <label htmlFor="pm-name">Display name</label>
            <input id="pm-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>
        <label className="cms-check">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active: visitors landing on the site without a <code>?profile=</code> link see the first active profile
        </label>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Contact links</legend>
        <div className="cms-field">
          <label htmlFor="pm-email">Email</label>
          <input id="pm-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="cms-field">
          <label htmlFor="pm-linkedin">LinkedIn URL</label>
          <input id="pm-linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/…" />
        </div>
        <div className="cms-field">
          <label htmlFor="pm-resume">Résumé / CV URL</label>
          <input id="pm-resume" value={resume} onChange={(e) => setResume(e.target.value)} placeholder="https://…" />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Page intros</legend>
        <div className="cms-field">
          <label htmlFor="pm-projects-intro">Projects page subtitle</label>
          <textarea id="pm-projects-intro" value={projectsIntro} onChange={(e) => setProjectsIntro(e.target.value)} rows={2} />
        </div>
        <div className="cms-field">
          <label htmlFor="pm-blog-intro">Blog page subtitle</label>
          <textarea id="pm-blog-intro" value={blogIntro} onChange={(e) => setBlogIntro(e.target.value)} rows={2} />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Badges</legend>
        <ArrayEditor label="Badges" values={badges} onChange={setBadges} placeholder="e.g. Open to Product Design roles" />
        <p className="cms-field__hint">Not currently shown on the public site.</p>
      </fieldset>

      <div className="cms-form__actions">
        <button type="submit" disabled={saving} className="cms-btn cms-btn--primary">{saving ? 'Saving…' : 'Save profile'}</button>
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
            <input id="pj-period" value={form.period} onChange={(e) => set('period', e.target.value)} placeholder="e.g. Dec 2021 – Present" />
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
        <JsonBlocksEditor
          label="Content blocks (JSON)"
          value={form.content_blocks}
          onChange={(v) => set('content_blocks', v)}
          hint="Structured sections rendered above the markdown: intro, stat-cards, gallery, photos, richtext. Rewritable anytime; the UI is applied by the site."
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
