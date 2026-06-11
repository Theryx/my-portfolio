import { useState } from 'react';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { changePassword, type Profile, type Project, type BlogPost } from '../../lib/api';
import { PasswordInput, ImageField, ArrayEditor, KVEditor } from './fields';

/* ─── Profile form ──────────────────────────────────────────────────────── */

export function ProfileForm({ profile, onSave, onCancel, saving }: {
  profile: Profile | null;
  onSave: (p: Partial<Profile>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: profile?.id || '',
    name: profile?.name || '',
    is_active: profile?.is_active ?? true,
    bio: profile?.bio || '',
    tagline: profile?.tagline || '',
    hero_title: profile?.hero_title || '',
    hero_subtitle: profile?.hero_subtitle || '',
    philosophy_title: profile?.philosophy_title || '',
    philosophy_text: profile?.philosophy_text || '',
    badges: profile?.badges || [],
    social_links: profile?.social_links || {},
  });
  const isNew = !profile?.id;
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form className="cms-form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <fieldset className="cms-form__section">
        <legend>Identity</legend>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="pf-id">Profile ID (slug)</label>
            <input id="pf-id" value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. fintech, design-engineer" required disabled={!isNew} />
            {!isNew && <p className="cms-field__hint">The ID can't change once created — it's part of shared URLs.</p>}
          </div>
          <div className="cms-field">
            <label htmlFor="pf-name">Display name</label>
            <input id="pf-name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
        </div>
        <label className="cms-check">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} />
          Active — visitors landing on the site without a <code>?profile=</code> link see the first active profile
        </label>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Hero (home page)</legend>
        <div className="cms-field">
          <label htmlFor="pf-hero-title">Hero title</label>
          <input id="pf-hero-title" value={form.hero_title} onChange={(e) => set('hero_title', e.target.value)} />
        </div>
        <div className="cms-field">
          <label htmlFor="pf-hero-subtitle">Hero subtitle</label>
          <textarea id="pf-hero-subtitle" value={form.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} rows={3} />
        </div>
        <div className="cms-field">
          <label htmlFor="pf-tagline">Tagline</label>
          <textarea id="pf-tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} rows={2} />
        </div>
        <ArrayEditor label="Badges" values={form.badges} onChange={(v) => set('badges', v)} placeholder="e.g. Open to Product Design roles" />
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>About</legend>
        <div className="cms-field">
          <label htmlFor="pf-bio">Bio</label>
          <textarea id="pf-bio" value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={4} />
        </div>
        <div className="cms-field">
          <label htmlFor="pf-philo-title">Philosophy title</label>
          <input id="pf-philo-title" value={form.philosophy_title} onChange={(e) => set('philosophy_title', e.target.value)} />
        </div>
        <div className="cms-field">
          <label htmlFor="pf-philo-text">Philosophy text</label>
          <textarea id="pf-philo-text" value={form.philosophy_text} onChange={(e) => set('philosophy_text', e.target.value)} rows={4} />
        </div>
      </fieldset>

      <fieldset className="cms-form__section">
        <legend>Contact & links</legend>
        <KVEditor
          label="Social links"
          value={form.social_links}
          onChange={(v) => set('social_links', v)}
          hint="Special keys the site uses directly: email (copy-email card), linkedin (LinkedIn card), resume (View CV in the footer)."
        />
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
    profile_id: project?.profile_id || profiles[0]?.id || '',
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
            {!isNew && <p className="cms-field__hint">The ID can't change once created — it's part of the project URL.</p>}
          </div>
          <div className="cms-field">
            <label htmlFor="pj-profile">Profile</label>
            <select id="pj-profile" value={form.profile_id} onChange={(e) => set('profile_id', e.target.value)}>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
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
        <legend>Story — challenge, solution, result</legend>
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

export function BlogForm({ post, profiles, onSave, onCancel, saving }: {
  post: BlogPost | null;
  profiles: Profile[];
  onSave: (p: Partial<BlogPost>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: post?.id || '',
    profile_id: post?.profile_id || profiles[0]?.id || '',
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
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form className="cms-form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <fieldset className="cms-form__section">
        <legend>Basics</legend>
        <div className="cms-form__grid">
          <div className="cms-field">
            <label htmlFor="bp-id">Post ID (slug)</label>
            <input id="bp-id" value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. my-blog-post" required disabled={!isNew} />
            {!isNew && <p className="cms-field__hint">The ID can't change once created — it's part of the post URL.</p>}
          </div>
          <div className="cms-field">
            <label htmlFor="bp-profile">Profile</label>
            <select id="bp-profile" value={form.profile_id} onChange={(e) => set('profile_id', e.target.value)}>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="cms-field">
          <label htmlFor="bp-title">Title</label>
          <input id="bp-title" value={form.title} onChange={(e) => set('title', e.target.value)} required />
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
            <input id="bp-read" value={form.read_time} onChange={(e) => set('read_time', e.target.value)} placeholder="e.g. 5 min read" />
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
