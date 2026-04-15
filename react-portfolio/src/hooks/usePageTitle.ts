import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLES: Record<string, string> = {
  '/': 'Home — Ndouken Theryx',
  '/about': 'About — Ndouken Theryx',
  '/projects': 'Projects — Ndouken Theryx',
  '/contact': 'Contact — Ndouken Theryx',
};

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    // Check if it's a project detail page
    if (location.pathname.startsWith('/projects/') && location.pathname !== '/projects') {
      document.title = 'Project Detail — Ndouken Theryx';
    } else {
      document.title = TITLES[location.pathname] || 'Ndouken Theryx — Design Engineer & Tech Entrepreneur';
    }
  }, [location.pathname]);
}
