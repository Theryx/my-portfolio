import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import linkedInPdf from '../assets/img/Linked in Profile.pdf';
import myProfile from '../assets/img/My profile.jfif';

interface LayoutProps {
  children: ReactNode;
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  });
  const location = useLocation();

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
          <Link to="/" onClick={closeMenu} className="header__logo" aria-label="Ndouken Theryx - Home">
            <img src={myProfile} alt="Ndouken Theryx" className="header__logo-img" />
          </Link>

          <nav className="header__nav desktop-nav" aria-label="Main navigation">
            {NAV_LINKS.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`header__nav-link ${active ? 'header__nav-link--active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
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
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={`mobile-menu__link ${location.pathname === link.to ? 'mobile-menu__link--active' : ''}`}
                aria-current={location.pathname === link.to ? 'page' : undefined}
              >
                {link.label}
              </Link>
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

      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <p className="footer__text">
              &copy; {new Date().getFullYear()} Ndouken Theryx. All rights reserved.
            </p>
            <a
              href={linkedInPdf}
              download="Ndouken_ThERYX_LinkedIn_Profile.pdf"
              className="footer__download"
              aria-label="Download CV / Resume (PDF)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
