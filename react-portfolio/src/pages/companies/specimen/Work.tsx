import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import Loader from './Loader';
import Rows from './Rows';

export default function Work() {
  const { base, company, projects, loading } = useCompany();

  usePageMeta({ title: 'Work', description: 'Selected work by Ndouken Theryx, product designer in Douala.' });

  return (
    <section className="sp-section sp-section--page">
      <header className="sp-pagehead">
        <p className="sp-label">Work</p>
        <h1 className="sp-pagehead__title">Products and brands</h1>
        <p className="sp-pagehead__lede">
          Apps, design systems, identities, print and campaigns. Each project shows the screens and the things around them.
        </p>
      </header>
      {loading && projects.length === 0 ? <Loader /> : <Rows projects={projects} base={base} company={company} />}
    </section>
  );
}
