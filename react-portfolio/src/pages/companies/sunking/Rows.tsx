import { Link } from 'react-router-dom';
import type { Company, Project } from '../../../lib/api';
import { projectExtra, titleOf, type FieldItem } from './media';

/** The field card as a compact strip: device, network, languages. */
export function FieldStrip({ items, compact = false }: { items: FieldItem[]; compact?: boolean }) {
  if (items.length === 0) return null;
  return (
    <dl className={`dl-field${compact ? ' dl-field--compact' : ''}`}>
      {items.map((f) => (
        <div key={`${f.label}-${f.value}`} className="dl-field__cell">
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// The project list: one large row per project, its side of the service and its field strip.
export default function Rows({ projects, base, company }: { projects: Project[]; base: string; company: Company | null }) {
  if (projects.length === 0) return <p className="dl-muted">Projects are on their way.</p>;

  return (
    <ol className="dl-rows">
      {projects.map((p, i) => {
        const extra = projectExtra(company, p.id);
        const strip = (extra.field ?? []).filter((f) => f.label !== 'Outcome').slice(0, 3);
        return (
          <li key={p.id}>
            <Link to={`${base}/work/${p.id}`} className="dl-row">
              <span className="dl-row__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="dl-row__main">
                <span className="dl-row__side">{extra.side || p.tag}</span>
                <span className="dl-row__title">{titleOf(company, p)}</span>
                {p.tagline && <span className="dl-row__line">{p.tagline}</span>}
                <FieldStrip items={strip} compact />
              </span>
              <span className="dl-row__year">{p.period}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
