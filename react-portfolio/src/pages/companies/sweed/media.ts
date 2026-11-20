import { resolveProjectImage } from '../../../data/projects';
import { resolveBlogImage } from '../../../data/blog';

export function resolveMedia(src: string | undefined): string {
  if (!src) return '';
  return resolveProjectImage(src) || resolveBlogImage(src);
}

export function stripLeadingH1(markdown: string): string {
  return (markdown || '').replace(/^\s*#\s+.*(\r?\n)+/, '');
}
