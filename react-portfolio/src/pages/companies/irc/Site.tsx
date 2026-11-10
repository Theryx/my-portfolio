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

export default function Site({ children }: { children: ReactNode }) {
  const { base, company } = useCompany();
  const { pathname } = useLocation();

  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const linkedin = company?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';
  const resume = company?.social_links?.resume || DEFAULT_RESUME_URL;
  const role = company?.social_links?.role_line || 'UX designer and researcher';

  const isActive = (to: string) => pathname.startsWith(`${base}/${to}`);

  return (
    <div className="cn">
      <a className="cn-skip" href="#cn-content">Skip to content</a>

      <header className="cn-nav">
        <div className="cn-nav__inner">
          <Link to={base} className="cn-nav__brand">
            <span className="cn-nav__name">Ndouken Theryx</span>
            <span className="cn-nav__role">{role}</span>
          </Link>
          <nav className="cn-nav__links" aria-label="Site">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={`${base}/${item.to}`}
                className={`cn-nav__link${isActive(item.to) ? ' is-active' : ''}`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <a className="cn-nav__link cn-nav__link--mail" href={`mailto:${email}`}>Email</a>
          </nav>
        </div>
      </header>

      <main id="cn-content" className="cn-main">{children}</main>

      <footer className="cn-footer">
        <div className="cn-footer__inner">
          <p className="cn-footer__sign">
            Ndouken Theryx
            <span>Douala, Cameroon. English and French.</span>
          </p>
          <nav className="cn-footer__links" aria-label="Contact">
            <a href={`mailto:${email}`}>Email</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={resume} target="_blank" rel="noopener noreferrer">CV</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
