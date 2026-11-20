import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Blocks, { SsMarkdown, ImagePlaceholder } from './Blocks';
import { resolveMedia } from './media';
import Loader from './Loader';

export default function WorkItem() {
  const { id } = useParams<{ id: string }>();
  const { base, projects, loading } = useCompany();
  const project = projects.find((p) => p.id === id) ?? null;

  usePageMeta({
    title: project?.title,
    description: project?.tagline || project?.description,
    image: resolveMedia(project?.image),
    type: 'article',
  });

  if (loading && !project) {
    return <Loader />;
  }

  if (!project) {
    return (
      <section className="ss-section ss-section--page">
        <p className="ss-muted">That project could not be found.</p>
        <Link to={`${base}/work`} className="ss-textlink">Back to work</Link>
      </section>
    );
  }

  const hero = resolveMedia(project.image);
  const hasBlocks = Array.isArray(project.content_blocks) && project.content_blocks.length > 0;

  return (
    <article className="ss-section ss-section--page">
      <Link to={`${base}/work`} className="ss-back">
        <ArrowLeft size={16} aria-hidden="true" /> Work
      </Link>

      <header className="ss-article__head">
        <p className="ss-eyebrow">{project.tag}</p>
        <h1 className="ss-article__title">{project.title}</h1>
        {project.tagline && <p className="ss-article__lede">{project.tagline}</p>}
        <dl className="ss-facts">
          {project.role && (
            <div className="ss-facts__item">
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          {project.period && (
            <div className="ss-facts__item">
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
          )}
          {project.location && (
            <div className="ss-facts__item">
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
          )}
          {project.site && (
            <div className="ss-facts__item">
              <dt>Site</dt>
              <dd><a href={project.site} target="_blank" rel="noopener noreferrer">Visit</a></dd>
            </div>
          )}
        </dl>
      </header>

      {hero ? (
        <figure className="ss-article__hero">
          <img src={hero} alt={project.title} loading="eager" />
        </figure>
      ) : (
        <div className="ss-article__hero ss-article__hero--empty">
          <ImagePlaceholder note={`Cover image for ${project.title}`} />
        </div>
      )}

      {hasBlocks ? (
        <Blocks blocks={project.content_blocks!} resolveImage={resolveMedia} />
      ) : project.content ? (
        <div className="ss-prose">
          <SsMarkdown text={project.content} />
        </div>
      ) : (
        <div className="ss-prose">
          {project.description && (
            <section>
              <h2>Overview</h2>
              <SsMarkdown text={project.description} />
            </section>
          )}

          {project.responsibilities && project.responsibilities.length > 0 && (
            <section>
              <h2>What I did</h2>
              <ul>
                {project.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </section>
          )}

          {project.challenge_text && (
            <section>
              <h2>{project.challenge || 'The challenge'}</h2>
              <SsMarkdown text={project.challenge_text} />
            </section>
          )}

          {project.solution_text && (
            <section>
              <h2>{project.solution || 'The solution'}</h2>
              <SsMarkdown text={project.solution_text} />
            </section>
          )}

          {project.result_text && (
            <section>
              <h2>{project.result || 'The result'}</h2>
              <SsMarkdown text={project.result_text} />
            </section>
          )}
        </div>
      )}
    </article>
  );
}
