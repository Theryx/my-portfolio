import { useState, useEffect } from 'react';
import ProfileLink from '../components/ProfileLink';
import { motion, useReducedMotion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import { JourneyModal } from '../components/JourneyModal';
import myProfile from '../assets/img/My profile.jfif';
import { projectImageMap } from '../data/projects';
import { Maximize2, Copy, ExternalLink, Hammer, Newspaper, ArrowUpRight } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
};

export default function Home() {
  const { profile, projects, blogPosts, loading, error } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorLabel, setCursorLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const featuredProject = projects.find((p) => !p.is_hidden) ?? projects[0];
  const latestPost = blogPosts.find((p) => !p.is_hidden) ?? blogPosts[0];
  const yearsLeading = Math.max(1, new Date().getFullYear() - 2021);
  const [yearsRef, yearsValue] = useCountUp(yearsLeading, 1200);
  // First number in the featured project's tagline (e.g. "40" from "Driving 40% user retention…")
  const featuredMetricMatch = featuredProject?.tagline?.match(/(\d+)\s*%/);
  const [metricRef, metricValue] = useCountUp(featuredMetricMatch ? parseInt(featuredMetricMatch[1], 10) : 0, 1600);

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
  const nowStatus = profile?.social_links?.now || 'Shipping my next venture with AI-assisted design & code';

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

  const hoverable = (label: string) => ({
    onMouseEnter: () => {
      setIsHovering(true);
      setCursorLabel(label);
    },
    onMouseLeave: () => {
      setIsHovering(false);
      setCursorLabel('');
    },
  });

  // Gentle tap feedback — tiles are no longer draggable.
  const playful = prefersReducedMotion
    ? {}
    : {
        whileTap: { scale: 0.985 },
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

  // The person's name is always Ndouken Theryx — `profile.name` is a persona
  // label ("Fintech Focus", "Project Manager", etc.) and would read wrong here.
  const profileName = 'Ndouken Theryx';

  return (
    <PageTransition>
      {isHovering && (
        <div
          className="custom-cursor-label"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          {cursorLabel}
        </div>
      )}

      <section className="hero">
        <div className="container">
          <motion.div
            className="bento-grid bento-grid--mosaic"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Intro — 2x2 anchor tile */}
            <motion.div
              variants={tileVariants}
              {...playful}
              className="bento-card bento-card--intro"
              onClick={openModal}
              onKeyDown={handleKeyDown(openModal)}
              {...hoverable('click to expand')}
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
                  </div>
                  <p className="bento-card__text">
                    {profile.hero_title ? (
                      <>
                        I am <strong>Ndouken Theryx</strong>, <strong>{profile.hero_title}</strong>. {profile.hero_subtitle}
                      </>
                    ) : (
                      <>
                        I am <strong>Ndouken Theryx</strong>, a <strong>Product Designer &amp; Builder</strong> who designs and ships digital products end to end.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Email copy */}
            <motion.div
              variants={tileVariants}
              {...playful}
              className="bento-card bento-card--gmail"
              onClick={handleCopyEmail}
              onKeyDown={handleKeyDown(handleCopyEmail)}
              {...hoverable(copied ? 'copied!' : 'click here to copy my email')}
              role="button"
              aria-label={`Copy my email address ${contactEmail}`}
              tabIndex={0}
            >
              <div className="bento-card__icon bento-card__icon--top-right">
                <Copy size={18} />
              </div>
              <div className="bento-card__center-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="56" height="56" className="bento-card__logo" aria-hidden="true">
                  <path fill="#4285F4" d="M24,28.75L4.5,14V39c0,1.66,1.34,3,3,3h6V22L24,31l10.5-9v20h6c1.66,0,3-1.34,3-3V14L24,28.75z"/>
                  <path fill="#EA4335" d="M43.5,9h-39C2.84,9,1.5,10.34,1.5,12v4.5l22.5,17l22.5-17V12C46.5,10.34,45.16,9,43.5,9z"/>
                </svg>
              </div>
              <div className={`bento-card__copied-badge ${copied ? 'visible' : ''}`}>
                Copied!
              </div>
            </motion.div>

            {/* LinkedIn */}
            <motion.div
              variants={tileVariants}
              {...playful}
              className="bento-card bento-card--linkedin"
              onClick={handleLinkedInClick}
              onKeyDown={handleKeyDown(handleLinkedInClick)}
              {...hoverable('connect with me on LinkedIn')}
              role="button"
              aria-label="Connect with me on LinkedIn (opens in new tab)"
              tabIndex={0}
            >
              <div className="bento-card__icon bento-card__icon--top-right">
                <ExternalLink size={18} />
              </div>
              <div className="bento-card__center-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="56" height="56" fill="#0077B5" className="bento-card__logo" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
            </motion.div>

            {/* Featured project — 2x1 */}
            {featuredProject && (
              <motion.div variants={tileVariants} {...playful} className="bento-card bento-card--featured" {...hoverable('see the case study')}>
                <ProfileLink to={`/projects/${featuredProject.id}`} className="bento-card__featured-link" aria-label={`Featured project: ${featuredProject.title}`}>
                  <div className="bento-card__featured-text">
                    <span className="bento-card__mini-label">Featured work</span>
                    <span className="bento-card__featured-title">
                      {featuredProject.title} <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                    {featuredMetricMatch ? (
                      <span className="bento-card__metric" ref={metricRef}>
                        <span className="bento-card__metric-number">{metricValue}%</span>
                        <span className="bento-card__metric-caption">user retention lift</span>
                      </span>
                    ) : (
                      <span className="bento-card__metric-caption">{featuredProject.tagline}</span>
                    )}
                  </div>
                  {projectImageMap[featuredProject.image] && (
                    <img
                      src={projectImageMap[featuredProject.image]}
                      alt=""
                      className="bento-card__featured-img"
                      loading="eager"
                    />
                  )}
                </ProfileLink>
              </motion.div>
            )}

            {/* Years leading design */}
            <motion.div variants={tileVariants} {...playful} className="bento-card bento-card--mini" {...hoverable('since Dec 2021 at PaySika')}>
              <span className="bento-card__metric-number" ref={yearsRef}>{yearsValue}+</span>
              <span className="bento-card__mini-label">{profile.social_links?.metric_label || 'years designing & building products'}</span>
            </motion.div>

            {/* Now building */}
            <motion.div variants={tileVariants} {...playful} className="bento-card bento-card--mini bento-card--now" {...hoverable('what I am up to')}>
              <Hammer size={18} className="bento-card__mini-icon bento-card__hammer" aria-hidden="true" />
              <span className="bento-card__mini-label">Now</span>
              <span className="bento-card__now-text">{nowStatus}</span>
            </motion.div>

            {/* Latest blog post — 2x1 */}
            {latestPost && (
              <motion.div variants={tileVariants} {...playful} className="bento-card bento-card--post" {...hoverable('read the article')}>
                <ProfileLink to={`/blog/${latestPost.id}`} className="bento-card__featured-link" aria-label={`Latest article: ${latestPost.title}`}>
                  <div className="bento-card__featured-text">
                    <span className="bento-card__mini-label"><Newspaper size={14} aria-hidden="true" /> Latest writing</span>
                    <span className="bento-card__featured-title">{latestPost.title} <ArrowUpRight size={18} aria-hidden="true" /></span>
                    <span className="bento-card__metric-caption">{latestPost.read_time}</span>
                  </div>
                </ProfileLink>
              </motion.div>
            )}

          </motion.div>
        </div>
      </section>

      <JourneyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={profile} />
    </PageTransition>
  );
}
