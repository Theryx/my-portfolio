import { useCallback, useEffect, useState } from 'react';

/* Studio routing lives in the URL hash (/admin#/library/project:paysika), so a
   refresh or a shared link reopens the same screen, and Back/Forward work. */

export type SectionId = 'overview' | 'applications' | 'library' | 'main-site' | 'assets' | 'settings';

export interface Route {
  section: SectionId;
  /** Second path segment: an entry or company id, or "new". */
  id?: string;
  /** Third segment, e.g. a tab inside an editor. */
  sub?: string;
  query: URLSearchParams;
}

const SECTIONS: SectionId[] = ['overview', 'applications', 'library', 'main-site', 'assets', 'settings'];

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const [section, id, sub] = path.split('/').map((p) => decodeURIComponent(p));
  return {
    section: (SECTIONS as string[]).includes(section) ? (section as SectionId) : 'overview',
    id: id || undefined,
    sub: sub || undefined,
    query: new URLSearchParams(qs),
  };
}

export function hrefFor(section: SectionId, id?: string, sub?: string, query?: Record<string, string>): string {
  const parts = [section, id, sub].filter(Boolean).map((p) => encodeURIComponent(p as string));
  const qs = query ? new URLSearchParams(query).toString() : '';
  return `#/${parts.join('/')}${qs ? `?${qs}` : ''}`;
}

/* Unsaved-changes guard: an open editor reports whether it is dirty, and every
   in-app navigation asks before discarding those changes. */

let dirty = false;
// The hash Studio is currently showing, so a cancelled Back can be undone.
let shownHash = typeof window !== 'undefined' ? window.location.hash : '';

export function confirmDiscard(): boolean {
  if (!dirty) return true;
  const ok = window.confirm('You have unsaved changes. Leave without saving?');
  if (ok) dirty = false;
  return ok;
}

export function useUnsavedGuard(isDirty: boolean) {
  useEffect(() => {
    dirty = isDirty;
    if (!isDirty) return undefined;
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);
  useEffect(() => () => { dirty = false; }, []);
}

export function useHashRoute(): [Route, (href: string, opts?: { force?: boolean; replace?: boolean }) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    shownHash = window.location.hash;
    const onHash = () => {
      // Back/Forward while an editor has unsaved changes: ask, and undo the
      // hash change if the answer is no.
      if (!confirmDiscard()) {
        window.history.pushState(null, '', shownHash);
        return;
      }
      shownHash = window.location.hash;
      setRoute(parseHash(shownHash));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((href: string, opts?: { force?: boolean; replace?: boolean }) => {
    if (!opts?.force && !confirmDiscard()) return;
    dirty = false;
    if (opts?.replace) window.history.replaceState(null, '', href);
    else window.history.pushState(null, '', href);
    shownHash = href;
    setRoute(parseHash(href));
    window.scrollTo({ top: 0 });
  }, []);

  return [route, navigate];
}
