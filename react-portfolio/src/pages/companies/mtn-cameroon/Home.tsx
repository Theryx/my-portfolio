import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveMedia } from './media';
import Loader from './Loader';

const FALLBACK_INTRO =
  'I work on digital products end to end: discovery, delivery and the operations around them. Most of that work has been at PaySika, an African neo-bank, where I owned the product backlog and the card service that runs from the app to a relay point.';

export default function Home() {
  const { base, company, projects, posts, loading } = useCompany();

  const intro = company?.hero_subtitle || company?.bio || FALLBACK_INTRO;
  const selected = projects.slice(0, 4);
  const latest = posts.slice(0, 2);

  return (
    <>
      <section className="sig-hero">
        <p className="sig-eyebrow">Product management and product design</p>
        <h1 className="sig-hero__title">I take products from the first decision to the market.</h1>
        <p className="sig-hero__lede">{intro}</p>
        <div className="sig-hero__actions">
          <Link to={`${base}/work`} className="sig-btn sig-btn--solid">
            See the work <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to={`${base}/about`} className="sig-btn sig-btn--ghost">About me</Link>
        </div>
        <div className="sig-hero__rule" aria-hidden="true" />
      </section>

      <section className="sig-section">
        <div className="sig-section__head">
          <h2 className="sig-h2">Work</h2>
          <Link to={`${base}/work`} className="sig-textlink">All projects</Link>
        </div>

        {loading && selected.length === 0 ? (
          <Loader />
        ) : (
          <ul className="sig-index">
            {selected.map((project, i) => {
              const img = resolveMedia(project.image);
              return (
                <li key={project.id} className="sig-index__row">
                  <Link to={`${base}/work/${project.id}`} className="sig-index__link">
                    <span className="sig-index__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="sig-index__body">
                      <span className="sig-index__tag">{project.tag}</span>
                      <span className="sig-index__title">{project.title}</span>
                      <span className="sig-index__tagline">{project.tagline}</span>
                      <span className="sig-index__meta">{project.role} / {project.period}</span>
                    </span>
                    {img ? (
                      <span className="sig-index__thumb">
                        <img src={img} alt="" loading="lazy" />
                      </span>
                    ) : (
                      <span className="sig-index__thumb sig-index__thumb--empty" aria-hidden="true" />
                    )}
                    <ArrowRight className="sig-index__arrow" size={18} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {latest.length > 0 && (
        <section className="sig-section">
          <div className="sig-section__head">
            <h2 className="sig-h2">Writing</h2>
            <Link to={`${base}/writing`} className="sig-textlink">All writing</Link>
          </div>
          <ul className="sig-index">
            {latest.map((post, i) => (
              <li key={post.id} className="sig-index__row">
                <Link to={`${base}/writing/${post.id}`} className="sig-index__link">
                  <span className="sig-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sig-index__body">
                    <span className="sig-index__title">{post.title}</span>
                    {post.excerpt && <span className="sig-index__tagline">{post.excerpt}</span>}
                    <span className="sig-index__meta">{post.date} / {post.read_time}</span>
                  </span>
                  <span aria-hidden="true" />
                  <ArrowRight className="sig-index__arrow" size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="sig-contact">
        <h2 className="sig-h2">Get in touch</h2>
        <p className="sig-muted">
          The fastest way to reach me is email.
        </p>
        <a
          className="sig-btn sig-btn--accent"
          href={`mailto:${company?.social_links?.email || 'ndouken@gmail.com'}`}
        >
          {company?.social_links?.email || 'ndouken@gmail.com'}
        </a>
      </section>
    </>
  );
}
