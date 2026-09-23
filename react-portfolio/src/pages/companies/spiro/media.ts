import { resolveProjectImage } from '../../../data/projects';
import { resolveBlogImage } from '../../../data/blog';

// One resolver for this site: project images first (bundled maps plus
// Cloudinary URLs), then the article image map. Absolute URLs and paths pass
// straight through inside both resolvers.
export function resolveMedia(src: string | undefined): string {
  if (!src) return '';
  return resolveProjectImage(src) || resolveBlogImage(src);
}

// Article bodies in the warehouse repeat their title as a leading H1, and the
// page already renders the title. Drop that first heading so there is one H1.
export function stripLeadingH1(markdown: string): string {
  return (markdown || '').replace(/^\s*#\s+.*(\r?\n)+/, '');
}
