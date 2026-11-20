import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';

const FALLBACK_BIO =
  'I am a Product Owner and Product Manager based in Douala, Cameroon. Across PaySika, Loving Tech, CrowdRemit, and GEFONA Digital Foundation, I have run prioritized backlogs in Shortcut, written specs for regulated and retail workflows, and worked closely with engineering, design, QA, and operations teams.';

export default function About() {
  const { base, company } = useCompany();
  const about = company?.about_content ?? {};

  usePageMeta({
    title: 'About',
    description: company?.bio || FALLBACK_BIO,
  });

  const facts = [
    { label: 'Based in', value: about.location || 'Douala, Cameroon' },
    { label: 'Languages', value: about.languages || 'English and French (fluent)' },
    { label: 'Time zone', value: 'UTC+1' },
  ];

  const faqs = Array.isArray(about.faqs) ? about.faqs : [];
  const education = Array.isArray(about.education) ? about.education : [];
  const skills = Array.isArray(about.skills) ? about.skills : [];
  const certifications = Array.isArray(about.certifications) ? about.certifications : [];

  return (
    <section className="ss-section ss-section--page">
      <header className="ss-pagehead">
        <p className="ss-eyebrow">About</p>
        <h1 className="ss-pagehead__title">Ndouken Theryx</h1>
      </header>

      <div className="ss-about">
        <p className="ss-about__lede">{company?.bio || FALLBACK_BIO}</p>

        {company?.intro_expanded_text && (
          <p className="ss-about__body">{company.intro_expanded_text}</p>
        )}

        <dl className="ss-facts">
          {facts.map((f) => (
            <div key={f.label} className="ss-facts__item">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {about.fun_fact && (
          <p className="ss-about__note">{about.fun_fact}</p>
        )}

        <div className="ss-about__actions">
          <Link to={`${base}/work`} className="ss-btn ss-btn--solid">See case studies</Link>
          <a
            className="ss-btn ss-btn--ghost"
            href={`mailto:${company?.social_links?.email || 'ndouken@gmail.com'}`}
          >
            Email me
          </a>
        </div>

        {skills.length > 0 && (
          <section className="ss-cred">
            <h2 className="ss-cred__title">Skills</h2>
            <ul className="ss-skills">
              {skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>
        )}

        {education.length > 0 && (
          <section className="ss-cred">
            <h2 className="ss-cred__title">Education</h2>
            <ul className="ss-cred__list">
              {education.map((e, i) => (
                <li className="ss-cred__item" key={i}>
                  {e.degree && <strong>{e.degree}</strong>}
                  {e.school && <span>{e.school}</span>}
                  {e.period && <em>{e.period}</em>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {certifications.length > 0 && (
          <section className="ss-cred">
            <h2 className="ss-cred__title">Licenses and Certifications</h2>
            <ul className="ss-cred__list">
              {certifications.map((c, i) => (
                <li className="ss-cred__item" key={i}>
                  {c.name && <strong>{c.name}</strong>}
                  {c.meta && <em>{c.meta}</em>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {faqs.length > 0 && (
          <div className="ss-faq">
            {faqs.map((f, i) => (
              <div className="ss-faq__item" key={i}>
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
