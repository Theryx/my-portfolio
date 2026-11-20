import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveMedia } from './media';
import Loader from './Loader';

const FALLBACK_INTRO =
  'I have spent the past four years owning digital products from rough idea to rollout. Most of that time was at PaySika, where I ran the Shortcut backlog across mobile, web, and operations tooling, alongside shipping checkout and order-tracking flows at Loving Tech.';

const SDLC_STEPS = [
  { num: '01', title: 'Watch the friction first', text: 'Support tickets, Mixpanel drop-offs, and field interviews show what is broken before anyone opens Figma.' },
  { num: '02', title: 'Write down the edge cases', text: 'Every feature gets clear stories, acceptance criteria, and failure states so dev and QA agree on done.' },
  { num: '03', title: 'Keep one source of truth', text: 'One prioritized backlog in Shortcut shared with engineering, design, QA, compliance, and operations.' },
  { num: '04', title: 'Check what changed', text: 'Watch funnel numbers, follow up with users who dropped off, and fix root causes instead of patching.' },
];

export default function Home() {
  const { base, company, projects, loading } = useCompany();

  const intro = company?.hero_subtitle || company?.bio || FALLBACK_INTRO;
  const visible = projects.filter((p) => !p.is_hidden).slice(0, 3);
  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const linkedin = company?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';

  return (
    <>
      <section className="ss-hero">
        <p className="ss-eyebrow">Product Owner &amp; Product Manager</p>
        <h1 className="ss-hero__title">
          Products built for the whole journey, not just the happy path.
        </h1>
        <p className="ss-hero__lede">{intro}</p>

        <div className="ss-hero__actions">
          <Link to={`${base}/work`} className="ss-btn ss-btn--solid">
            See case studies <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to={`${base}/about`} className="ss-btn ss-btn--ghost">
            About &amp; credentials
          </Link>
        </div>

        <div className="ss-proof" aria-label="Key outcomes">
          <div className="ss-proof__item">
            <strong>+40%</strong>
            <span>Retention lift after PaySika onboarding redesign</span>
          </div>
          <div className="ss-proof__item">
            <strong>-60%</strong>
            <span>Fewer support tickets after self-service fixes</span>
          </div>
          <div className="ss-proof__item">
            <strong>30 to 10 min</strong>
            <span>Card handover time with QR validation</span>
          </div>
        </div>
      </section>

      <section className="ss-section">
        <div className="ss-section__head">
          <div>
            <p className="ss-eyebrow">Index // 01 - 03</p>
            <h2 className="ss-h2">Selected case studies</h2>
          </div>
          <Link to={`${base}/work`} className="ss-textlink">
            All projects <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {loading && visible.length === 0 ? (
          <Loader />
        ) : (
          <ul className="ss-index">
            {visible.map((project, i) => {
              const img = resolveMedia(project.image);
              return (
                <li key={project.id} className="ss-index__row">
                  <Link to={`${base}/work/${project.id}`} className="ss-index__link">
                    <span className="ss-index__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ss-index__body">
                      <span className="ss-index__tag">{project.tag}</span>
                      <span className="ss-index__title">{project.title}</span>
                      <span className="ss-index__tagline">{project.tagline}</span>
                      <span className="ss-index__meta">{project.role} · {project.period}</span>
                    </span>
                    {img ? (
                      <span className="ss-index__thumb">
                        <img src={img} alt="" loading="lazy" />
                      </span>
                    ) : (
                      <span className="ss-index__thumb ss-index__thumb--empty" aria-hidden="true" />
                    )}
                    <ArrowRight className="ss-index__arrow" size={18} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="ss-section ss-process">
        <div className="ss-section__head">
          <div>
            <p className="ss-eyebrow">Execution</p>
            <h2 className="ss-h2">How I ship</h2>
          </div>
        </div>
        <ol className="ss-sdlc">
          {SDLC_STEPS.map((step) => (
            <li key={step.num} className="ss-sdlc__step">
              <span className="ss-sdlc__num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ss-contact">
        <div className="ss-contact__inner">
          <div>
            <p className="ss-eyebrow">Contact</p>
            <h2 className="ss-h2">Let's talk product.</h2>
            <p className="ss-muted">
              Based in Douala, Cameroon (UTC+1), working in English and French.
            </p>
          </div>
          <div className="ss-contact__actions">
            <a className="ss-btn ss-btn--solid" href={`mailto:${email}`}>{email}</a>
            <a className="ss-btn ss-btn--ghost" href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
