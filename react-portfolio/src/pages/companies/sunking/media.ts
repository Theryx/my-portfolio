import type { Company } from '../../../lib/api';
import { resolveProjectImage } from '../../../data/projects';
import { resolveBlogImage } from '../../../data/blog';

import usabilitySession from '../../../assets/img/paysika/Research/paysika-usability-session.webp';

// Images added for this site, keyed by the names used in its stories.
const localImages: Record<string, string> = {
  'paysika-usability-session.webp': usabilitySession,
};

// This site's own images, then project images (bundled map and Cloudinary
// URLs), then article images.
export function resolveMedia(src: string | undefined): string {
  if (!src) return '';
  return localImages[src] || resolveProjectImage(src) || resolveBlogImage(src);
}

/** One line of a project's field card: who, device, network, language, outcome. */
export interface FieldItem {
  label: string;
  value: string;
}

/** Per-project extras kept in theme_config.projects, keyed by project id. */
export interface ProjectExtra {
  /** Display title for this site; warehouse titles cannot be overridden per company. */
  title?: string;
  side?: string;
  field?: FieldItem[];
}

export function themeOf(company: Company | null): Record<string, unknown> {
  return (company?.theme_config ?? {}) as Record<string, unknown>;
}

/** The title this site shows for a project. */
export function titleOf(company: Company | null, p: { id: string; title: string }): string {
  return projectExtra(company, p.id).title || p.title;
}

export function projectExtra(company: Company | null, id: string): ProjectExtra {
  const all = themeOf(company).projects;
  if (!all || typeof all !== 'object') return {};
  return ((all as Record<string, ProjectExtra>)[id] ?? {}) as ProjectExtra;
}
