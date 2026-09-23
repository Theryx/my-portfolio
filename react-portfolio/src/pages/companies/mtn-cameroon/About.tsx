import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';

const FALLBACK_BIO =
  'I work on digital products end to end: discovery, delivery and the operations around them. Most of that work has been at PaySika, an African neo-bank, where I owned the product backlog and the card service that runs from the app to a relay point.';

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
    <section className="sig-section sig-section--page">
      <header className="sig-pagehead">
        <p className="sig-eyebrow">About</p>
        <h1 className="sig-pagehead__title">Ndouken Theryx</h1>
      </header>

      <div className="sig-about">
        <p className="sig-about__lede">{company?.bio || FALLBACK_BIO}</p>

        {company?.intro_expanded_text && (
          <p className="sig-about__body">{company.intro_expanded_text}</p>
        )}

        {company?.tagline && <p className="sig-about__body">{company.tagline}</p>}

        <dl className="sig-facts">
          {facts.map((f) => (
            <div key={f.label} className="sig-facts__item">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {about.fun_fact && (
          <p className="sig-about__note">{about.fun_fact}</p>
        )}

        <div className="sig-about__actions">
          <Link to={`${base}/work`} className="sig-btn sig-btn--solid">See the work</Link>
          <a
            className="sig-btn sig-btn--ghost"
            href={`mailto:${company?.social_links?.email || 'ndouken@gmail.com'}`}
          >
            Email me
          </a>
        </div>

        {faqs.length > 0 && (
          <div className="sig-faq">
            {faqs.map((f, i) => (
              <div className="sig-faq__item" key={i}>
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
