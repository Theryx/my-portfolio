import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Loader from './Loader';
import Rows from './Rows';

export default function Work() {
  const { base, company, projects, loading } = useCompany();

  usePageMeta({ title: 'Work', description: 'Selected work by Ndouken Theryx, product designer.' });

  return (
    <section className="dl-section dl-section--page">
      <header className="dl-pagehead">
        <p className="dl-label">Work</p>
        <h1 className="dl-pagehead__title">Selected work</h1>
      </header>
      {loading && projects.length === 0 ? <Loader /> : <Rows projects={projects} base={base} company={company} />}
    </section>
  );
}
