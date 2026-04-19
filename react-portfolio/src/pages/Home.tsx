import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import myProfile from '../assets/img/My profile black and white.png';

export default function Home() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <PageTransition>
        <section className="hero">
          <div className="container">
            <div className="hero__inner">
              <div className="hero__content">
                <div className="hero__badge">Loading...</div>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  if (error || !profile) {
    return (
      <PageTransition>
        <section className="hero">
          <div className="container">
            <div className="hero__inner">
              <div className="hero__content">
                <p>Error loading profile</p>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__content">
              <div className="hero__badge">
                {profile.badges?.[0] || 'Available for projects'}
              </div>
              <h1 className="hero__title">
                {profile.hero_title || 'Design Engineer & Tech Entrepreneur'}
              </h1>
              <p className="hero__subtitle">
                {profile.hero_subtitle || 'I design and build user-centric digital products.'}
              </p>
              <div className="hero__cta">
                <Link to="/projects" className="btn btn--primary">View Selected Work</Link>
                <Link to="/about" className="btn btn--secondary">Read My Story</Link>
              </div>
            </div>
            <div className="hero__image">
              <img src={myProfile} alt="Ndouken Theryx" />
            </div>
          </div>
        </div>
      </section>

      <section className="philosophy">
        <div className="container">
          <div className="philosophy__inner">
            <h2 className="philosophy__title">
              {profile.philosophy_title || 'I design experiences that bridge technology and human needs.'}
            </h2>
            <p className="philosophy__text">
              {profile.philosophy_text || 'As a Design Engineer, I bridge the gap between design and development.'}
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}