import { Link } from 'react-router-dom';
import type { Project } from '../../../lib/api';
import { entryNo, resolveMedia } from './media';

// The logbook index: one numbered row per entry, stamped with place and period.
export default function LogIndex({ projects, base }: { projects: Project[]; base: string }) {
  if (projects.length === 0) {
    return <p className="cn-muted">No entries yet.</p>;
  }

  return (
    <ol className="cn-log">
      {projects.map((p, i) => {
        const img = resolveMedia(p.image);
        return (
          <li key={p.id} className="cn-log__row">
            <Link to={`${base}/work/${p.id}`} className="cn-log__link">
              <span className="cn-log__no">{entryNo(i)}</span>
              <span className="cn-log__body">
                <span className="cn-log__title">{p.title}</span>
                <span className="cn-log__stamp">
                  {[p.location, p.period].filter(Boolean).join(' / ')}
                </span>
                {p.tagline && <span className="cn-log__note">{p.tagline}</span>}
              </span>
              {img ? (
                <span className="cn-log__thumb">
                  <img src={img} alt="" loading="lazy" />
                </span>
              ) : (
                <span className="cn-log__thumb cn-log__thumb--empty" aria-hidden="true" />
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
