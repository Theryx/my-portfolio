import { useMemo, useState } from 'react';
import { Plus, ExternalLink, Briefcase, LayoutGrid, List } from 'lucide-react';
import { upsertCompany, type Company, type ApplicationStage } from '../../lib/api';
import { PageHead, Pill, EmptyState } from './ui';
import CompanyEditor from './CompanyEditor';
import { isApplication, STAGES, STAGE_BY_ID, stageOf, siteUrl, fitTone, type StudioData, type Toast } from './data';
import { hrefFor, type Route } from './route';
import { relativeDate } from './entryTypes';

/* Applications: one tailored site per job, tracked from research to outcome. */
export default function ApplicationsPanel({ data, route, navigate, toast }: {
  data: StudioData;
  route: Route;
  navigate: (href: string, opts?: { force?: boolean }) => void;
  toast: Toast;
}) {
  if (route.id) {
    const company = route.id === 'new' ? null : data.companies.find((c) => c.id === route.id) ?? null;
    if (route.id !== 'new' && !company) {
      return data.loading ? <p className="cms-field__hint">Loading…</p> : (
        <EmptyState title="Application not found" action={<a className="cms-btn" href={hrefFor('applications')}>Back to Applications</a>} />
      );
    }
    return (
      <CompanyEditor
        key={route.id}
        company={company}
        data={data}
        tab={route.sub}
        navigate={navigate}
        toast={toast}
        backHref={hrefFor('applications')}
        backLabel="Applications"
      />
    );
  }
  return <Board data={data} navigate={navigate} toast={toast} focusStage={route.query.get('stage')} />;
}

function Board({ data, navigate, toast, focusStage }: {
  data: StudioData;
  navigate: (href: string, opts?: { force?: boolean }) => void;
  toast: Toast;
  focusStage: string | null;
}) {
  const apps = useMemo(() => data.companies.filter(isApplication), [data.companies]);
  const [view, setView] = useState<'board' | 'list'>(() => (window.matchMedia('(max-width: 860px)').matches ? 'list' : 'board'));
  const pipelineReady = data.companies.length === 0 || data.companies.some((c) => 'application' in c);

  const moveTo = async (c: Company, stage: ApplicationStage) => {
    const application = { ...(c.application ?? {}), kind: 'application' as const, stage };
    try {
      const saved = await upsertCompany({ ...c, application });
      data.putCompany({ ...saved, application: saved.application ?? application });
      toast(`${c.name}: ${STAGE_BY_ID[stage].label}`, 'success');
    } catch {
      toast('Could not move it', 'error');
    }
  };

  const byStage = (stage: ApplicationStage) => apps.filter((c) => stageOf(c) === stage);

  return (
    <>
      <PageHead
        title="Applications"
        sub="One tailored portfolio per job. Move each one along as it progresses."
        actions={
          <>
            <div className="cms-segmented" role="group" aria-label="View">
              <button type="button" aria-pressed={view === 'board'} onClick={() => setView('board')}><LayoutGrid size={14} /> Board</button>
              <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={14} /> List</button>
            </div>
            <button type="button" className="cms-btn cms-btn--primary" onClick={() => navigate(hrefFor('applications', 'new'))}><Plus size={15} /> New application</button>
          </>
        }
      />

      {!pipelineReady && (
        <div className="cms-callout cms-callout--warn" style={{ marginBottom: 16 }}>
          <Briefcase size={16} aria-hidden="true" />
          <span>
            Stages, fit scores and notes need a one-time database update. Until then every application shows as
            {' '}"Building site". Run <code>node scripts/migrate-applications.mjs --apply</code> in <code>react-portfolio</code>.
          </span>
        </div>
      )}

      {apps.length === 0 && !data.loading ? (
        <EmptyState icon={<Briefcase size={22} />} title="No applications yet"
          action={<button type="button" className="cms-btn cms-btn--primary" onClick={() => navigate(hrefFor('applications', 'new'))}><Plus size={14} /> New application</button>}>
          Give the tailored-portfolio skill a job description, or add one by hand.
        </EmptyState>
      ) : view === 'board' ? (
        <div className="cms-board">
          {STAGES.map((s) => {
            const list = byStage(s.id);
            return (
              <section key={s.id} className="cms-board__col" aria-label={s.label} style={focusStage === s.id ? { borderColor: 'var(--s-accent)' } : undefined}>
                <h2 className="cms-board__head"><Pill tone={s.tone}>{s.label}</Pill><span className="cms-board__count">{list.length}</span></h2>
                {list.length === 0 ? <p className="cms-board__empty">None</p> : list.map((c) => (
                  <AppCard key={c.id} company={c} navigate={navigate} onMove={pipelineReady ? (st) => moveTo(c, st) : undefined} />
                ))}
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="cms-rows">
          {STAGES.flatMap((s) => byStage(s.id)).map((c) => {
            const s = STAGE_BY_ID[stageOf(c)];
            return (
              <li key={c.id} className="cms-rowitem">
                <button type="button" className="cms-rowitem__main" onClick={() => navigate(hrefFor('applications', c.id))}>
                  <span className="cms-rowitem__title"><span>{c.name}</span><Pill tone={s.tone}>{s.label}</Pill></span>
                  <span className="cms-rowitem__meta">
                    <span>{c.role || 'No role'}</span>
                    {c.application?.fit_score != null && <><span className="cms-dotsep" /><Fit score={c.application.fit_score} /></>}
                    {c.application?.applied_at && <><span className="cms-dotsep" />Applied {relativeDate(c.application.applied_at)}</>}
                  </span>
                </button>
                <div className="cms-rowitem__actions">
                  <a className="cms-icon-btn" href={siteUrl(c)} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${c.name} site`} title="Open site"><ExternalLink size={15} /></a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export function Fit({ score }: { score: number }) {
  return (
    <span className="cms-fit" title={`Fit score ${score} out of 100`}>
      <span className="cms-fit__bar" aria-hidden="true"><span style={{ width: `${score}%`, background: fitTone(score) }} /></span>
      {score}% fit
    </span>
  );
}

function AppCard({ company, navigate, onMove }: {
  company: Company;
  navigate: (href: string) => void;
  onMove?: (stage: ApplicationStage) => void;
}) {
  const app = company.application ?? {};
  return (
    <article className="cms-appcard">
      <button type="button" className="cms-appcard__open" onClick={() => navigate(hrefFor('applications', company.id))}>
        <span className="cms-appcard__name">{company.name}</span>
        <span className="cms-appcard__role">{company.role || 'No role yet'}</span>
      </button>
      <div className="cms-row" style={{ gap: 6 }}>
        {app.fit_score != null ? <Fit score={app.fit_score} /> : <span className="cms-fit">No fit score</span>}
        {app.stage === 'closed' && app.outcome && <Pill plain>{app.outcome}</Pill>}
      </div>
      <div className="cms-appcard__foot">
        {onMove ? (
          <>
            <label className="cms-visually-hidden" htmlFor={`stage-${company.id}`}>Stage for {company.name}</label>
            <select id={`stage-${company.id}`} className="cms-select" value={stageOf(company)} onChange={(e) => onMove(e.target.value as ApplicationStage)}>
              {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </>
        ) : <span />}
        <a className="cms-icon-btn" href={siteUrl(company)} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${company.name} site`} title="Open site">
          <ExternalLink size={15} />
        </a>
      </div>
    </article>
  );
}
