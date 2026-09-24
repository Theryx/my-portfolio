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
  'https://drive.google.com/open?id=1YaPoFPM99oGFvA4fChx-QOSarJ2GGHI_&usp=drive_fs';

export default function Site({ children }: { children: ReactNode }) {
  const { base, company } = useCompany();
  const { pathname } = useLocation();

  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const linkedin = company?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';
  const resume = company?.social_links?.resume || DEFAULT_RESUME_URL;

  const isActive = (to: string) => pathname.startsWith(`${base}/${to}`);

  return (
    <div className="sig">
      <a className="sig-skip" href="#sig-content">Skip to content</a>

      <header className="sig-nav">
        <div className="sig-nav__inner">
          <Link to={base} className="sig-nav__brand">
            Ndouken Theryx
            <span>Product and delivery</span>
          </Link>
          <nav className="sig-nav__links" aria-label="Site">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={`${base}/${item.to}`}
                className={`sig-nav__link${isActive(item.to) ? ' is-active' : ''}`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a className="sig-nav__cta" href={`mailto:${email}`}>Email</a>
        </div>
      </header>

      <main id="sig-content" className="sig-main">{children}</main>

      <footer className="sig-footer">
        <div className="sig-footer__inner">
          <div>
            <p className="sig-footer__name">Ndouken Theryx</p>
            <p className="sig-footer__role">Product manager and product designer</p>
          </div>
          <nav className="sig-footer__links" aria-label="Contact">
            <a href={`mailto:${email}`}>Email</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={resume} target="_blank" rel="noopener noreferrer">CV</a>
          </nav>
          <p className="sig-footer__meta">Douala, Cameroon</p>
        </div>
      </footer>
    </div>
  );
}
