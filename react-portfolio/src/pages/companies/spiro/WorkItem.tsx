import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Blocks, { LpMarkdown, ImagePlaceholder } from './Blocks';
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
      <section className="lp-section lp-section--page">
        <p className="lp-muted">That project could not be found.</p>
        <Link to={`${base}/work`} className="lp-textlink">Back to work</Link>
      </section>
    );
  }

  const hero = resolveMedia(project.image);
  const hasBlocks = Array.isArray(project.content_blocks) && project.content_blocks.length > 0;

  return (
    <article className="lp-section lp-section--page">
      <Link to={`${base}/work`} className="lp-back">
        <ArrowLeft size={16} aria-hidden="true" /> Work
      </Link>

      <header className="lp-article__head">
        <p className="lp-eyebrow">{project.tag}</p>
        <h1 className="lp-article__title">{project.title}</h1>
        {project.tagline && <p className="lp-article__lede">{project.tagline}</p>}
        <dl className="lp-facts">
          {project.role && (
            <div className="lp-facts__item">
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          {project.period && (
            <div className="lp-facts__item">
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
          )}
          {project.location && (
            <div className="lp-facts__item">
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
          )}
          {project.site && (
            <div className="lp-facts__item">
              <dt>Site</dt>
              <dd><a href={project.site} target="_blank" rel="noopener noreferrer">Visit</a></dd>
            </div>
          )}
        </dl>
      </header>

      {hero ? (
        <figure className="lp-article__hero">
          <img src={hero} alt={project.title} loading="eager" />
        </figure>
      ) : (
        <div className="lp-article__hero lp-article__hero--empty">
          <ImagePlaceholder note={`Cover image for ${project.title}`} />
        </div>
      )}

      {hasBlocks ? (
        <Blocks blocks={project.content_blocks!} resolveImage={resolveMedia} />
      ) : project.content ? (
        <div className="lp-prose">
          <LpMarkdown text={project.content} />
        </div>
      ) : (
        <div className="lp-prose">
          {project.description && (
            <section>
              <h2>Overview</h2>
              <LpMarkdown text={project.description} />
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
              <LpMarkdown text={project.challenge_text} />
            </section>
          )}

          {project.solution_text && (
            <section>
              <h2>{project.solution || 'The solution'}</h2>
              <LpMarkdown text={project.solution_text} />
            </section>
          )}

          {project.result_text && (
            <section>
              <h2>{project.result || 'The result'}</h2>
              <LpMarkdown text={project.result_text} />
            </section>
          )}
        </div>
      )}
    </article>
  );
}
