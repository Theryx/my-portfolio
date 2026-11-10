import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ProjectBlock } from '../../../lib/api';
import MediaEmbed from '../../../components/MediaEmbed';
import { resolveMedia } from './media';

/** Honest placeholder wherever an image is still missing. */
export function ImageToAdd({ note }: { note: string }) {
  return (
    <div className="cn-todo" role="note">
      <span className="cn-todo__tag">Image to add</span>
      <span className="cn-todo__note">{note}</span>
    </div>
  );
}

/* ── Lightbox ── */
interface LightboxItem {
  src: string;
  caption?: string;
}
const LightboxContext = createContext<{ open: (item: LightboxItem) => void }>({ open: () => {} });

function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);
  const open = useCallback((next: LightboxItem) => setItem(next), []);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setItem(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [item]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {item && (
        <div
          className="cn-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.caption || 'Image'}
          onClick={() => setItem(null)}
        >
          <figure className="cn-lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <img src={item.src} alt={item.caption || ''} />
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
          <button type="button" className="cn-lightbox__close" onClick={() => setItem(null)} aria-label="Close image" autoFocus>
            Close
          </button>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

function Thumb({ src, caption }: { src: string; caption?: string }) {
  const { open } = useContext(LightboxContext);
  return (
    <button
      type="button"
      className="cn-thumb"
      onClick={() => open({ src, caption })}
      aria-label={caption ? `View image: ${caption}` : 'View image'}
    >
      <img src={src} alt="" loading="lazy" />
    </button>
  );
}

function Img({ src, note, caption }: { src: string; note: string; caption?: string }) {
  const resolved = resolveMedia(src);
  return resolved ? <Thumb src={resolved} caption={caption || note} /> : <ImageToAdd note={note} />;
}

export function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ src, alt }) => {
          const resolved = resolveMedia(decodeURIComponent(String(src || '')));
          return resolved ? <img src={resolved} alt={alt || ''} loading="lazy" /> : <ImageToAdd note={alt || 'Image'} />;
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

/** One block: a margin note column (the stamp) beside the main column. */
function Entry({ stamp, children }: { stamp?: string; children: ReactNode }) {
  return (
    <section className="cn-block">
      <div className="cn-block__margin">{stamp && <p className="cn-stamp">{stamp}</p>}</div>
      <div className="cn-block__main">{children}</div>
    </section>
  );
}

function Head({ heading, text }: { heading?: string; text?: string }) {
  return (
    <>
      {heading && <h2 className="cn-block__heading">{heading}</h2>}
      {text && <p className="cn-block__text">{text}</p>}
    </>
  );
}

export default function Blocks({ blocks }: { blocks: ProjectBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <LightboxProvider>
      <div className="cn-blocks">
        {blocks.map((block, i) => {
          switch (block.type) {
            case 'intro':
              return (
                <Entry key={i} stamp={block.eyebrow}>
                  <Head heading={block.heading} text={block.text} />
                </Entry>
              );

            case 'stat-cards':
              return (
                <Entry key={i}>
                  <dl className="cn-tally">
                    {block.cards.map((c, j) => (
                      <div className="cn-tally__item" key={j}>
                        <dt>{c.title}</dt>
                        {c.text && <dd>{c.text}</dd>}
                        {c.note && <dd className="cn-tally__note">{c.note}</dd>}
                      </div>
                    ))}
                  </dl>
                </Entry>
              );

            case 'metrics':
              return (
                <Entry key={i}>
                  <Head heading={block.heading} text={block.text} />
                  <dl className="cn-tally">
                    {block.items.map((m, j) => (
                      <div className="cn-tally__item" key={j}>
                        <dt>{m.value}</dt>
                        <dd>{m.label}</dd>
                        {m.note && <dd className="cn-tally__note">{m.note}</dd>}
                      </div>
                    ))}
                  </dl>
                </Entry>
              );

            case 'steps':
              return (
                <Entry key={i} stamp={block.eyebrow}>
                  <Head heading={block.heading} text={block.text} />
                  <ol className="cn-steps">
                    {block.items.map((s, j) => (
                      <li className="cn-steps__item" key={j}>
                        <span className="cn-steps__no">{String(j + 1).padStart(2, '0')}</span>
                        <div>
                          <h3>{s.title}</h3>
                          {s.text && <p>{s.text}</p>}
                          {s.image && <Img src={s.image} note={s.title} />}
                        </div>
                      </li>
                    ))}
                  </ol>
                </Entry>
              );

            case 'gallery':
              return (
                <Entry key={i} stamp={block.eyebrow}>
                  <Head heading={block.heading} text={block.text} />
                  <div className={`cn-gallery${block.items.length === 1 ? ' is-single' : ''}`}>
                    {block.items.map((item, j) => (
                      <figure className="cn-gallery__item" key={j}>
                        <Img src={item.image} note={item.title || item.description || 'Image'} />
                        {(item.title || item.description) && (
                          <figcaption>
                            {item.title && <strong>{item.title}</strong>}
                            {item.description && <span>{item.description}</span>}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </Entry>
              );

            case 'photos':
              return (
                <Entry key={i}>
                  <Head heading={block.heading} text={block.text} />
                  <div className="cn-photos">
                    {block.items.map((item, j) => (
                      <figure className="cn-photos__item" key={j}>
                        <Img src={item.image} note={item.caption || 'Photo'} caption={item.caption} />
                        {item.caption && <figcaption>{item.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                </Entry>
              );

            case 'compare':
              return (
                <Entry key={i} stamp={block.eyebrow}>
                  <Head heading={block.heading} text={block.text} />
                  <div className="cn-compare">
                    {[block.left, block.right].map((side, j) => (
                      <figure className="cn-compare__side" key={j}>
                        <Img src={side.image} note={side.label} caption={side.caption || side.label} />
                        <figcaption>
                          <strong>{side.label}</strong>
                          {side.caption && <span>{side.caption}</span>}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </Entry>
              );

            case 'two-col': {
              const stamp = (block as { eyebrow?: string }).eyebrow;
              return (
                <Entry key={i} stamp={stamp}>
                  {block.heading && <h2 className="cn-block__heading">{block.heading}</h2>}
                  <div className={`cn-twocol${block.imageSide === 'left' ? ' is-reversed' : ''}`}>
                    <div className="cn-prose">
                      <Markdown text={block.markdown} />
                    </div>
                    <figure className="cn-twocol__media">
                      <Img src={block.image} note={block.heading || 'Image'} caption={block.caption} />
                      {block.caption && <figcaption>{block.caption}</figcaption>}
                    </figure>
                  </div>
                </Entry>
              );
            }

            case 'quote':
              return (
                <Entry key={i}>
                  <blockquote className="cn-quote">
                    <p>{block.text}</p>
                    {(block.attribution || block.role) && (
                      <footer>{[block.attribution, block.role].filter(Boolean).join(', ')}</footer>
                    )}
                  </blockquote>
                </Entry>
              );

            case 'embed':
              return (
                <Entry key={i}>
                  <Head heading={block.heading} text={block.text} />
                  <MediaEmbed url={block.url} poster={block.poster} title={block.heading} />
                  {block.caption && <p className="cn-caption">{block.caption}</p>}
                </Entry>
              );

            case 'richtext':
              return (
                <Entry key={i}>
                  <div className="cn-prose cn-prose--note">
                    <Markdown text={block.markdown} />
                  </div>
                </Entry>
              );

            default:
              return null;
          }
        })}
      </div>
    </LightboxProvider>
  );
}
