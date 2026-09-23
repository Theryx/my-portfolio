import { useState } from 'react';

// Renders an embed block: a direct video file, a GIF/image, a trusted iframe
// (Figma, YouTube, Vimeo), or a plain link. Broken media falls back to a link.
const IFRAME_HOSTS = ['figma.com', 'youtube.com', 'youtu.be', 'vimeo.com'];

type Kind = 'video' | 'image' | 'iframe' | 'link';

function classify(url: string): Kind {
  const path = url.split('?')[0].split('#')[0].toLowerCase();
  if (/\.(mp4|webm|mov|m4v)$/.test(path)) return 'video';
  if (/\.(gif|webp|png|jpe?g|avif|svg)$/.test(path)) return 'image';
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (IFRAME_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return 'iframe';
  } catch {
    return 'link';
  }
  return 'link';
}

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith('/embed/')) return url;
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    if (host.endsWith('figma.com')) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }
  } catch {
    /* fall through */
  }
  return url;
}

function FallbackLink({ url, label }: { url: string; label?: string }) {
  return (
    <p className="media-embed media-embed--link">
      <a href={url} target="_blank" rel="noopener noreferrer">{label || 'Open media'}</a>
    </p>
  );
}

export default function MediaEmbed({
  url,
  title,
  poster,
}: {
  url: string;
  title?: string;
  poster?: string;
}) {
  const [broken, setBroken] = useState(false);
  const kind = classify(url);

  if (broken || kind === 'link') return <FallbackLink url={url} label={title} />;

  if (kind === 'video') {
    return (
      <video
        className="media-embed media-embed--video"
        controls
        playsInline
        preload="metadata"
        poster={poster || undefined}
        onError={() => setBroken(true)}
      >
        <source src={url} />
      </video>
    );
  }

  if (kind === 'image') {
    return (
      <img
        className="media-embed media-embed--image"
        src={url}
        alt={title || ''}
        loading="lazy"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <iframe
      className="media-embed media-embed--iframe"
      src={toEmbedUrl(url)}
      title={title || 'Embedded media'}
      loading="lazy"
      allowFullScreen
    />
  );
}
