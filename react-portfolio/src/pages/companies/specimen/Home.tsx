import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import Loader from './Loader';
import Rows from './Rows';
import { plateNo, resolveMedia, themeOf, type SheetTile } from './media';

interface PracticeItem {
  title: string;
  text: string;
}

const FALLBACK_TITLE = "I'm Ndouken, a product designer in Douala. I design the app and the brand around it.";

export default function Home() {
  const { base, company, projects, loading } = useCompany();
  const theme = themeOf(company);
  const sheet = (Array.isArray(theme.sheet) ? theme.sheet : []) as SheetTile[];
  const practice = (Array.isArray(theme.practice) ? theme.practice : []) as PracticeItem[];
  const disciplines = (Array.isArray(theme.disciplines) ? theme.disciplines : []) as string[];
  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const titleOf = (id: string) => projects.find((p) => p.id === id)?.title || '';

  return (
    <>
      <section className="sp-hero">
        <p className="sp-label">Product designer · Douala, Cameroon</p>
        <h1 className="sp-hero__title">{company?.hero_title || FALLBACK_TITLE}</h1>
        {company?.hero_subtitle && <p className="sp-hero__lede">{company.hero_subtitle}</p>}
        {disciplines.length > 0 && (
          <ul className="sp-hero__key" aria-label="What I design">
            {disciplines.map((d, i) => (
              <li key={d}>
                <span className="sp-hero__keyno">{plateNo(i)}</span>
                {d}
              </li>
            ))}
          </ul>
        )}
      </section>

      {sheet.length > 0 && (
        <section className="sp-section" aria-labelledby="sp-sheet-head">
          <div className="sp-section__head">
            <h2 id="sp-sheet-head" className="sp-h2">On the table</h2>
            <p className="sp-label">Screens, print and posts, side by side</p>
          </div>
          <ul className="sp-sheet">
            {sheet.map((t, i) => {
              const src = resolveMedia(t.image);
              if (!src) return null;
              return (
                <li key={`${t.image}-${i}`} className="sp-sheet__tile">
                  <Link to={`${base}/work/${t.project}`} className="sp-sheet__link">
                    <img src={src} alt={t.label || `${t.kind}, ${titleOf(t.project)}`} loading="lazy" />
                    <span className="sp-sheet__cap">
                      <span>{plateNo(i)}</span>
                      <span>{t.kind}</span>
                      <span>{titleOf(t.project)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="sp-section" aria-labelledby="sp-work-head">
        <div className="sp-section__head">
          <h2 id="sp-work-head" className="sp-h2">Selected work</h2>
          <Link to={`${base}/work`} className="sp-textlink">All work</Link>
        </div>
        {loading && projects.length === 0 ? <Loader /> : <Rows projects={projects} base={base} company={company} />}
      </section>

      {practice.length > 0 && (
        <section className="sp-section" aria-labelledby="sp-practice-head">
          <div className="sp-section__head">
            <h2 id="sp-practice-head" className="sp-h2">{company?.philosophy_title || 'How I work'}</h2>
          </div>
          {company?.philosophy_text && <p className="sp-section__lede">{company.philosophy_text}</p>}
          <ol className="sp-practice">
            {practice.map((s, i) => (
              <li key={s.title} className="sp-practice__item">
                <span className="sp-practice__no">{plateNo(i)}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="sp-contact">
        <p className="sp-label">Contact</p>
        <h2 className="sp-contact__title">Have a product or a brand to build?</h2>
        <p className="sp-muted">Email is the fastest way to reach me, in English or in French.</p>
        <a className="sp-btn" href={`mailto:${email}`}>{email}</a>
      </section>
    </>
  );
}
