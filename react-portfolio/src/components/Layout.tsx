import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import myProfile from '../assets/img/My profile.jfif';
import { useProfile } from '../context/ProfileContext';
import ProfileLink from './ProfileLink';

const DEFAULT_RESUME_URL = 'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs';

interface LayoutProps {
  children: ReactNode;
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About me' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
];

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  });
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { profile } = useProfile();
  const resumeUrl = profile?.social_links?.resume || DEFAULT_RESUME_URL;
  const contactEmail = profile?.social_links?.email || 'ndouken@gmail.com';
  const linkedinUrl = profile?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';
  const [emailCopied, setEmailCopied] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <div className="layout">
      <header className="header">
        <div className="container header__inner">
          <ProfileLink to="/" onClick={closeMenu} className="header__logo" aria-label="Ndouken Theryx - Home">
            <img src={myProfile} alt="Ndouken Theryx" className="header__logo-img" />
          </ProfileLink>

          <nav className="header__nav desktop-nav" aria-label="Main navigation">
            {NAV_LINKS.map(link => {
              const active = location.pathname === link.to;
              return (
                <ProfileLink
                  key={link.to}
                  to={link.to}
                  className={`header__nav-link ${active ? 'header__nav-link--active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </ProfileLink>
              );
            })}
          </nav>

          <div className="header__actions">
            <button
              className="header__theme-btn"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <nav className="mobile-menu__nav" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <ProfileLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={`mobile-menu__link ${location.pathname === link.to ? 'mobile-menu__link--active' : ''}`}
                aria-current={location.pathname === link.to ? 'page' : undefined}
              >
                {link.label}
              </ProfileLink>
            ))}
            <button className="mobile-menu__theme-btn" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
              {isDark ? ' Light Mode' : ' Dark Mode'}
            </button>
          </nav>
        </div>
      )}

      <main className="main-content">
        {children}
      </main>

      <footer className="footer footer--bento">
        <div className="container">
          {!isAdmin && (
            <div className="footer__cta">
              <h2 className="footer__cta-title">
                Let's build something <em>people trust</em>.
              </h2>
              <div className="footer__cta-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    navigator.clipboard.writeText(contactEmail);
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 2000);
                  }}
                >
                  {emailCopied ? 'Email copied ✓' : 'Copy my email'}
                </button>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary"
                >
                  LinkedIn
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary"
                  aria-label="Download CV / Resume (PDF)"
                >
                  View CV
                </a>
              </div>
            </div>
          )}
          <div className="footer__meta">
            <p className="footer__text">
              &copy; {new Date().getFullYear()} Ndouken Theryx. All rights reserved.
            </p>
            <p className="footer__text">
              Designed & built in Douala 🇨🇲
            </p>
          </div>
        </div>
      </footer>
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  );
}
