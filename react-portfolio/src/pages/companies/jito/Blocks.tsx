import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  Users, ClipboardList, Target, BarChart3, ShieldCheck, FileText, Award,
  Sparkles, Rocket, LineChart, Layers, GitBranch, MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import type { ProjectBlock } from '../../../lib/api';

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
};

// Flatten rendered markdown children to plain text, so we can detect an
// "insert image here" note inside a blockquote.
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
    <div className="jn-imgplaceholder" role="note">
      <span className="jn-imgplaceholder__tag">Image to add</span>
      <p className="jn-imgplaceholder__note">{note}</p>
    </div>
  );
}

/** Markdown with image resolution, a broken-image guard, and note detection. */
export function JitoMarkdown({
  text,
  resolveImage,
  allowHtml = false,
}: {
  text: string;
  resolveImage: (src: string) => string;
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
          if (/insert image here/i.test(flatten(children))) {
            const note = flatten(children).replace(/insert image here:?/i, '').trim();
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
  resolveImage,
}: {
  blocks: ProjectBlock[];
  resolveImage: (src: string) => string;
}) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="jn-blocks">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'intro':
            return (
              <section className="jn-block" key={i}>
                {block.eyebrow && <span className="jn-eyebrow">{block.eyebrow}</span>}
                <h2 className="jn-block__heading">{block.heading}</h2>
                {block.text && <p className="jn-block__text">{block.text}</p>}
              </section>
            );

          case 'stat-cards':
            return (
              <section className="jn-block" key={i}>
                <div className="jn-stats">
                  {block.cards.map((card, j) => {
                    const Icon = card.icon ? ICONS[card.icon] : undefined;
                    return (
                      <div className="jn-stat" key={j}>
                        {Icon && <Icon size={20} aria-hidden="true" />}
                        <strong>{card.title}</strong>
                        {card.text && <span>{card.text}</span>}
                        {card.note && <em className="jn-stat__note">{card.note}</em>}
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case 'gallery':
            return (
              <section className="jn-block" key={i}>
                {(block.eyebrow || block.heading || block.text) && (
                  <div className="jn-block__head">
                    {block.eyebrow && <span className="jn-eyebrow">{block.eyebrow}</span>}
                    {block.heading && <h2 className="jn-block__heading">{block.heading}</h2>}
                    {block.text && <p className="jn-block__text">{block.text}</p>}
                  </div>
                )}
                <div className="jn-gallery">
                  {block.items.map((item, j) => {
                    const src = resolveImage(item.image);
                    return (
                      <article className="jn-gallery__item" key={j}>
                        {src ? (
                          <img src={src} alt={item.title || ''} loading="lazy" />
                        ) : (
                          <ImagePlaceholder note={item.title || item.description || 'Image'} />
                        )}
                        {(item.title || item.description) && (
                          <div className="jn-gallery__body">
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
              <section className="jn-block" key={i}>
                {(block.heading || block.text) && (
                  <div className="jn-block__head">
                    {block.heading && <h2 className="jn-block__heading">{block.heading}</h2>}
                    {block.text && <p className="jn-block__text">{block.text}</p>}
                  </div>
                )}
                <div className="jn-photos">
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

          case 'richtext':
            return (
              <section className="jn-block" key={i}>
                <div className="jn-prose">
                  <JitoMarkdown text={block.markdown} resolveImage={resolveImage} />
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
