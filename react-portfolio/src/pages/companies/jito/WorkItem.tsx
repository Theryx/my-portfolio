import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveProjectImage } from '../../../data/projects';
import { usePageMeta } from '../../../hooks/usePageMeta';

export default function WorkItem() {
  const { id } = useParams<{ id: string }>();
  const { base, projects, loading } = useCompany();
  const project = projects.find((p) => p.id === id) ?? null;

  usePageMeta({
    title: project?.title,
    description: project?.tagline || project?.description,
    image: project?.image,
    type: 'article',
  });

  if (loading && !project) {
    return <section className="jn-section jn-section--page"><p className="jn-muted">Loading.</p></section>;
  }

  if (!project) {
    return (
      <section className="jn-section jn-section--page">
        <p className="jn-muted">That project could not be found.</p>
        <Link to={`${base}/work`} className="jn-textlink">Back to work</Link>
      </section>
    );
  }

  const hero = resolveProjectImage(project.image);

  return (
    <article className="jn-section jn-section--page">
      <Link to={`${base}/work`} className="jn-back">
        <ArrowLeft size={16} aria-hidden="true" /> Work
      </Link>

      <header className="jn-article__head">
        <p className="jn-eyebrow">{project.tag}</p>
        <h1 className="jn-article__title">{project.title}</h1>
        {project.tagline && <p className="jn-article__lede">{project.tagline}</p>}
        <dl className="jn-facts">
          {project.role && (
            <div className="jn-facts__item">
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          {project.period && (
            <div className="jn-facts__item">
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
          )}
          {project.location && (
            <div className="jn-facts__item">
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
          )}
          {project.site && (
            <div className="jn-facts__item">
              <dt>Site</dt>
              <dd><a href={project.site} target="_blank" rel="noopener noreferrer">Visit</a></dd>
            </div>
          )}
        </dl>
      </header>

      {hero && (
        <figure className="jn-article__hero">
          <img src={hero} alt={project.title} loading="eager" />
        </figure>
      )}

      <div className="jn-prose">
        {project.description && (
          <section>
            <h2>Overview</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.challenge_text}</ReactMarkdown>
          </section>
        )}

        {project.solution_text && (
          <section>
            <h2>{project.solution || 'The solution'}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.solution_text}</ReactMarkdown>
          </section>
        )}

        {project.result_text && (
          <section>
            <h2>{project.result || 'The result'}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.result_text}</ReactMarkdown>
          </section>
        )}

        {project.content && (
          <section>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => {
                  const resolved = resolveProjectImage(decodeURIComponent(src || '')) || src;
                  return <img src={resolved} alt={alt || ''} loading="lazy" />;
                },
              }}
            >
              {project.content}
            </ReactMarkdown>
          </section>
        )}
      </div>
    </article>
  );
}
