import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveProjectImage } from '../../../data/projects';

const FALLBACK_INTRO =
  'I am a product designer who works across UX, interface and front-end code. For nearly four years I led design at PaySika, an African fintech, building payments, KYC and card experiences and the token system behind them.';

export default function Home() {
  const { base, company, projects, posts, loading } = useCompany();

  const intro = company?.hero_subtitle || company?.bio || FALLBACK_INTRO;
  const selected = projects.slice(0, 3);
  const latest = posts.slice(0, 2);

  return (
    <>
      <section className="jn-hero">
        <p className="jn-eyebrow">Product Designer</p>
        <h1 className="jn-hero__title">
          I design financial products, and the systems behind them.
        </h1>
        <p className="jn-hero__lede">{intro}</p>
        <div className="jn-hero__actions">
          <Link to={`${base}/work`} className="jn-btn jn-btn--solid">
            See the work <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to={`${base}/about`} className="jn-btn jn-btn--ghost">About me</Link>
        </div>
      </section>

      <section className="jn-section">
        <div className="jn-section__head">
          <h2 className="jn-h2">Selected work</h2>
          <Link to={`${base}/work`} className="jn-textlink">All projects</Link>
        </div>

        {loading && selected.length === 0 ? (
          <p className="jn-muted">Loading work.</p>
        ) : (
          <ul className="jn-work">
            {selected.map((project) => {
              const img = resolveProjectImage(project.image);
              return (
                <li key={project.id} className="jn-work__item">
                  <Link to={`${base}/work/${project.id}`} className="jn-work__link">
                    {img ? (
                      <span className="jn-work__thumb">
                        <img src={img} alt="" loading="lazy" />
                      </span>
                    ) : (
                      <span className="jn-work__thumb jn-work__thumb--empty" aria-hidden="true" />
                    )}
                    <span className="jn-work__body">
                      <span className="jn-work__tag">{project.tag}</span>
                      <span className="jn-work__title">{project.title}</span>
                      <span className="jn-work__tagline">{project.tagline}</span>
                      <span className="jn-work__meta">{project.role} / {project.period}</span>
                    </span>
                    <ArrowRight className="jn-work__arrow" size={18} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {latest.length > 0 && (
        <section className="jn-section">
          <div className="jn-section__head">
            <h2 className="jn-h2">Writing</h2>
            <Link to={`${base}/writing`} className="jn-textlink">All writing</Link>
          </div>
          <ul className="jn-writing">
            {latest.map((post) => (
              <li key={post.id} className="jn-writing__item">
                <Link to={`${base}/writing/${post.id}`} className="jn-writing__link">
                  <span className="jn-writing__title">{post.title}</span>
                  <span className="jn-writing__meta">{post.date} / {post.read_time}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="jn-contact">
        <h2 className="jn-h2">Get in touch</h2>
        <p className="jn-muted">
          Open to product design work. The fastest way to reach me is email.
        </p>
        <a
          className="jn-btn jn-btn--solid"
          href={`mailto:${company?.social_links?.email || 'ndouken@gmail.com'}`}
        >
          {company?.social_links?.email || 'ndouken@gmail.com'}
        </a>
      </section>
    </>
  );
}
