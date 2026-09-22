import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useCompany } from '../../../context/CompanyContext';
import './site.css';

const NAV = [
  { to: 'work', label: 'Work' },
  { to: 'about', label: 'About' },
  { to: 'writing', label: 'Writing' },
];

const DEFAULT_RESUME_URL =
  'https://drive.google.com/open?id=1OzU-HPN-l2s9Le4iSFd44F6PK4Z0W6bp&usp=drive_fs';

export default function Site({ children }: { children: ReactNode }) {
  const { base, company } = useCompany();
  const { pathname } = useLocation();

  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const linkedin = company?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';
  const resume = company?.social_links?.resume || DEFAULT_RESUME_URL;

  const isActive = (to: string) => pathname.startsWith(`${base}/${to}`);

  return (
    <div className="jn">
      <a className="jn-skip" href="#jn-content">Skip to content</a>

      <header className="jn-nav">
        <div className="jn-nav__inner">
          <Link to={base} className="jn-nav__brand">Ndouken Theryx</Link>
          <nav className="jn-nav__links" aria-label="Site">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={`${base}/${item.to}`}
                className={`jn-nav__link${isActive(item.to) ? ' is-active' : ''}`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a className="jn-nav__cta" href={`mailto:${email}`}>Email</a>
        </div>
      </header>

      <main id="jn-content" className="jn-main">{children}</main>

      <footer className="jn-footer">
        <div className="jn-footer__inner">
          <div className="jn-footer__brand">
            <p className="jn-footer__name">Ndouken Theryx</p>
            <p className="jn-footer__role">Product Designer</p>
          </div>
          <nav className="jn-footer__links" aria-label="Contact">
            <a href={`mailto:${email}`}>Email</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={resume} target="_blank" rel="noopener noreferrer">CV</a>
          </nav>
          <p className="jn-footer__meta">Douala, Cameroon</p>
        </div>
      </footer>
    </div>
  );
}
