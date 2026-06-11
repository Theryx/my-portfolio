import { useState, useEffect } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import { JourneyModal } from '../components/JourneyModal';
import myProfile from '../assets/img/My profile.jfif';
import { Maximize2, Copy, ExternalLink } from 'lucide-react';

export default function Home() {
  const { profile, loading, error } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorLabel, setCursorLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const openModal = () => setIsModalOpen(true);

  const contactEmail = profile?.social_links?.email || 'ndouken@gmail.com';
  const linkedinUrl = profile?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';

  const handleCopyEmail = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setCursorLabel('copied!');
    setTimeout(() => {
      setCopied(false);
      setCursorLabel((prev) => (prev === 'copied!' ? 'click here to copy my email' : prev));
    }, 2000);
  };

  const handleLinkedInClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (action: (e: React.KeyboardEvent) => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(e);
    }
  };

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

  const profileName = profile.name === 'Default' || !profile.name ? 'Ndouken Theryx' : profile.name;

  return (
    <PageTransition>
      {isHovering && (
        <div 
          className="custom-cursor-label" 
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px` 
          }}
        >
          {cursorLabel}
        </div>
      )}
      
      <section className="hero">
        <div className="container">
          <div className="bento-grid">
            {/* Card 1: Intro Card */}
            <div 
              className="bento-card bento-card--intro"
              onClick={openModal}
              onKeyDown={handleKeyDown(openModal)}
              onMouseEnter={() => {
                setIsHovering(true);
                setCursorLabel('click to expand');
              }}
              onMouseLeave={() => {
                setIsHovering(false);
                setCursorLabel('');
              }}
              role="button"
              aria-label="Read my journey details"
              tabIndex={0}
            >
              <div className="bento-card__icon bento-card__icon--top-right">
                <Maximize2 size={18} />
              </div>
              <div className="bento-card__intro-inner">
                <div className="bento-card__profile-wrapper">
                  <img src={myProfile} alt={profileName} className="bento-card__profile-image" />
                </div>
                <div className="bento-card__intro-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="bento-card__greeting">Heyyy 👋</span>
                    {profile.badges && profile.badges.map((badge, idx) => (
                      <span key={idx} className="hero__badge" style={{ margin: 0, padding: '4px 10px', fontSize: '11px' }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="bento-card__text">
                    I am <strong>{profileName}</strong>, a passionate <strong>Design Engineer</strong> and <strong>Tech Entrepreneur</strong> who believes that the best digi...
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Gmail Card */}
            <div 
              className="bento-card bento-card--gmail"
              onClick={handleCopyEmail}
              onKeyDown={handleKeyDown(handleCopyEmail)}
              onMouseEnter={() => {
                setIsHovering(true);
                setCursorLabel(copied ? 'copied!' : 'click here to copy my email');
              }}
              onMouseLeave={() => {
                setIsHovering(false);
                setCursorLabel('');
              }}
              role="button"
              aria-label={`Copy my email address ${contactEmail}`}
              tabIndex={0}
            >
              <div className="bento-card__icon bento-card__icon--top-right">
                <Copy size={18} />
              </div>
              <div className="bento-card__center-icon">
                {/* High-fidelity Gmail Logo SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="56" height="56" className="bento-card__logo">
                  <path fill="#4285F4" d="M24,28.75L4.5,14V39c0,1.66,1.34,3,3,3h6V22L24,31l10.5-9v20h6c1.66,0,3-1.34,3-3V14L24,28.75z"/>
                  <path fill="#EA4335" d="M43.5,9h-39C2.84,9,1.5,10.34,1.5,12v4.5l22.5,17l22.5-17V12C46.5,10.34,45.16,9,43.5,9z"/>
                </svg>
              </div>
              <div className={`bento-card__copied-badge ${copied ? 'visible' : ''}`}>
                Copied!
              </div>
            </div>

            {/* Card 3: LinkedIn Card */}
            <div 
              className="bento-card bento-card--linkedin"
              onClick={handleLinkedInClick}
              onKeyDown={handleKeyDown(handleLinkedInClick)}
              onMouseEnter={() => {
                setIsHovering(true);
                setCursorLabel('Click here to connect with me on linked in');
              }}
              onMouseLeave={() => {
                setIsHovering(false);
                setCursorLabel('');
              }}
              role="button"
              aria-label="Connect with me on LinkedIn (opens in new tab)"
              tabIndex={0}
            >
              <div className="bento-card__icon bento-card__icon--top-right">
                <ExternalLink size={18} />
              </div>
              <div className="bento-card__center-icon">
                {/* High-fidelity LinkedIn Brand Logo SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="56" height="56" fill="#0077B5" className="bento-card__logo">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>


      <JourneyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageTransition>
  );
}