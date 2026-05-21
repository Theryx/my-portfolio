import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import { JourneyModal } from '../components/JourneyModal';
import myProfile from '../assets/img/My profile black and white.png';

export default function Home() {
  const { profile, loading, error } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isHoveringInteractive) {
        setCursorPos({ x: e.clientX, y: e.clientY });
      }
    };

    if (isHoveringInteractive) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHoveringInteractive]);

  const handleMouseEnter = () => setIsHoveringInteractive(true);
  const handleMouseLeave = () => setIsHoveringInteractive(false);
  const openModal = () => setIsModalOpen(true);

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
                <p style={{ color: 'var(--color-error, #e53e3e)' }}>{error || 'Profile not found'}</p>
                <button className="btn btn--primary" onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {isHoveringInteractive && (
        <div 
          className="custom-cursor-label" 
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px` 
          }}
        >
          click to expand
        </div>
      )}
      
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
              <div 
                className="interactive-text"
                onClick={openModal}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <p className="hero__subtitle">
                  {profile.hero_subtitle || 'I design and build user-centric digital products.'}
                </p>
              </div>
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
            <div 
              className="interactive-text"
              onClick={openModal}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <h2 className="philosophy__title">
                {profile.philosophy_title || 'I design experiences that bridge technology and human needs.'}
              </h2>
              <p className="philosophy__text">
                {profile.philosophy_text || 'As a Design Engineer, I bridge the gap between design and development.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <JourneyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageTransition>
  );
}