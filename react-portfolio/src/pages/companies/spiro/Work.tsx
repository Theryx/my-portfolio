import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveMedia } from './media';
import Loader from './Loader';

export default function Work() {
  const { base, projects, loading } = useCompany();
  const visible = projects.filter((p) => !p.is_hidden);

  return (
    <section className="lp-section lp-section--page">
      <header className="lp-pagehead">
        <p className="lp-eyebrow">Work</p>
        <h1 className="lp-pagehead__title">Journeys, services and the systems behind them</h1>
        <p className="lp-pagehead__lede">
          Experience design across fintech, education and open source, with the field work that
          decides whether a journey actually holds.
        </p>
      </header>

      {loading && visible.length === 0 ? (
        <Loader />
      ) : visible.length === 0 ? (
        <p className="lp-muted">No projects yet.</p>
      ) : (
        <ul className="lp-index">
          {visible.map((project, i) => {
            const img = resolveMedia(project.image);
            return (
              <li key={project.id} className="lp-index__row">
                <Link to={`${base}/work/${project.id}`} className="lp-index__link">
                  <span className="lp-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="lp-index__body">
                    <span className="lp-index__tag">{project.tag}</span>
                    <span className="lp-index__title">{project.title}</span>
                    <span className="lp-index__tagline">{project.tagline}</span>
                    <span className="lp-index__meta">{project.role} / {project.period}</span>
                  </span>
                  {img ? (
                    <span className="lp-index__thumb">
                      <img src={img} alt="" loading="lazy" />
                    </span>
                  ) : (
                    <span className="lp-index__thumb lp-index__thumb--empty" aria-hidden="true" />
                  )}
                  <ArrowRight className="lp-index__arrow" size={18} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
