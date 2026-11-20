import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useCompany } from '../../../context/CompanyContext';
import './site.css';

const NAV = [
  { to: 'work', label: 'Work' },
  { to: 'about', label: 'About' },
];

function SpecMark() {
  return (
    <svg className="ss-mark" viewBox="0 0 28 28" aria-hidden="true">
      <rect x="2" y="2" width="24" height="24" rx="5" />
      <path d="M8 10h12M8 14.5h8M8 19h5" />
      <circle cx="19" cy="18.5" r="2" className="ss-mark__dot" />
    </svg>
  );
}

export default function Site({ children }: { children: ReactNode }) {
  const { base, company } = useCompany();
  const { pathname } = useLocation();

  const email = company?.social_links?.email || 'ndouken@gmail.com';
  const linkedin = company?.social_links?.linkedin || 'https://www.linkedin.com/in/ndoukentheryx';
  const resume = company?.social_links?.resume || '';

  const isActive = (to: string) => pathname.startsWith(`${base}/${to}`);

  return (
    <div className="ss">
      <a className="ss-skip" href="#ss-content">Skip to content</a>

      <header className="ss-nav">
        <div className="ss-nav__inner">
          <Link to={base} className="ss-nav__brand">
            <SpecMark />
            <span className="ss-nav__brandtext">
              <strong>Ndouken Theryx</strong>
              <span>Product Owner</span>
            </span>
          </Link>

          <nav className="ss-nav__links" aria-label="Site">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={`${base}/${item.to}`}
                className={`ss-nav__link${isActive(item.to) ? ' is-active' : ''}`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a className="ss-nav__cta" href={`mailto:${email}`}>Email</a>
        </div>
      </header>

      <main id="ss-content" className="ss-main">{children}</main>

      <footer className="ss-footer">
        <div className="ss-footer__inner">
          <div className="ss-footer__id">
            <strong>Ndouken Theryx</strong>
            <span>Product Owner · Douala, Cameroon</span>
          </div>
          <nav className="ss-footer__links" aria-label="Contact">
            <a href={`mailto:${email}`}>Email</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            {resume && (
              <a href={resume} target="_blank" rel="noopener noreferrer">CV</a>
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}
