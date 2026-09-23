import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Users, ClipboardList, Target, BarChart3, ShieldCheck, FileText, Award,
  Sparkles, Rocket, LineChart, Layers, GitBranch, MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { resolveProjectImage } from '../data/projects';
import { lightboxTrigger } from '../lib/a11y';
import MediaEmbed from './MediaEmbed';
import type { ProjectBlock } from '../lib/api';

// Whitelisted icon keys so blocks stay JSON-serializable and safe.
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

interface ProjectSectionsProps {
  blocks: ProjectBlock[];
  onImageClick: (src: string, caption: string) => void;
}

/**
 * Renders a project's structured, DB-stored case-study sections. Each block type
 * maps to a styled component that reuses the existing .paysika-story /
 * .paysika-process / .paysika-recognition CSS, so authored content stays visually
 * consistent while being fully rewritable from the CMS (no code change needed).
 */
export default function ProjectSections({ blocks, onImageClick }: ProjectSectionsProps) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'intro':
            return (
              <section className="project-detail__section paysika-story" key={i}>
                <div className="paysika-story__intro">
                  {block.eyebrow && <span className="paysika-story__eyebrow">{block.eyebrow}</span>}
                  <h2>{block.heading}</h2>
                  {block.text && <p>{block.text}</p>}
                </div>
              </section>
            );

          case 'stat-cards':
            return (
              <section className="project-detail__section paysika-story" key={i}>
                <div className={`paysika-story__stats${block.variant === 'artifacts' ? ' paysika-story__stats--artifacts' : ''}`}>
                  {block.cards.map((card, j) => {
                    const Icon = card.icon ? ICONS[card.icon] : undefined;
                    return (
                      <div className="paysika-story__stat" key={j}>
                        {Icon && <Icon size={22} />}
                        <strong>{card.title}</strong>
                        {card.text && <span>{card.text}</span>}
                        {card.note && <span className="paysika-process__todo">{card.note}</span>}
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case 'gallery':
            return (
              <section className="project-detail__section paysika-process" key={i}>
                {(block.eyebrow || block.heading || block.text) && (
                  <div className="paysika-process__header">
                    {block.eyebrow && <span className="paysika-story__eyebrow">{block.eyebrow}</span>}
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.text && <p>{block.text}</p>}
                  </div>
                )}
                <div className="paysika-process__grid">
                  {block.items.map((item, j) => {
                    const src = resolveProjectImage(item.image);
                    return (
                      <article className="paysika-process__item" key={j}>
                        {src && (
                          <img
                            src={src}
                            alt={item.title || ''}
                            loading="lazy"
                            {...lightboxTrigger(() => onImageClick(src, `${item.title || ''}${item.description ? ' - ' + item.description : ''}`), `Enlarge: ${item.title || 'image'}`)}
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                        <div>
                          {item.title && <h3>{item.title}</h3>}
                          {item.description && <p>{item.description}</p>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );

          case 'photos':
            return (
              <section className="project-detail__section paysika-recognition" key={i}>
                {(block.heading || block.text) && (
                  <div className="paysika-recognition__header">
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.text && <p>{block.text}</p>}
                  </div>
                )}
                <div className="paysika-recognition__gallery">
                  {block.items.map((item, j) => {
                    const src = resolveProjectImage(item.image);
                    if (!src) return null;
                    return (
                      <img
                        key={j}
                        src={src}
                        alt={item.caption || ''}
                        loading="lazy"
                        {...lightboxTrigger(() => onImageClick(src, item.caption || ''), `Enlarge: ${item.caption || 'photo'}`)}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                </div>
              </section>
            );

          case 'quote':
            return (
              <section className="project-detail__section paysika-quote" key={i}>
                <blockquote className="paysika-quote__block">
                  <p>{block.text}</p>
                  {(block.attribution || block.role) && (
                    <footer className="paysika-quote__by">
                      {block.attribution}
                      {block.role ? `${block.attribution ? ', ' : ''}${block.role}` : ''}
                    </footer>
                  )}
                </blockquote>
                {block.image && resolveProjectImage(block.image) && (
                  <img
                    className="paysika-quote__img"
                    src={resolveProjectImage(block.image)}
                    alt={block.attribution || ''}
                    loading="lazy"
                  />
                )}
              </section>
            );

          case 'metrics':
            return (
              <section className="project-detail__section paysika-metrics" key={i}>
                {(block.heading || block.text) && (
                  <div className="paysika-story__intro">
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.text && <p>{block.text}</p>}
                  </div>
                )}
                <div className="paysika-metrics__grid">
                  {block.items.map((m, j) => (
                    <div className="paysika-metrics__item" key={j}>
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
              <section className="project-detail__section paysika-steps" key={i}>
                {(block.eyebrow || block.heading || block.text) && (
                  <div className="paysika-story__intro">
                    {block.eyebrow && <span className="paysika-story__eyebrow">{block.eyebrow}</span>}
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.text && <p>{block.text}</p>}
                  </div>
                )}
                <ol className="paysika-steps__list">
                  {block.items.map((s, j) => {
                    const src = s.image ? resolveProjectImage(s.image) : '';
                    return (
                      <li className="paysika-steps__item" key={j}>
                        <span className="paysika-steps__num">{String(j + 1).padStart(2, '0')}</span>
                        <div className="paysika-steps__body">
                          <h3>{s.title}</h3>
                          {s.text && <p>{s.text}</p>}
                          {src && <img src={src} alt={s.title} loading="lazy" />}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );

          case 'compare':
            return (
              <section className="project-detail__section paysika-compare" key={i}>
                {(block.eyebrow || block.heading || block.text) && (
                  <div className="paysika-story__intro">
                    {block.eyebrow && <span className="paysika-story__eyebrow">{block.eyebrow}</span>}
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.text && <p>{block.text}</p>}
                  </div>
                )}
                <div className="paysika-compare__grid">
                  {[block.left, block.right].map((side, j) => {
                    const src = resolveProjectImage(side.image);
                    return (
                      <figure className="paysika-compare__side" key={j}>
                        {src && <img src={src} alt={side.label} loading="lazy" />}
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
            const src = resolveProjectImage(block.image);
            return (
              <section className="project-detail__section paysika-twocol" key={i}>
                {block.heading && <h2>{block.heading}</h2>}
                <div className={`paysika-twocol__grid${block.imageSide === 'left' ? ' is-reversed' : ''}`}>
                  <div className="paysika-twocol__text">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.markdown}</ReactMarkdown>
                  </div>
                  <figure className="paysika-twocol__media">
                    {src ? (
                      <img src={src} alt={block.heading || ''} loading="lazy" />
                    ) : (
                      <div className="paysika-media__placeholder">Image to add</div>
                    )}
                    {block.caption && <figcaption>{block.caption}</figcaption>}
                  </figure>
                </div>
              </section>
            );
          }

          case 'embed':
            return (
              <section className="project-detail__section paysika-embed" key={i}>
                {(block.heading || block.text) && (
                  <div className="paysika-story__intro">
                    {block.heading && <h2>{block.heading}</h2>}
                    {block.text && <p>{block.text}</p>}
                  </div>
                )}
                <MediaEmbed url={block.url} poster={block.poster} title={block.heading} />
                {block.caption && <p className="paysika-embed__caption">{block.caption}</p>}
              </section>
            );

          case 'richtext':
            return (
              <section className="project-detail__section project-detail__full-content" key={i}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.markdown}</ReactMarkdown>
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
