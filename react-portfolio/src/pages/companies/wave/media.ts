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
import kycNew1 from '../../../assets/img/paysika/KYC/paysika-kyc-new-1-summary.webp';
import kycNew2 from '../../../assets/img/paysika/KYC/paysika-kyc-new-2-review.webp';
import kycNew3 from '../../../assets/img/paysika/KYC/paysika-kyc-new-3-ui-update.webp';
import boKycReview from '../../../assets/img/paysika/BackOffice/paysika-bo-kyc-review.webp';
import boAccessCodes from '../../../assets/img/paysika/BackOffice/paysika-bo-access-codes.webp';

const localImages: Record<string, string> = {
  'paysika-usability-session.webp': usabilitySession,
  'paysika-rider-app.webp': riderApp,
  'paysika-fair-talk.webp': fairTalk,
  'paysika-kyc-old-1-start.webp': kycOld1,
  'paysika-kyc-old-2-details.webp': kycOld2,
  'paysika-kyc-old-3-document.webp': kycOld3,
  'paysika-kyc-old-4-profile.webp': kycOld4,
  'paysika-kyc-new-1-summary.webp': kycNew1,
  'paysika-kyc-new-2-review.webp': kycNew2,
  'paysika-kyc-new-3-ui-update.webp': kycNew3,
  'paysika-bo-kyc-review.webp': boKycReview,
  'paysika-bo-access-codes.webp': boAccessCodes,
};

export function resolveMedia(src: string | undefined): string {
  if (!src) return '';
  return localImages[src] || resolveProjectImage(src) || resolveBlogImage(src);
}

export interface ReceiptItem {
  label: string;
  value: string;
}

export interface ProjectExtra {
  title?: string;
  side?: string;
  receipt?: ReceiptItem[];
}

export function themeOf(company: Company | null): Record<string, unknown> {
  return (company?.theme_config ?? {}) as Record<string, unknown>;
}

export function projectExtra(company: Company | null, id: string): ProjectExtra {
  const all = themeOf(company).projects;
  if (!all || typeof all !== 'object') return {};
  return ((all as Record<string, ProjectExtra>)[id] ?? {}) as ProjectExtra;
}

export function titleOf(company: Company | null, p: { id: string; title: string }): string {
  return projectExtra(company, p.id).title || p.title;
}
