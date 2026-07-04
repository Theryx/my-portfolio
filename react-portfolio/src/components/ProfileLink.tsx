import { Link, useSearchParams, type LinkProps } from 'react-router-dom';

/** Appends the active `?profile=` query param to a path, if one is set. */
export function withProfile(to: string, profile: string | null): string {
  if (!profile) return to;
  const [path, existing] = to.split('?');
  const params = new URLSearchParams(existing);
  params.set('profile', profile);
  return `${path}?${params.toString()}`;
}

/** Reads the current `?profile=` value from the URL (null when unset). */
export function useProfileParam(): string | null {
  const [searchParams] = useSearchParams();
  return searchParams.get('profile');
}

/**
 * Drop-in replacement for react-router's <Link> that carries the current
 * `?profile=` through navigation, so visitors stay on the profile they're
 * viewing instead of falling back to the active/default profile.
 */
export default function ProfileLink({ to, ...rest }: Omit<LinkProps, 'to'> & { to: string }) {
  const profile = useProfileParam();
  return <Link to={withProfile(to, profile)} {...rest} />;
}
