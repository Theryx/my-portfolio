/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getCompanyBySlug,
  getProjectsByProfile,
  getBlogPostsByProfile,
  type Company,
  type Project,
  type BlogPost,
} from '../lib/api';

interface CompanyContextValue {
  slug: string;
  base: string;
  company: Company | null;
  projects: Project[];
  posts: BlogPost[];
  loading: boolean;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export function CompanyProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const c = await getCompanyBySlug(slug);
        if (!live) return;
        setCompany(c);
        if (c?.id) {
          const [p, b] = await Promise.all([
            getProjectsByProfile(c.id),
            getBlogPostsByProfile(c.id),
          ]);
          if (!live) return;
          setProjects(p);
          setPosts(b);
        }
      } catch {
        /* keep the site renderable; pages show empty states */
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [slug]);

  return (
    <CompanyContext.Provider value={{ slug, base: `/c/${slug}`, company, projects, posts, loading }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be used within a CompanyProvider');
  return ctx;
}
