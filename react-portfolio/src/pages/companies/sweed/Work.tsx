import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveMedia } from './media';
import Loader from './Loader';

export default function Work() {
  const { base, projects, loading } = useCompany();
  const visible = projects.filter((p) => !p.is_hidden);

  return (
    <section className="ss-section ss-section--page">
      <header className="ss-pagehead">
        <p className="ss-eyebrow">Work</p>
        <h1 className="ss-pagehead__title">Selected product work</h1>
        <p className="ss-pagehead__lede">
          Three projects covering mobile banking, physical card operations, and online retail in
          Cameroon and Gabon.
        </p>
      </header>

      {loading && visible.length === 0 ? (
        <Loader />
      ) : visible.length === 0 ? (
        <p className="ss-muted">No projects yet.</p>
      ) : (
        <ul className="ss-index">
          {visible.map((project, i) => {
            const img = resolveMedia(project.image);
            return (
              <li key={project.id} className="ss-index__row">
                <Link to={`${base}/work/${project.id}`} className="ss-index__link">
                  <span className="ss-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ss-index__body">
                    <span className="ss-index__tag">{project.tag}</span>
                    <span className="ss-index__title">{project.title}</span>
                    <span className="ss-index__tagline">{project.tagline}</span>
                    <span className="ss-index__meta">{project.role} · {project.period}</span>
                  </span>
                  {img ? (
                    <span className="ss-index__thumb">
                      <img src={img} alt="" loading="lazy" />
                    </span>
                  ) : (
                    <span className="ss-index__thumb ss-index__thumb--empty" aria-hidden="true" />
                  )}
                  <ArrowRight className="ss-index__arrow" size={18} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
