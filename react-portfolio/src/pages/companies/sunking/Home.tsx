import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import Loader from './Loader';
import Rows from './Rows';
import { themeOf } from './media';

interface PracticeItem {
  title: string;
  text: string;
}

interface Fact {
  value: string;
  label: string;
}

const FALLBACK_TITLE = "I'm Ndouken, a product designer from Cameroon.";

export default function Home() {
  const { base, company, projects, loading } = useCompany();
  const theme = themeOf(company);
  const practice = (Array.isArray(theme.practice) ? theme.practice : []) as PracticeItem[];
  const facts = (Array.isArray(theme.facts) ? theme.facts : []) as Fact[];
  const email = company?.social_links?.email || 'ndouken@gmail.com';

  return (
    <>
      <section className="dl-hero">
        <p className="dl-label">Product designer · English and French</p>
        <h1 className="dl-hero__title">{company?.hero_title || FALLBACK_TITLE}</h1>
        {company?.hero_subtitle && <p className="dl-hero__lede">{company.hero_subtitle}</p>}
        <div className="dl-hero__actions">
          <Link to={`${base}/work`} className="dl-btn">See the work</Link>
          <a href={`mailto:${email}`} className="dl-btn dl-btn--ghost">Email me</a>
        </div>
        {facts.length > 0 && (
          <dl className="dl-facts">
            {facts.map((f) => (
              <div key={f.label} className="dl-facts__item">
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="dl-section" aria-labelledby="dl-work-head">
        <div className="dl-section__head">
          <h2 id="dl-work-head" className="dl-h2">{(theme.work_title as string) || 'Selected work'}</h2>
          <Link to={`${base}/work`} className="dl-textlink">All work</Link>
        </div>
        {typeof theme.work_lede === 'string' && <p className="dl-section__lede">{theme.work_lede}</p>}
        {loading && projects.length === 0 ? <Loader /> : <Rows projects={projects} base={base} company={company} />}
      </section>

      {practice.length > 0 && (
        <section className="dl-section" aria-labelledby="dl-practice-head">
          <div className="dl-section__head">
            <h2 id="dl-practice-head" className="dl-h2">{company?.philosophy_title || 'How I work'}</h2>
          </div>
          {company?.philosophy_text && <p className="dl-section__lede">{company.philosophy_text}</p>}
          <ol className="dl-practice">
            {practice.map((s, i) => (
              <li key={s.title} className="dl-practice__item">
                <span className="dl-practice__no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="dl-contact">
        <p className="dl-label">Contact</p>
        <h2 className="dl-contact__title">Say hello</h2>
        <p className="dl-contact__text">Email is the quickest way to reach me, in English or French.</p>
        <a className="dl-btn dl-btn--invert" href={`mailto:${email}`}>{email}</a>
      </section>
    </>
  );
}
