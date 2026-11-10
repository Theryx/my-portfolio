import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Loader from './Loader';
import LogIndex from './LogIndex';

export default function Work() {
  const { base, projects, loading } = useCompany();

  usePageMeta({ title: 'Work', description: 'Selected work by Ndouken Theryx, UX designer and researcher.' });

  return (
    <section className="cn-section cn-section--page">
      <header className="cn-pagehead">
        <p className="cn-stamp">Index</p>
        <h1 className="cn-pagehead__title">Entries</h1>
        <p className="cn-pagehead__lede">
          Each entry starts where the work happened: who I met, what I watched, and what changed because of it.
        </p>
      </header>
      {loading && projects.length === 0 ? <Loader /> : <LogIndex projects={projects} base={base} />}
    </section>
  );
}
