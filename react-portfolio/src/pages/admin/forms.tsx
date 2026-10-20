import { useState } from 'react';
import { changePassword } from '../../lib/api';
import { PasswordInput } from './fields';
import { TextInput } from './ui';

/* ─── Security / credentials form ───────────────────────────────────────── */

export function SecurityForm({ onSuccess, onError }: { onSuccess: (m: string) => void; onError: (m: string) => void }) {
  const [form, setForm] = useState({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      onError('The new passwords do not match');
      return;
    }
    if (form.newPassword && form.newPassword.length < 8) {
      onError('The new password needs at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await changePassword(form.currentPassword, form.newPassword || undefined, form.newEmail || undefined);
      onSuccess('Sign-in details updated');
      setForm({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not update your sign-in details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="cms-stack" onSubmit={handleSubmit} style={{ maxWidth: 440 }}>
      <TextInput label="New email" optional type="email" value={form.newEmail} onChange={(v) => set('newEmail', v)} hint="Leave empty to keep your current email." />
      <div className="cms-field">
        <label className="cms-field__label" htmlFor="sec-new">New password <span className="cms-field__optional">· optional</span></label>
        <PasswordInput id="sec-new" value={form.newPassword} onChange={(v) => set('newPassword', v)} autoComplete="new-password" />
      </div>
      <div className="cms-field">
        <label className="cms-field__label" htmlFor="sec-confirm">Repeat the new password</label>
        <PasswordInput id="sec-confirm" value={form.confirmPassword} onChange={(v) => set('confirmPassword', v)} autoComplete="new-password" />
      </div>
      <div className="cms-field">
        <label className="cms-field__label" htmlFor="sec-current">Current password</label>
        <PasswordInput id="sec-current" value={form.currentPassword} onChange={(v) => set('currentPassword', v)} autoComplete="current-password" />
        <p className="cms-field__hint">Needed to confirm any change.</p>
      </div>
      <div>
        <button type="submit" className="cms-btn cms-btn--primary" disabled={saving || !form.currentPassword || (!form.newEmail && !form.newPassword)}>
          {saving ? 'Saving…' : 'Update sign-in details'}
        </button>
      </div>
    </form>
  );
}
