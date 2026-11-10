import { Link, useParams } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Blocks, { ImageToAdd, Markdown } from './Blocks';
import { entryNo, resolveMedia } from './media';
import Loader from './Loader';

export default function WorkItem() {
  const { id } = useParams<{ id: string }>();
  const { base, projects, loading } = useCompany();
  const index = projects.findIndex((p) => p.id === id);
  const project = index >= 0 ? projects[index] : null;

  usePageMeta({
    title: project?.title,
    description: project?.tagline || project?.description,
    image: resolveMedia(project?.image),
    type: 'article',
  });

  if (loading && !project) return <Loader />;

  if (!project) {
    return (
      <section className="cn-section cn-section--page">
        <p className="cn-muted">That entry could not be found.</p>
        <Link to={`${base}/work`} className="cn-textlink">Back to the index</Link>
      </section>
    );
  }

  const hero = resolveMedia(project.image);
  const hasBlocks = Array.isArray(project.content_blocks) && project.content_blocks.length > 0;
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const stamp = [project.location, project.period, project.role].filter(Boolean);

  return (
    <article className="cn-section cn-section--page">
      <Link to={`${base}/work`} className="cn-back">Index</Link>

      <header className="cn-article__head">
        <p className="cn-article__no">
          Entry {entryNo(index)} of {String(projects.length).padStart(2, '0')}
        </p>
        <ul className="cn-article__stamp" aria-label="Where and when">
          {stamp.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <h1 className="cn-article__title">{project.title}</h1>
        {project.tagline && <p className="cn-article__lede">{project.tagline}</p>}
      </header>

      <figure className="cn-article__hero">
        {hero ? <img src={hero} alt="" loading="eager" /> : <ImageToAdd note={`Cover image for ${project.title}`} />}
      </figure>

      {hasBlocks ? (
        <Blocks blocks={project.content_blocks!} />
      ) : (
        <div className="cn-prose cn-prose--solo">
          <Markdown text={project.content || project.description || ''} />
          {project.responsibilities?.length > 0 && (
            <>
              <h2>What I did</h2>
              <ul>{project.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
            </>
          )}
        </div>
      )}

      <nav className="cn-pager" aria-label="Entries">
        {prev ? (
          <Link to={`${base}/work/${prev.id}`} className="cn-pager__link">
            <span>Entry {entryNo(index - 1)}</span>
            {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`${base}/work/${next.id}`} className="cn-pager__link cn-pager__link--next">
            <span>Entry {entryNo(index + 1)}</span>
            {next.title}
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
