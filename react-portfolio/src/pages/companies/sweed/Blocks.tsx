import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  Users, ClipboardList, Target, BarChart3, ShieldCheck, FileText, Award,
  Sparkles, Rocket, LineChart, Layers, GitBranch, MessageSquare, Route,
  type LucideIcon,
} from 'lucide-react';
import type { ProjectBlock } from '../../../lib/api';
import MediaEmbed from '../../../components/MediaEmbed';
import { resolveMedia } from './media';

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  clipboard: ClipboardList,
  target: Target,
  chart: BarChart3,
  shield: ShieldCheck,
  file: FileText,
  award: Award,
  sparkles: Sparkles,
  rocket: Rocket,
  line: LineChart,
  layers: Layers,
  branch: GitBranch,
  message: MessageSquare,
  route: Route,
};

function flatten(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flatten).join('');
  const el = node as { props?: { children?: ReactNode } };
  return flatten(el.props?.children);
}

export function ImagePlaceholder({ note }: { note: string }) {
  return (
    <div className="ss-placeholder" role="note">
      <span className="ss-placeholder__tag">Image to add</span>
      <p className="ss-placeholder__note">{note}</p>
    </div>
  );
}

interface LightboxItem {
  src: string;
  caption?: string;
}

const LightboxContext = createContext<{ open: (item: LightboxItem) => void }>({
  open: () => {},
});

function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);
  const open = useCallback((next: LightboxItem) => setItem(next), []);

  useEffect(() => {
    if (!item) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setItem(null);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [item]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {item && (
        <div
          className="ss-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.caption || 'Image'}
          onClick={() => setItem(null)}
        >
          <figure className="ss-lightbox__figure" onClick={(event) => event.stopPropagation()}>
            <img src={item.src} alt={item.caption || ''} />
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
          <button
            type="button"
            className="ss-lightbox__close"
            onClick={() => setItem(null)}
            aria-label="Close image"
            autoFocus
          >
            ×
          </button>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

function Thumb({ src, caption, className }: { src: string; caption?: string; className?: string }) {
  const { open } = useContext(LightboxContext);
  return (
    <button
      type="button"
      className={`ss-thumb${className ? ` ${className}` : ''}`}
      onClick={() => open({ src, caption })}
      aria-label={caption ? `View image: ${caption}` : 'View image'}
    >
      <img src={src} alt="" loading="lazy" />
    </button>
  );
}

export function SsMarkdown({
  text,
  resolveImage = resolveMedia,
  allowHtml = false,
}: {
  text: string;
  resolveImage?: (src: string) => string;
  allowHtml?: boolean;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={allowHtml ? [rehypeRaw] : []}
      components={{
        img: ({ src, alt }) => {
          const resolved = resolveImage(decodeURIComponent(src || ''));
          if (!resolved) return <ImagePlaceholder note={alt || 'Image'} />;
          return <img src={resolved} alt={alt || ''} loading="lazy" />;
        },
        blockquote: ({ children }) => {
          if (/insert image here|image to add/i.test(flatten(children))) {
            const note = flatten(children)
              .replace(/insert image here:?/i, '')
              .replace(/image to add:?/i, '')
              .trim();
            return <ImagePlaceholder note={note || 'Image'} />;
          }
          return <blockquote>{children}</blockquote>;
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function Blocks({
  blocks,
  resolveImage = resolveMedia,
}: {
  blocks: ProjectBlock[];
  resolveImage?: (src: string) => string;
}) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <LightboxProvider>
      <div className="ss-blocks">
        {blocks.map((block, i) => {
          switch (block.type) {
            case 'intro':
              return (
                <section className="ss-block" key={i}>
                  {block.eyebrow && <p className="ss-eyebrow">{block.eyebrow}</p>}
                  <h2 className="ss-block__heading">{block.heading}</h2>
                  {block.text && <p className="ss-block__text">{block.text}</p>}
                </section>
              );

            case 'stat-cards':
              return (
                <section className="ss-block" key={i}>
                  <div className="ss-stats">
                    {block.cards.map((card, j) => {
                      const Icon = card.icon ? ICONS[card.icon] : undefined;
                      return (
                        <div className="ss-stat" key={j}>
                          {Icon && <Icon size={18} aria-hidden="true" />}
                          <strong>{card.title}</strong>
                          {card.text && <span>{card.text}</span>}
                          {card.note && <em className="ss-stat__note">{card.note}</em>}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );

            case 'gallery':
              return (
                <section className="ss-block" key={i}>
                  {(block.eyebrow || block.heading || block.text) && (
                    <div className="ss-block__head">
                      {block.eyebrow && <p className="ss-eyebrow">{block.eyebrow}</p>}
                      {block.heading && <h2 className="ss-block__heading">{block.heading}</h2>}
                      {block.text && <p className="ss-block__text">{block.text}</p>}
                    </div>
                  )}
                  <div className="ss-gallery">
                    {block.items.map((item, j) => {
                      const src = resolveImage(item.image);
                      return (
                        <article className="ss-gallery__item" key={j}>
                          {src ? (
                            <Thumb src={src} caption={item.title || item.description} />
                          ) : (
                            <ImagePlaceholder note={item.title || item.description || 'Image'} />
                          )}
                          {(item.title || item.description) && (
                            <div className="ss-gallery__body">
                              {item.title && <h3>{item.title}</h3>}
                              {item.description && <p>{item.description}</p>}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              );

            case 'photos':
              return (
                <section className="ss-block" key={i}>
                  {(block.heading || block.text) && (
                    <div className="ss-block__head">
                      {block.heading && <h2 className="ss-block__heading">{block.heading}</h2>}
                      {block.text && <p className="ss-block__text">{block.text}</p>}
                    </div>
                  )}
                  <div className="ss-photos">
                    {block.items.map((item, j) => {
                      const src = resolveImage(item.image);
                      return src ? (
                        <Thumb key={j} src={src} caption={item.caption} />
                      ) : (
                        <ImagePlaceholder key={j} note={item.caption || 'Photo'} />
                      );
                    })}
                  </div>
                </section>
              );

            case 'quote':
              return (
                <section className="ss-block" key={i}>
                  <blockquote className="ss-quote">
                    <p>{block.text}</p>
                    {(block.attribution || block.role) && (
                      <footer className="ss-quote__by">
                        {block.attribution}
                        {block.role ? `${block.attribution ? ', ' : ''}${block.role}` : ''}
                      </footer>
                    )}
                  </blockquote>
                  {block.image && (
                    resolveImage(block.image)
                      ? <img className="ss-quote__img" src={resolveImage(block.image)} alt={block.attribution || ''} loading="lazy" />
                      : <ImagePlaceholder note={block.attribution || 'Portrait'} />
                  )}
                </section>
              );

            case 'metrics':
              return (
                <section className="ss-block" key={i}>
                  {(block.heading || block.text) && (
                    <div className="ss-block__head">
                      {block.heading && <h2 className="ss-block__heading">{block.heading}</h2>}
                      {block.text && <p className="ss-block__text">{block.text}</p>}
                    </div>
                  )}
                  <div className="ss-metrics">
                    {block.items.map((m, j) => (
                      <div className="ss-metric" key={j}>
                        <strong>{m.value}</strong>
                        <span>{m.label}</span>
                        {m.note && <em>{m.note}</em>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'steps':
              return (
                <section className="ss-block" key={i}>
                  {(block.eyebrow || block.heading || block.text) && (
                    <div className="ss-block__head">
                      {block.eyebrow && <p className="ss-eyebrow">{block.eyebrow}</p>}
                      {block.heading && <h2 className="ss-block__heading">{block.heading}</h2>}
                      {block.text && <p className="ss-block__text">{block.text}</p>}
                    </div>
                  )}
                  <ol className="ss-steps">
                    {block.items.map((s, j) => {
                      const src = s.image ? resolveImage(s.image) : '';
                      return (
                        <li className="ss-step" key={j}>
                          <span className="ss-step__num">{String(j + 1).padStart(2, '0')}</span>
                          <div className="ss-step__body">
                            <h3>{s.title}</h3>
                            {s.text && <p>{s.text}</p>}
                            {s.image && (
                              src
                                ? <Thumb src={src} caption={s.title} />
                                : <ImagePlaceholder note={s.title} />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );

            case 'compare':
              return (
                <section className="ss-block" key={i}>
                  {(block.eyebrow || block.heading || block.text) && (
                    <div className="ss-block__head">
                      {block.eyebrow && <p className="ss-eyebrow">{block.eyebrow}</p>}
                      {block.heading && <h2 className="ss-block__heading">{block.heading}</h2>}
                      {block.text && <p className="ss-block__text">{block.text}</p>}
                    </div>
                  )}
                  <div className="ss-compare">
                    {[block.left, block.right].map((side, j) => {
                      const src = resolveImage(side.image);
                      return (
                        <figure className="ss-compare__side" key={j}>
                          {src ? <Thumb src={src} caption={side.caption || side.label} /> : <ImagePlaceholder note={side.label} />}
                          <figcaption>
                            <strong>{side.label}</strong>
                            {side.caption && <span>{side.caption}</span>}
                          </figcaption>
                        </figure>
                      );
                    })}
                  </div>
                </section>
              );

            case 'two-col': {
              const src = resolveImage(block.image);
              return (
                <section className="ss-block" key={i}>
                  {block.heading && <h2 className="ss-block__heading">{block.heading}</h2>}
                  <div className={`ss-twocol${block.imageSide === 'left' ? ' is-reversed' : ''}`}>
                    <div className="ss-twocol__text ss-prose">
                      <SsMarkdown text={block.markdown} resolveImage={resolveImage} />
                    </div>
                    <figure className="ss-twocol__media">
                      {src ? <Thumb src={src} caption={block.caption || block.heading} /> : <ImagePlaceholder note={block.heading || 'Image'} />}
                      {block.caption && <figcaption>{block.caption}</figcaption>}
                    </figure>
                  </div>
                </section>
              );
            }

            case 'embed':
              return (
                <section className="ss-block" key={i}>
                  {(block.heading || block.text) && (
                    <div className="ss-block__head">
                      {block.heading && <h2 className="ss-block__heading">{block.heading}</h2>}
                      {block.text && <p className="ss-block__text">{block.text}</p>}
                    </div>
                  )}
                  <MediaEmbed url={block.url} poster={block.poster} title={block.heading} />
                  {block.caption && <p className="ss-embed__caption">{block.caption}</p>}
                </section>
              );

            case 'richtext':
              return (
                <section className="ss-block" key={i}>
                  <div className="ss-prose">
                    <SsMarkdown text={block.markdown} resolveImage={resolveImage} />
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>
    </LightboxProvider>
  );
}
