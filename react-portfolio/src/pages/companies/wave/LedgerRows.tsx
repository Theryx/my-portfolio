import { Link } from 'react-router-dom';
import type { Company, Project } from '../../../lib/api';
import { projectExtra, resolveMedia, titleOf, type ReceiptItem } from './media';

export function ReceiptStrip({ items, compact = false }: { items: ReceiptItem[]; compact?: boolean }) {
  if (items.length === 0) return null;
  return (
    <dl className={`lg-receipt-strip${compact ? ' lg-receipt-strip--compact' : ''}`}>
      {items.map((f) => (
        <div key={`${f.label}-${f.value}`} className="lg-receipt-strip__cell">
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function LedgerRows({
  projects,
  base,
  company,
}: {
  projects: Project[];
  base: string;
  company: Company | null;
}) {
  if (projects.length === 0) return <p className="lg-muted">Projects are on their way.</p>;

  return (
    <ol className="lg-rows">
      {projects.map((p, i) => {
        const extra = projectExtra(company, p.id);
        const strip = (extra.receipt ?? []).slice(0, 3);
        const thumb = resolveMedia(p.image);
        return (
          <li key={p.id}>
            <Link to={`${base}/work/${p.id}`} className="lg-row">
              <span className="lg-row__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="lg-row__main">
                <span className="lg-row__top">
                  <span className="lg-row__side">{extra.side || p.tag}</span>
                  {p.period && <span className="lg-row__year">{p.period}</span>}
                </span>
                <span className="lg-row__title">{titleOf(company, p)}</span>
                {p.tagline && <span className="lg-row__line">{p.tagline}</span>}
                <ReceiptStrip items={strip} compact />
              </span>
              {thumb ? (
                <span className="lg-row__thumb" aria-hidden="true">
                  <img src={thumb} alt="" loading="lazy" />
                </span>
              ) : (
                <span className="lg-row__arrow" aria-hidden="true">Open case</span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
