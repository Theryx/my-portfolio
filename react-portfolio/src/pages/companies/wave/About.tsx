import { Link } from 'react-router-dom';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import type { AboutContent } from '../../../lib/api';
import Loader from './Loader';

interface ExperienceItem {
  role?: string;
  org?: string;
  place?: string;
  period?: string;
}

interface ToolGroup {
  label: string;
  items: string[];
}

export default function About() {
  const { base, company, loading } = useCompany();
  const about = (company?.about_content ?? {}) as AboutContent & Record<string, unknown>;
  const lede = typeof about.lede === 'string' ? about.lede : company?.bio;

  usePageMeta({ title: 'About', description: lede });

  const experience = (Array.isArray(about.experience) ? about.experience : []) as ExperienceItem[];
  const tools = (Array.isArray(about.tools) ? about.tools : []) as ToolGroup[];
  const education = Array.isArray(about.education) ? about.education : [];
  const skills = Array.isArray(about.skills) ? about.skills : [];
  const certifications = Array.isArray(about.certifications) ? about.certifications : [];
  const faqs = Array.isArray(about.faqs) ? about.faqs : [];
  const email = company?.social_links?.email || 'ndouken@gmail.com';

  if (loading && !company) return <Loader />;

  return (
    <section className="lg-section lg-section--page">
      <header className="lg-pagehead">
        <p className="lg-mono-label">About</p>
        <h1 className="lg-pagehead__title">Ndouken Theryx</h1>
      </header>

      <div className="lg-about">
        <div className="lg-about__text">
          {lede && <p className="lg-about__lede">{lede}</p>}
          {company?.intro_expanded_text &&
            company.intro_expanded_text.split('\n\n').map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
          <div className="lg-about__actions">
            <Link to={`${base}/work`} className="lg-btn">See the work</Link>
            <a className="lg-textlink" href={`mailto:${email}`}>Email me</a>
          </div>
        </div>

        <dl className="lg-card">
          <div>
            <dt>Based in</dt>
            <dd>{about.location || 'Douala, Cameroon'}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{about.languages || 'English and French'}</dd>
          </div>
          {tools.map((g) => (
            <div key={g.label}>
              <dt>{g.label}</dt>
              <dd>{g.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>

      {experience.length > 0 && (
        <section className="lg-list">
          <h2 className="lg-h2">Experience</h2>
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
        <section className="lg-list">
          <h2 className="lg-h2">Skills</h2>
          <ul className="lg-tags">
            {skills.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}

      {education.length > 0 && (
        <section className="lg-list">
          <h2 className="lg-h2">Education</h2>
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
        <section className="lg-list">
          <h2 className="lg-h2">Certificates</h2>
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
        <section className="lg-list">
          <h2 className="lg-h2">Questions</h2>
          <div className="lg-faq">
            {faqs.map((f) => (
              <div key={f.question} className="lg-faq__item">
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
