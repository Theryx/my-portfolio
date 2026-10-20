import { useMemo } from 'react';
import { Plus, ExternalLink, Globe } from 'lucide-react';
import { PageHead, Pill, EmptyState } from './ui';
import CompanyEditor from './CompanyEditor';
import { isApplication, type StudioData, type Toast } from './data';
import { hrefFor, type Route } from './route';

/* Main site: the general profiles behind the public portfolio. The first
   profile marked "Show on the public site" is what visitors see. */
export default function MainSitePanel({ data, route, navigate, toast }: {
  data: StudioData;
  route: Route;
  navigate: (href: string, opts?: { force?: boolean }) => void;
  toast: Toast;
}) {
  const personas = useMemo(() => data.companies.filter((c) => !isApplication(c)), [data.companies]);
  const linkedCount = (id: string) => data.entries.filter((e) => (e.company_ids ?? []).includes(id)).length;

  if (route.id) {
    const company = route.id === 'new' ? null : data.companies.find((c) => c.id === route.id) ?? null;
    if (route.id !== 'new' && !company) {
      return data.loading ? <p className="cms-field__hint">Loading…</p> : (
        <EmptyState title="Profile not found" action={<a className="cms-btn" href={hrefFor('main-site')}>Back to Main site</a>} />
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
        backHref={hrefFor('main-site')}
        backLabel="Main site"
      />
    );
  }

  // Mirrors getActiveProfile(): the first active company, in creation order,
  // across everything (applications included).
  const shown = data.companies.find((c) => c.is_active);

  return (
    <>
      <PageHead
        title="Main site"
        sub="The general profiles behind your public portfolio. Visitors see the first one marked as shown; the others open only through a ?profile= link."
        actions={<button type="button" className="cms-btn cms-btn--primary" onClick={() => navigate(hrefFor('main-site', 'new'))}><Plus size={15} /> New profile</button>}
      />
      {personas.length === 0 ? (
        <EmptyState icon={<Globe size={22} />} title="No profiles yet" />
      ) : (
        <>
        {shown && isApplication(shown) && (
          <div className="cms-callout cms-callout--warn" style={{ marginBottom: 14 }}>
            <Globe size={16} aria-hidden="true" />
            <span>Visitors to the public site currently see <strong>{shown.name}</strong>, an application. Turn off "Show on the public site" in its Site settings, or move a profile above it.</span>
          </div>
        )}
        <ul className="cms-rows">
          {personas.map((p) => (
            <li key={p.id} className="cms-rowitem">
              <button type="button" className="cms-rowitem__main" onClick={() => navigate(hrefFor('main-site', p.id))}>
                <span className="cms-rowitem__title">
                  <span>{p.name}</span>
                  {p.id === shown?.id ? <Pill tone="green">Shown to visitors</Pill> : p.is_active ? <Pill tone="neutral">Marked shown, not first</Pill> : null}
                </span>
                <span className="cms-rowitem__meta">
                  <code>?profile={p.id}</code>
                  <span className="cms-dotsep" />
                  <span>{linkedCount(p.id)} entries</span>
                </span>
              </button>
              <div className="cms-rowitem__actions">
                <a className="cms-icon-btn" href={`/?profile=${p.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${p.name} profile`} title="Open"><ExternalLink size={15} /></a>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </>
  );
}
