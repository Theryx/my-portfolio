import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveMedia } from './media';
import Loader from './Loader';

export default function Work() {
  const { base, projects, loading } = useCompany();
  const visible = projects.filter((p) => !p.is_hidden);

  return (
    <section className="sig-section sig-section--page">
      <header className="sig-pagehead">
        <p className="sig-eyebrow">Work</p>
        <h1 className="sig-pagehead__title">Projects and product lines</h1>
        <p className="sig-pagehead__lede">
          Product ownership, lifecycle and delivery work across fintech, education and open source.
        </p>
      </header>

      {loading && visible.length === 0 ? (
        <Loader />
      ) : visible.length === 0 ? (
        <p className="sig-muted">No projects yet.</p>
      ) : (
        <ul className="sig-index">
          {visible.map((project, i) => {
            const img = resolveMedia(project.image);
            return (
              <li key={project.id} className="sig-index__row">
                <Link to={`${base}/work/${project.id}`} className="sig-index__link">
                  <span className="sig-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sig-index__body">
                    <span className="sig-index__tag">{project.tag}</span>
                    <span className="sig-index__title">{project.title}</span>
                    <span className="sig-index__tagline">{project.tagline}</span>
                    <span className="sig-index__meta">{project.role} / {project.period}</span>
                  </span>
                  {img ? (
                    <span className="sig-index__thumb">
                      <img src={img} alt="" loading="lazy" />
                    </span>
                  ) : (
                    <span className="sig-index__thumb sig-index__thumb--empty" aria-hidden="true" />
                  )}
                  <ArrowRight className="sig-index__arrow" size={18} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
