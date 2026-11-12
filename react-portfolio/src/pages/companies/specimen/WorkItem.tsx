import { Link, useParams } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Blocks, { ImageToAdd, Markdown } from './Blocks';
import { plateNo, projectExtra, resolveMedia } from './media';
import Loader from './Loader';

export default function WorkItem() {
  const { id } = useParams<{ id: string }>();
  const { base, company, projects, loading } = useCompany();
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
      <section className="sp-section sp-section--page">
        <p className="sp-muted">That project could not be found.</p>
        <Link to={`${base}/work`} className="sp-textlink">Back to the work</Link>
      </section>
    );
  }

  const extra = projectExtra(company, project.id);
  const specimen = extra.specimen ?? [];
  const hero = resolveMedia(project.image);
  const hasBlocks = Array.isArray(project.content_blocks) && project.content_blocks.length > 0;
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const meta = [project.role, project.period, project.location].filter(Boolean);

  return (
    <article className="sp-section sp-section--page">
      <Link to={`${base}/work`} className="sp-back">All work</Link>

      <header className="sp-case__head">
        <p className="sp-label">
          Plate {plateNo(index)} of {String(projects.length).padStart(2, '0')}
          {extra.sector ? ` · ${extra.sector}` : ''}
        </p>
        <h1 className="sp-case__title">{project.title}</h1>
        {project.tagline && <p className="sp-case__lede">{project.tagline}</p>}
        {meta.length > 0 && (
          <ul className="sp-case__meta" aria-label="Role and dates">
            {meta.map((s) => <li key={s}>{s}</li>)}
          </ul>
        )}
      </header>

      {(specimen.length > 0 || (extra.did && extra.did.length > 0)) && (
        <section className="sp-spec" aria-label="Specimen">
          {specimen.map((s, i) => (
            <div key={`${s.label}-${i}`} className={`sp-spec__cell${s.swatch ? ' has-swatch' : ''}`}>
              {s.swatch && <span className="sp-spec__swatch" style={{ background: s.swatch }} aria-hidden="true" />}
              <span className="sp-spec__label">{s.label}</span>
              <span className="sp-spec__value">{s.value}</span>
            </div>
          ))}
          {extra.did && extra.did.length > 0 && (
            <div className="sp-spec__cell sp-spec__cell--did">
              <span className="sp-spec__label">What I did</span>
              <span className="sp-spec__chips">
                {extra.did.map((d) => <span key={d} className="sp-chip">{d}</span>)}
              </span>
            </div>
          )}
        </section>
      )}

      <figure className="sp-case__hero">
        {hero ? <img src={hero} alt="" loading="eager" /> : <ImageToAdd note={`Cover image for ${project.title}`} />}
      </figure>

      {hasBlocks ? (
        <Blocks blocks={project.content_blocks!} />
      ) : (
        <div className="sp-prose sp-prose--solo">
          <Markdown text={project.content || project.description || ''} />
          {project.responsibilities?.length > 0 && (
            <>
              <h2>What I did</h2>
              <ul>{project.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
            </>
          )}
        </div>
      )}

      <nav className="sp-pager" aria-label="Projects">
        {prev ? (
          <Link to={`${base}/work/${prev.id}`} className="sp-pager__link">
            <span>Previous</span>
            {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`${base}/work/${next.id}`} className="sp-pager__link sp-pager__link--next">
            <span>Next</span>
            {next.title}
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
