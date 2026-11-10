import { resolveProjectImage } from '../../../data/projects';
import { resolveBlogImage } from '../../../data/blog';

// Project images first (bundled map and Cloudinary URLs), then article images.
export function resolveMedia(src: string | undefined): string {
  if (!src) return '';
  return resolveProjectImage(src) || resolveBlogImage(src);
}

// Two-digit entry number, as in a logbook: 1 -> "01".
export function entryNo(i: number): string {
  return String(i + 1).padStart(2, '0');
}
