import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Loader from './Loader';
import LedgerRows from './LedgerRows';

export default function Work() {
  const { base, company, projects, loading } = useCompany();

  usePageMeta({ title: 'Work', description: 'Selected mobile product design work by Ndouken Theryx.' });

  return (
    <section className="lg-section lg-section--page">
      <header className="lg-pagehead">
        <p className="lg-mono-label">Work ledger</p>
        <h1 className="lg-pagehead__title">Selected work</h1>
      </header>
      {loading && projects.length === 0 ? <Loader /> : <LedgerRows projects={projects} base={base} company={company} />}
    </section>
  );
}
