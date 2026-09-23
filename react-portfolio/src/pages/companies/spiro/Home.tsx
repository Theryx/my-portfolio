import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveMedia } from './media';
import Loader from './Loader';

const FALLBACK_INTRO =
  'I design experiences end to end: the digital screens, the physical moments and the people in between. Most of that work has been at PaySika, an African neo-bank, where I mapped and rebuilt a card journey that runs from the app to a relay point.';

export default function Home() {
  const { base, company, projects, posts, loading } = useCompany();

  const intro = company?.hero_subtitle || company?.bio || FALLBACK_INTRO;
  const selected = projects.slice(0, 4);
  const latest = posts.slice(0, 2);

  return (
    <>
      <section className="lp-hero">
        <p className="lp-eyebrow">Experience and service design</p>
        <h1 className="lp-hero__title">I design journeys that hold up in the field.</h1>
        <p className="lp-hero__lede">{intro}</p>
        <div className="lp-hero__actions">
          <Link to={`${base}/work`} className="lp-btn lp-btn--solid">
            See the work <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to={`${base}/about`} className="lp-btn lp-btn--ghost">About me</Link>
        </div>
        <div className="lp-hero__loop" aria-hidden="true">
          <span className="lp-hero__node" />
          <span className="lp-hero__track" />
          <span className="lp-hero__node" />
          <span className="lp-hero__track" />
          <span className="lp-hero__node lp-hero__node--end" />
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__head">
          <h2 className="lp-h2">Selected work</h2>
          <Link to={`${base}/work`} className="lp-textlink">All projects</Link>
        </div>

        {loading && selected.length === 0 ? (
          <Loader />
        ) : (
          <ul className="lp-index">
            {selected.map((project, i) => {
              const img = resolveMedia(project.image);
              return (
                <li key={project.id} className="lp-index__row">
                  <Link to={`${base}/work/${project.id}`} className="lp-index__link">
                    <span className="lp-index__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="lp-index__body">
                      <span className="lp-index__tag">{project.tag}</span>
                      <span className="lp-index__title">{project.title}</span>
                      <span className="lp-index__tagline">{project.tagline}</span>
                      <span className="lp-index__meta">{project.role} / {project.period}</span>
                    </span>
                    {img ? (
                      <span className="lp-index__thumb">
                        <img src={img} alt="" loading="lazy" />
                      </span>
                    ) : (
                      <span className="lp-index__thumb lp-index__thumb--empty" aria-hidden="true" />
                    )}
                    <ArrowRight className="lp-index__arrow" size={18} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {latest.length > 0 && (
        <section className="lp-section">
          <div className="lp-section__head">
            <h2 className="lp-h2">Writing</h2>
            <Link to={`${base}/writing`} className="lp-textlink">All writing</Link>
          </div>
          <ul className="lp-index">
            {latest.map((post, i) => (
              <li key={post.id} className="lp-index__row">
                <Link to={`${base}/writing/${post.id}`} className="lp-index__link">
                  <span className="lp-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="lp-index__body">
                    <span className="lp-index__title">{post.title}</span>
                    {post.excerpt && <span className="lp-index__tagline">{post.excerpt}</span>}
                    <span className="lp-index__meta">{post.date} / {post.read_time}</span>
                  </span>
                  <span aria-hidden="true" />
                  <ArrowRight className="lp-index__arrow" size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="lp-contact">
        <h2 className="lp-h2">Get in touch</h2>
        <p className="lp-muted">
          The fastest way to reach me is email.
        </p>
        <a
          className="lp-btn lp-btn--accent"
          href={`mailto:${company?.social_links?.email || 'ndouken@gmail.com'}`}
        >
          {company?.social_links?.email || 'ndouken@gmail.com'}
        </a>
      </section>
    </>
  );
}
