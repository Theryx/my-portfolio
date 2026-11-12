import type { Company } from '../../../lib/api';
import { resolveProjectImage } from '../../../data/projects';
import { resolveBlogImage } from '../../../data/blog';

// Project images first (bundled map and Cloudinary URLs), then article images.
export function resolveMedia(src: string | undefined): string {
  if (!src) return '';
  return resolveProjectImage(src) || resolveBlogImage(src);
}

// Two-digit plate number, as on a specimen sheet: 1 -> "01".
export function plateNo(i: number): string {
  return String(i + 1).padStart(2, '0');
}

/** One line of a project's specimen strip: a colour, a typeface or a discipline. */
export interface SpecimenItem {
  label: string;
  value: string;
  swatch?: string;
}

/** Per-project extras kept in theme_config.projects, keyed by project id. */
export interface ProjectExtra {
  sector?: string;
  did?: string[];
  specimen?: SpecimenItem[];
}

/** A tile on the home contact sheet. */
export interface SheetTile {
  image: string;
  kind: string;
  project: string;
  label?: string;
}

export function themeOf(company: Company | null): Record<string, unknown> {
  return (company?.theme_config ?? {}) as Record<string, unknown>;
}

export function projectExtra(company: Company | null, id: string): ProjectExtra {
  const all = themeOf(company).projects;
  if (!all || typeof all !== 'object') return {};
  return ((all as Record<string, ProjectExtra>)[id] ?? {}) as ProjectExtra;
}
