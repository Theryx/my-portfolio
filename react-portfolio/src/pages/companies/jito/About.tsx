import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';

const FALLBACK_BIO =
  'I am a product designer who works across UX, interface and front-end code. For nearly four years I led design at PaySika, an African fintech, building payments, KYC and card experiences and the token system behind them. I care about clear hierarchy, honest copy and shipping the thing, not just designing it.';

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

  return (
    <section className="jn-section jn-section--page">
      <header className="jn-pagehead">
        <p className="jn-eyebrow">About</p>
        <h1 className="jn-pagehead__title">Ndouken Theryx</h1>
      </header>

      <div className="jn-about">
        <p className="jn-about__lede">{company?.bio || FALLBACK_BIO}</p>

        {company?.tagline && <p className="jn-about__tagline">{company.tagline}</p>}

        <dl className="jn-facts">
          {facts.map((f) => (
            <div key={f.label} className="jn-facts__item">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {about.fun_fact && (
          <p className="jn-about__note">{about.fun_fact}</p>
        )}

        <div className="jn-about__actions">
          <Link to={`${base}/work`} className="jn-btn jn-btn--solid">See the work</Link>
          <a
            className="jn-btn jn-btn--ghost"
            href={`mailto:${company?.social_links?.email || 'ndouken@gmail.com'}`}
          >
            Email me
          </a>
        </div>
      </div>
    </section>
  );
}
