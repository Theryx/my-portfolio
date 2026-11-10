import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import type { AboutContent } from '../../../lib/api';

interface ExperienceItem {
  role?: string;
  org?: string;
  place?: string;
  period?: string;
}

export default function About() {
  const { base, company } = useCompany();
  const about = (company?.about_content ?? {}) as AboutContent & Record<string, unknown>;
  const theme = (company?.theme_config ?? {}) as Record<string, unknown>;
  const lede = typeof about.lede === 'string' ? about.lede : company?.bio;
  const aboutFr = typeof theme.about_fr === 'string' ? theme.about_fr : '';

  usePageMeta({ title: 'About', description: lede });

  const experience = (Array.isArray(about.experience) ? about.experience : []) as ExperienceItem[];
  const places = (Array.isArray(about.places) ? about.places : []) as string[];
  const education = Array.isArray(about.education) ? about.education : [];
  const skills = Array.isArray(about.skills) ? about.skills : [];
  const certifications = Array.isArray(about.certifications) ? about.certifications : [];
  const faqs = Array.isArray(about.faqs) ? about.faqs : [];
  const email = company?.social_links?.email || 'ndouken@gmail.com';

  return (
    <section className="cn-section cn-section--page">
      <header className="cn-pagehead">
        <p className="cn-stamp">About</p>
        <h1 className="cn-pagehead__title">Ndouken Theryx</h1>
      </header>

      <div className="cn-about">
        <div className="cn-about__text">
          {lede && <p className="cn-about__lede">{lede}</p>}
          {company?.intro_expanded_text && <p>{company.intro_expanded_text}</p>}
          {aboutFr && (
            <p className="cn-about__fr" lang="fr">
              {aboutFr}
            </p>
          )}
          <div className="cn-about__actions">
            <Link to={`${base}/work`} className="cn-btn">See the work</Link>
            <a className="cn-textlink" href={`mailto:${email}`}>Email me</a>
          </div>
        </div>

        <dl className="cn-card">
          <div>
            <dt>Based in</dt>
            <dd>{about.location || 'Douala, Cameroon'}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{about.languages || 'English and French'}</dd>
          </div>
          {places.length > 0 && (
            <div>
              <dt>Worked in the field at</dt>
              <dd>
                <ul className="cn-card__places">
                  {places.map((pl) => <li key={pl}>{pl}</li>)}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {experience.length > 0 && (
        <section className="cn-list">
          <h2 className="cn-h2">Experience</h2>
          <ul>
            {experience.map((e, i) => (
              <li key={i}>
                <strong>{e.role}</strong>
                <span>{[e.org, e.place].filter(Boolean).join(', ')}</span>
                {e.period && <em>{e.period}</em>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="cn-list">
          <h2 className="cn-h2">Skills</h2>
          <ul className="cn-tags">
            {skills.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}

      {education.length > 0 && (
        <section className="cn-list">
          <h2 className="cn-h2">Education</h2>
          <ul>
            {education.map((e, i) => (
              <li key={i}>
                <strong>{e.degree}</strong>
                <span>{e.school}</span>
                {e.period && <em>{e.period}</em>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="cn-list">
          <h2 className="cn-h2">Certificates</h2>
          <ul>
            {certifications.map((c, i) => (
              <li key={i}>
                <strong>{c.name}</strong>
                {c.meta && <em>{c.meta}</em>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="cn-list">
          <h2 className="cn-h2">Questions</h2>
          <div className="cn-faq">
            {faqs.map((f) => (
              <div key={f.question} className="cn-faq__item">
                <h3>{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
