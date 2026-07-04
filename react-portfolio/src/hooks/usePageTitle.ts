import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLES: Record<string, string> = {
  '/': 'Home | Ndouken Theryx',
  '/about': 'About | Ndouken Theryx',
  '/projects': 'Projects | Ndouken Theryx',
  '/blog': 'Blog | Ndouken Theryx',
};

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    // Detail pages set their own title (and OG tags) via usePageMeta.
    const isDetailPage =
      (location.pathname.startsWith('/projects/') && location.pathname !== '/projects') ||
      (location.pathname.startsWith('/blog/') && location.pathname !== '/blog');
    if (isDetailPage) return;
    document.title = TITLES[location.pathname] || 'Ndouken Theryx | Product Designer & Builder';
  }, [location.pathname]);
}
