import { Link, useParams } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Blocks, { ImageToAdd, Markdown } from './Blocks';
import { projectExtra, resolveMedia, titleOf } from './media';
import { FieldStrip } from './Rows';
import Loader from './Loader';

export default function WorkItem() {
  const { id } = useParams<{ id: string }>();
  const { base, company, projects, loading } = useCompany();
  const index = projects.findIndex((p) => p.id === id);
  const project = index >= 0 ? projects[index] : null;

  usePageMeta({
    title: project ? titleOf(company, project) : undefined,
    description: project?.tagline || project?.description,
    image: resolveMedia(project?.image),
    type: 'article',
  });

  if (loading && !project) return <Loader />;

  if (!project) {
    return (
      <section className="dl-section dl-section--page">
        <p className="dl-muted">That project could not be found.</p>
        <Link to={`${base}/work`} className="dl-textlink">Back to the work</Link>
      </section>
    );
  }

  const extra = projectExtra(company, project.id);
  const field = extra.field ?? [];
  const hero = resolveMedia(project.image);
  const hasBlocks = Array.isArray(project.content_blocks) && project.content_blocks.length > 0;
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const meta = [project.role, project.period, project.location].filter(Boolean);

  return (
    <article className="dl-section dl-section--page">
      <Link to={`${base}/work`} className="dl-back">All work</Link>

      <header className="dl-case__head">
        <p className="dl-label">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          {extra.side ? ` · ${extra.side}` : ''}
        </p>
        <h1 className="dl-case__title">{titleOf(company, project)}</h1>
        {project.tagline && <p className="dl-case__lede">{project.tagline}</p>}
        {meta.length > 0 && (
          <ul className="dl-case__meta" aria-label="Role and dates">
            {meta.map((s) => <li key={s}>{s}</li>)}
          </ul>
        )}
      </header>

      {field.length > 0 && (
        <section className="dl-fieldcard" aria-labelledby="dl-fieldcard-head">
          <h2 id="dl-fieldcard-head" className="dl-label">At a glance</h2>
          <FieldStrip items={field} />
        </section>
      )}

      <figure className="dl-case__hero">
        {hero ? <img src={hero} alt="" loading="eager" /> : <ImageToAdd note={`Cover image for ${titleOf(company, project)}`} />}
      </figure>

      {hasBlocks ? (
        <Blocks blocks={project.content_blocks!} />
      ) : (
        <div className="dl-prose dl-prose--solo">
          <Markdown text={project.content || project.description || ''} />
          {project.responsibilities?.length > 0 && (
            <>
              <h2>What I did</h2>
              <ul>{project.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
            </>
          )}
        </div>
      )}

      <nav className="dl-pager" aria-label="Projects">
        {prev ? (
          <Link to={`${base}/work/${prev.id}`} className="dl-pager__link">
            <span>Previous</span>
            {titleOf(company, prev)}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`${base}/work/${next.id}`} className="dl-pager__link dl-pager__link--next">
            <span>Next</span>
            {titleOf(company, next)}
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
