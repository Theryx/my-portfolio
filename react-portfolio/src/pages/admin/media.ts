import { resolveProjectImage } from '../../data/projects';
import { resolveBlogImage } from '../../data/blog';

// Studio stores images three ways: absolute URLs (Cloudinary), site paths, and
// bare filenames of images bundled with the site (`gefona-reports.png`). The
// bundled ones only exist under their hashed build URL, so resolve them through
// the same maps the public pages use.
export function resolveMedia(src: string | null | undefined): string {
  if (!src) return '';
  return resolveProjectImage(src) || resolveBlogImage(src) || '';
}

const IMAGE_RE = /\.(png|jpe?g|jfif|webp|gif|svg|avif)(\?.*)?$/i;

export function looksLikeImage(src: string | null | undefined, mime?: string | null): boolean {
  if (mime && mime.startsWith('image/')) return true;
  if (!src) return false;
  return IMAGE_RE.test(src) || /res\.cloudinary\.com\/.+\/image\//.test(src);
}
