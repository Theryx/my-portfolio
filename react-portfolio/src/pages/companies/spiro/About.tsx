import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';

const FALLBACK_BIO =
  'I design experiences end to end: the digital screens, the physical moments and the people in between. Most of that work has been at PaySika, an African neo-bank, where I mapped and rebuilt a card journey that runs from the app to a relay point.';

export default function About() {
  const { base, company } = useCompany();
  const about = company?.about_content ?? {};

  usePageMeta({
    title: 'About',
    description: company?.bio || FALLBACK_BIO,
  });

  const facts = [
    { label: 'Based in', value: about.location || 'Douala, Cameroon' },
    { label: 'Languages', value: about.languages || 'English and French' },
  ];

  const faqs = Array.isArray(about.faqs) ? about.faqs : [];

  return (
    <section className="lp-section lp-section--page">
      <header className="lp-pagehead">
        <p className="lp-eyebrow">About</p>
        <h1 className="lp-pagehead__title">Ndouken Theryx</h1>
      </header>

      <div className="lp-about">
        <p className="lp-about__lede">{company?.bio || FALLBACK_BIO}</p>

        {company?.intro_expanded_text && (
          <p className="lp-about__body">{company.intro_expanded_text}</p>
        )}

        {company?.tagline && <p className="lp-about__body">{company.tagline}</p>}

        <dl className="lp-facts">
          {facts.map((f) => (
            <div key={f.label} className="lp-facts__item">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {about.fun_fact && (
          <p className="lp-about__note">{about.fun_fact}</p>
        )}

        <div className="lp-about__actions">
          <Link to={`${base}/work`} className="lp-btn lp-btn--solid">See the work</Link>
          <a
            className="lp-btn lp-btn--ghost"
            href={`mailto:${company?.social_links?.email || 'ndouken@gmail.com'}`}
          >
            Email me
          </a>
        </div>

        {faqs.length > 0 && (
          <div className="lp-faq">
            {faqs.map((f, i) => (
              <div className="lp-faq__item" key={i}>
                <h3>{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
