import type { ReactNode } from 'react';
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

/** Visible, honest placeholder shown wherever an image is still missing. */
export function ImagePlaceholder({ note }: { note: string }) {
  return (
    <div className="lp-placeholder" role="note">
      <span className="lp-placeholder__tag">Image to add</span>
      <p className="lp-placeholder__note">{note}</p>
    </div>
  );
}

/** Markdown with image resolution, a missing-image guard and note detection. */
export function LpMarkdown({
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
            const note = flatten(children).replace(/insert image here:?/i, '').replace(/image to add:?/i, '').trim();
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

/** Renders a project's structured case-study sections with bespoke styling. */
export default function Blocks({
  blocks,
  resolveImage = resolveMedia,
}: {
  blocks: ProjectBlock[];
  resolveImage?: (src: string) => string;
}) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="lp-blocks">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'intro':
            return (
              <section className="lp-block" key={i}>
                {block.eyebrow && <p className="lp-eyebrow">{block.eyebrow}</p>}
                <h2 className="lp-block__heading">{block.heading}</h2>
                {block.text && <p className="lp-block__text">{block.text}</p>}
              </section>
            );

          case 'stat-cards':
            return (
              <section className="lp-block" key={i}>
                <div className="lp-stats">
                  {block.cards.map((card, j) => {
                    const Icon = card.icon ? ICONS[card.icon] : undefined;
                    return (
                      <div className="lp-stat" key={j}>
                        {Icon && <Icon size={20} aria-hidden="true" />}
                        <strong>{card.title}</strong>
                        {card.text && <span>{card.text}</span>}
                        {card.note && <em className="lp-stat__note">{card.note}</em>}
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case 'gallery':
            return (
              <section className="lp-block" key={i}>
                {(block.eyebrow || block.heading || block.text) && (
                  <div className="lp-block__head">
                    {block.eyebrow && <p className="lp-eyebrow">{block.eyebrow}</p>}
                    {block.heading && <h2 className="lp-block__heading">{block.heading}</h2>}
                    {block.text && <p className="lp-block__text">{block.text}</p>}
                  </div>
                )}
                <div className="lp-gallery">
                  {block.items.map((item, j) => {
                    const src = resolveImage(item.image);
                    return (
                      <article className="lp-gallery__item" key={j}>
                        {src ? (
                          <img src={src} alt={item.title || ''} loading="lazy" />
                        ) : (
                          <ImagePlaceholder note={item.title || item.description || 'Image'} />
                        )}
                        {(item.title || item.description) && (
                          <div className="lp-gallery__body">
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
              <section className="lp-block" key={i}>
                {(block.heading || block.text) && (
                  <div className="lp-block__head">
                    {block.heading && <h2 className="lp-block__heading">{block.heading}</h2>}
                    {block.text && <p className="lp-block__text">{block.text}</p>}
                  </div>
                )}
                <div className="lp-photos">
                  {block.items.map((item, j) => {
                    const src = resolveImage(item.image);
                    return src ? (
                      <img key={j} src={src} alt={item.caption || ''} loading="lazy" />
                    ) : (
                      <ImagePlaceholder key={j} note={item.caption || 'Photo'} />
                    );
                  })}
                </div>
              </section>
            );

          case 'quote':
            return (
              <section className="lp-block" key={i}>
                <blockquote className="lp-quote">
                  <p>{block.text}</p>
                  {(block.attribution || block.role) && (
                    <footer className="lp-quote__by">
                      {block.attribution}
                      {block.role ? `${block.attribution ? ', ' : ''}${block.role}` : ''}
                    </footer>
                  )}
                </blockquote>
                {block.image && (
                  resolveImage(block.image)
                    ? <img className="lp-quote__img" src={resolveImage(block.image)} alt={block.attribution || ''} loading="lazy" />
                    : <ImagePlaceholder note={block.attribution || 'Portrait'} />
                )}
              </section>
            );

          case 'metrics':
            return (
              <section className="lp-block" key={i}>
                {(block.heading || block.text) && (
                  <div className="lp-block__head">
                    {block.heading && <h2 className="lp-block__heading">{block.heading}</h2>}
                    {block.text && <p className="lp-block__text">{block.text}</p>}
                  </div>
                )}
                <div className="lp-metrics">
                  {block.items.map((m, j) => (
                    <div className="lp-metric" key={j}>
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
              <section className="lp-block" key={i}>
                {(block.eyebrow || block.heading || block.text) && (
                  <div className="lp-block__head">
                    {block.eyebrow && <p className="lp-eyebrow">{block.eyebrow}</p>}
                    {block.heading && <h2 className="lp-block__heading">{block.heading}</h2>}
                    {block.text && <p className="lp-block__text">{block.text}</p>}
                  </div>
                )}
                <ol className="lp-steps">
                  {block.items.map((s, j) => {
                    const src = s.image ? resolveImage(s.image) : '';
                    return (
                      <li className="lp-step" key={j}>
                        <span className="lp-step__num">{String(j + 1).padStart(2, '0')}</span>
                        <div className="lp-step__body">
                          <h3>{s.title}</h3>
                          {s.text && <p>{s.text}</p>}
                          {s.image && (
                            src
                              ? <img src={src} alt={s.title} loading="lazy" />
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
              <section className="lp-block" key={i}>
                {(block.eyebrow || block.heading || block.text) && (
                  <div className="lp-block__head">
                    {block.eyebrow && <p className="lp-eyebrow">{block.eyebrow}</p>}
                    {block.heading && <h2 className="lp-block__heading">{block.heading}</h2>}
                    {block.text && <p className="lp-block__text">{block.text}</p>}
                  </div>
                )}
                <div className="lp-compare">
                  {[block.left, block.right].map((side, j) => {
                    const src = resolveImage(side.image);
                    return (
                      <figure className="lp-compare__side" key={j}>
                        {src ? <img src={src} alt={side.label} loading="lazy" /> : <ImagePlaceholder note={side.label} />}
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
              <section className="lp-block" key={i}>
                {block.heading && <h2 className="lp-block__heading">{block.heading}</h2>}
                <div className={`lp-twocol${block.imageSide === 'left' ? ' is-reversed' : ''}`}>
                  <div className="lp-twocol__text lp-prose">
                    <LpMarkdown text={block.markdown} resolveImage={resolveImage} />
                  </div>
                  <figure className="lp-twocol__media">
                    {src ? <img src={src} alt={block.heading || ''} loading="lazy" /> : <ImagePlaceholder note={block.heading || 'Image'} />}
                    {block.caption && <figcaption>{block.caption}</figcaption>}
                  </figure>
                </div>
              </section>
            );
          }

          case 'embed':
            return (
              <section className="lp-block" key={i}>
                {(block.heading || block.text) && (
                  <div className="lp-block__head">
                    {block.heading && <h2 className="lp-block__heading">{block.heading}</h2>}
                    {block.text && <p className="lp-block__text">{block.text}</p>}
                  </div>
                )}
                <MediaEmbed url={block.url} poster={block.poster} title={block.heading} />
                {block.caption && <p className="lp-embed__caption">{block.caption}</p>}
              </section>
            );

          case 'richtext':
            return (
              <section className="lp-block" key={i}>
                <div className="lp-prose">
                  <LpMarkdown text={block.markdown} resolveImage={resolveImage} />
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
