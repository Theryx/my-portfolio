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
  const education = Array.isArray(about.education) ? about.education : [];
  const skills = Array.isArray(about.skills) ? about.skills : [];
  const certifications = Array.isArray(about.certifications) ? about.certifications : [];

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

        {education.length > 0 && (
          <section className="lp-cred">
            <h2 className="lp-cred__title">Education</h2>
            <ul className="lp-cred__list">
              {education.map((e, i) => (
                <li className="lp-cred__item" key={i}>
                  {e.degree && <strong>{e.degree}</strong>}
                  {e.school && <span>{e.school}</span>}
                  {e.period && <em>{e.period}</em>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {skills.length > 0 && (
          <section className="lp-cred">
            <h2 className="lp-cred__title">Skills</h2>
            <ul className="lp-skills">
              {skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>
        )}

        {certifications.length > 0 && (
          <section className="lp-cred">
            <h2 className="lp-cred__title">Licenses and Certifications</h2>
            <ul className="lp-cred__list">
              {certifications.map((c, i) => (
                <li className="lp-cred__item" key={i}>
                  {c.name && <strong>{c.name}</strong>}
                  {c.meta && <em>{c.meta}</em>}
                </li>
              ))}
            </ul>
          </section>
        )}

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
