import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useCompany } from '../../../context/CompanyContext';
import './site.css';

const NAV = [
  { to: 'work', label: 'Work' },
  { to: 'about', label: 'About' },
];

const DEFAULT_RESUME_URL =
  'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs';

function LoopMark() {
  return (
    <svg className="lp-mark" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 4a12 12 0 0 1 10.4 6" />
      <path d="M16 28a12 12 0 0 1-10.4-6" />
      <path d="M27 9.6l-3.4 1.6 3.1 2.6z" />
      <path d="M5 22.4l3.4-1.6-3.1-2.6z" />
    </svg>
  );
}

export default function Site({ children }: { children: ReactNode }) {
  const { base, company } = useCompany();
  const { pathname } = useLocation();

  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const linkedin = company?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';
  const resume = company?.social_links?.resume || DEFAULT_RESUME_URL;

  const isActive = (to: string) => pathname.startsWith(`${base}/${to}`);

  return (
    <div className="lp">
      <a className="lp-skip" href="#lp-content">Skip to content</a>

      <header className="lp-nav">
        <div className="lp-nav__inner">
          <Link to={base} className="lp-nav__brand">
            <LoopMark />
            <span className="lp-nav__name">
              Ndouken Theryx
              <span>UX Design Lead</span>
            </span>
          </Link>
          <nav className="lp-nav__links" aria-label="Site">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={`${base}/${item.to}`}
                className={`lp-nav__link${isActive(item.to) ? ' is-active' : ''}`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a className="lp-nav__cta" href={`mailto:${email}`}>Email</a>
        </div>
      </header>

      <main id="lp-content" className="lp-main">{children}</main>

      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div>
            <p className="lp-footer__name">Ndouken Theryx</p>
            <p className="lp-footer__role">UX Design Lead</p>
          </div>
          <nav className="lp-footer__links" aria-label="Contact">
            <a href={`mailto:${email}`}>Email</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={resume} target="_blank" rel="noopener noreferrer">CV</a>
          </nav>
          <p className="lp-footer__meta">Douala, Cameroon</p>
        </div>
      </footer>
    </div>
  );
}
