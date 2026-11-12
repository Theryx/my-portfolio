import { Link } from 'react-router-dom';
import type { Company, Project } from '../../../lib/api';
import { plateNo, projectExtra } from './media';

// The project list: one row per project, like a list of ventures.
export default function Rows({ projects, base, company }: { projects: Project[]; base: string; company: Company | null }) {
  if (projects.length === 0) return <p className="sp-muted">Projects are on their way.</p>;

  return (
    <ol className="sp-rows">
      {projects.map((p, i) => {
        const extra = projectExtra(company, p.id);
        return (
          <li key={p.id}>
            <Link to={`${base}/work/${p.id}`} className="sp-row">
              <span className="sp-row__no">{plateNo(i)}</span>
              <span className="sp-row__main">
                <span className="sp-row__title">{p.title}</span>
                {p.tagline && <span className="sp-row__line">{p.tagline}</span>}
              </span>
              <span className="sp-row__sector">{extra.sector || p.tag}</span>
              {extra.did && extra.did.length > 0 && (
                <span className="sp-row__did" aria-label="What I did">
                  {extra.did.map((d) => <span key={d} className="sp-chip">{d}</span>)}
                </span>
              )}
              <span className="sp-row__year">{p.period}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
