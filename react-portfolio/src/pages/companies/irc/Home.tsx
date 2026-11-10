import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import Highlight from './Highlight';
import Loader from './Loader';
import LogIndex from './LogIndex';

interface FieldStep {
  title: string;
  text: string;
}

const FALLBACK_TITLE = "Hi, I'm Ndouken. I'm a UX designer and researcher in Douala, Cameroon.";
const FALLBACK_HIGHLIGHT = 'UX designer and researcher';

// Renders the hero title with one phrase marked by the highlighter.
function HeroTitle({ text, mark }: { text: string; mark?: string }) {
  if (!mark || !text.includes(mark)) return <>{text}</>;
  const [before, after] = text.split(mark);
  return (
    <>
      {before}
      <Highlight>{mark}</Highlight>
      {after}
    </>
  );
}

export default function Home() {
  const { base, company, projects, loading } = useCompany();
  const theme = (company?.theme_config ?? {}) as Record<string, unknown>;
  const heroFr = typeof theme.hero_fr === 'string' ? theme.hero_fr : '';
  const highlight = typeof theme.hero_highlight === 'string' ? theme.hero_highlight : FALLBACK_HIGHLIGHT;
  const steps = (Array.isArray(theme.field_steps) ? theme.field_steps : []) as FieldStep[];
  const email = company?.social_links?.email || 'ndouken@gmail.com';

  return (
    <>
      <section className="cn-hero">
        <p className="cn-stamp">Douala, Cameroon</p>
        <h1 className="cn-hero__title">
          <HeroTitle text={company?.hero_title || FALLBACK_TITLE} mark={highlight} />
        </h1>
        {company?.hero_subtitle && <p className="cn-hero__lede">{company.hero_subtitle}</p>}
        {heroFr && (
          <p className="cn-hero__fr" lang="fr">
            {heroFr}
          </p>
        )}
      </section>

      <section className="cn-section" aria-labelledby="cn-log-head">
        <div className="cn-section__head">
          <h2 id="cn-log-head" className="cn-h2">Entries</h2>
          <Link to={`${base}/work`} className="cn-textlink">All entries</Link>
        </div>
        {loading && projects.length === 0 ? <Loader /> : <LogIndex projects={projects} base={base} />}
      </section>

      {steps.length > 0 && (
        <section className="cn-section" aria-labelledby="cn-day-head">
          <div className="cn-section__head">
            <h2 id="cn-day-head" className="cn-h2">{company?.philosophy_title || 'How a field day runs'}</h2>
          </div>
          {company?.philosophy_text && <p className="cn-section__lede">{company.philosophy_text}</p>}
          <ol className="cn-day">
            {steps.map((s, i) => (
              <li key={s.title} className="cn-day__step">
                <span className="cn-day__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="cn-contact">
        <p className="cn-stamp">Contact</p>
        <h2 className="cn-h2">Get in touch</h2>
        <p className="cn-muted">Email is the fastest way to reach me, in English or in French.</p>
        <a className="cn-btn" href={`mailto:${email}`}>{email}</a>
      </section>
    </>
  );
}
