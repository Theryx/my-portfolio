import type { Company } from '../../../lib/api';
import { resolveProjectImage } from '../../../data/projects';
import { resolveBlogImage } from '../../../data/blog';

import usabilitySession from '../../../assets/img/paysika/Research/paysika-usability-session.webp';
import riderApp from '../../../assets/img/paysika/Riders/paysika-rider-app.webp';
import fairTalk from '../../../assets/img/paysika/Events/paysika-fair-talk.webp';
import kycOld1 from '../../../assets/img/paysika/KYC/paysika-kyc-old-1-start.webp';
import kycOld2 from '../../../assets/img/paysika/KYC/paysika-kyc-old-2-details.webp';
import kycOld3 from '../../../assets/img/paysika/KYC/paysika-kyc-old-3-document.webp';
import kycOld4 from '../../../assets/img/paysika/KYC/paysika-kyc-old-4-profile.webp';

// Images added for this site, keyed by the names used in its stories.
const localImages: Record<string, string> = {
  'paysika-usability-session.webp': usabilitySession,
  'paysika-rider-app.webp': riderApp,
  'paysika-fair-talk.webp': fairTalk,
  'paysika-kyc-old-1-start.webp': kycOld1,
  'paysika-kyc-old-2-details.webp': kycOld2,
  'paysika-kyc-old-3-document.webp': kycOld3,
  'paysika-kyc-old-4-profile.webp': kycOld4,
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
