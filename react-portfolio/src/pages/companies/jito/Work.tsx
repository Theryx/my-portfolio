import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveProjectImage } from '../../../data/projects';
import Loader from './Loader';

export default function Work() {
  const { base, projects, loading } = useCompany();
  const visible = projects.filter((p) => !p.is_hidden);

  return (
    <section className="jn-section jn-section--page">
      <header className="jn-pagehead">
        <p className="jn-eyebrow">Work</p>
        <h1 className="jn-pagehead__title">Selected projects</h1>
        <p className="jn-pagehead__lede">
          Fintech products, design systems and the operational tools around them.
        </p>
      </header>

      {loading && visible.length === 0 ? (
        <Loader />
      ) : visible.length === 0 ? (
        <p className="jn-muted">No projects yet.</p>
      ) : (
        <ul className="jn-index">
          {visible.map((project, i) => {
            const img = resolveProjectImage(project.image);
            return (
              <li key={project.id} className="jn-index__row">
                <Link to={`${base}/work/${project.id}`} className="jn-index__link">
                  <span className="jn-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="jn-index__body">
                    <span className="jn-index__title">{project.title}</span>
                    <span className="jn-index__tagline">{project.tagline}</span>
                    <span className="jn-index__meta">{project.tag} / {project.period}</span>
                  </span>
                  {img && (
                    <span className="jn-index__thumb">
                      <img src={img} alt="" loading="lazy" />
                    </span>
                  )}
                  <ArrowRight className="jn-index__arrow" size={18} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
