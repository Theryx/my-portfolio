import { useEffect } from 'react';

const SITE_URL = 'https://react-portfolio-pi-topaz.vercel.app';
const DEFAULT_TITLE = 'Ndouken Theryx — Product Designer & Builder';
const DEFAULT_DESCRIPTION =
  'I design and ship digital products end to end — UX, interface, and code. Based in Douala, Cameroon.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

/**
 * Updates the document title, description, canonical URL, and Open Graph /
 * Twitter tags for the current page, so shared links show the actual
 * article or case-study title instead of the generic site card.
 */
export function usePageMeta({ title, description, image, type = 'website' }: PageMeta) {
  useEffect(() => {
    const fullTitle = title ? `${title} — Ndouken Theryx` : DEFAULT_TITLE;
    const desc = description?.slice(0, 200) || DEFAULT_DESCRIPTION;
    const img = image && /^https?:\/\//.test(image) ? image : DEFAULT_IMAGE;
    const url = `${SITE_URL}${window.location.pathname}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:image"]', 'content', img);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', img);

    return () => {
      // Restore defaults when leaving the page so list pages aren't stuck
      // with a stale article card.
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('link[rel="canonical"]', 'href', `${SITE_URL}/`);
      setMeta('meta[property="og:title"]', 'content', DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:image"]', 'content', DEFAULT_IMAGE);
      setMeta('meta[property="og:url"]', 'content', `${SITE_URL}/`);
      setMeta('meta[property="og:type"]', 'content', 'website');
      setMeta('meta[name="twitter:title"]', 'content', DEFAULT_TITLE);
      setMeta('meta[name="twitter:description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('meta[name="twitter:image"]', 'content', DEFAULT_IMAGE);
    };
  }, [title, description, image, type]);
}
