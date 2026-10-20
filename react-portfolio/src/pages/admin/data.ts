import { useCallback, useEffect, useState } from 'react';
import {
  getCompanies, getWarehouseEntries,
  type Company, type WarehouseEntry, type ApplicationStage,
} from '../../lib/api';

export type Toast = (message: string, type: 'success' | 'error') => void;

/* The data every Studio screen shares, fetched once after sign-in. Screens
   update it in place after a save instead of refetching everything. */
export function useStudioData(enabled: boolean, toast: Toast) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [entries, setEntries] = useState<WarehouseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [c, e] = await Promise.all([getCompanies(), getWarehouseEntries({ include_hidden: true })]);
      setCompanies(c);
      setEntries(e);
    } catch {
      toast('Could not load your content. Try refreshing.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (enabled) void reload();
  }, [enabled, reload]);

  const putEntry = useCallback((saved: WarehouseEntry) => {
    setEntries((list) => (list.some((e) => e.id === saved.id)
      ? list.map((e) => (e.id === saved.id ? saved : e))
      : [...list, saved]));
  }, []);

  const dropEntry = useCallback((id: string) => setEntries((list) => list.filter((e) => e.id !== id)), []);

  const putCompany = useCallback((saved: Company) => {
    setCompanies((list) => (list.some((c) => c.id === saved.id)
      ? list.map((c) => (c.id === saved.id ? { ...c, ...saved } : c))
      : [...list, saved]));
  }, []);

  const dropCompany = useCallback((id: string) => {
    setCompanies((list) => list.filter((c) => c.id !== id));
    setEntries((list) => list.map((e) => ({
      ...e,
      company_ids: (e.company_ids ?? []).filter((x) => x !== id),
      company_links: (e.company_links ?? []).filter((l) => l.company_id !== id),
    })));
  }, []);

  return { companies, entries, loading, reload, putEntry, dropEntry, putCompany, dropCompany };
}

export type StudioData = ReturnType<typeof useStudioData>;

/* ── Applications vs main-site personas ── */

export function isApplication(c: Company): boolean {
  const kind = c.application?.kind;
  if (kind) return kind === 'application';
  return Boolean((c.role ?? '').trim() || (c.job_description ?? '').trim() || (c.job_url ?? '').trim());
}

export const STAGES: { id: ApplicationStage; label: string; tone: 'neutral' | 'blue' | 'violet' | 'amber' | 'green' }[] = [
  { id: 'researching', label: 'Researching', tone: 'neutral' },
  { id: 'building', label: 'Building site', tone: 'blue' },
  { id: 'ready', label: 'Ready to send', tone: 'violet' },
  { id: 'applied', label: 'Applied', tone: 'amber' },
  { id: 'interviewing', label: 'Interviewing', tone: 'green' },
  { id: 'closed', label: 'Closed', tone: 'neutral' },
];

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<ApplicationStage, (typeof STAGES)[number]>;

export function stageOf(c: Company): ApplicationStage {
  return c.application?.stage ?? 'building';
}

export const OUTCOMES = [
  { value: '', label: 'No outcome yet' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'no-reply', label: 'No reply' },
];

export function fitTone(score?: number | null): string {
  if (score == null) return 'var(--s-border-strong)';
  if (score >= 75) return 'var(--s-accent)';
  if (score >= 60) return 'var(--s-warn)';
  return 'var(--s-danger)';
}

export function siteUrl(c: Company): string {
  return `/c/${c.slug || c.id}`;
}
