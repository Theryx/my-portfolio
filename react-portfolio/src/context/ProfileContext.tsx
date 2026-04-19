import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, type Profile, type Project, type BlogPost } from '../lib/supabase';

interface ProfileContextType {
  profile: Profile | null;
  projects: Project[];
  blogPosts: BlogPost[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileId = searchParams.get('profile') || 'default';

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileRes, projectsRes, blogRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).single(),
        supabase.from('projects').select('*').eq('profile_id', profileId).eq('is_hidden', false).order('sort_order', { ascending: true }),
        supabase.from('blog_posts').select('*').eq('profile_id', profileId).eq('is_hidden', false).order('sort_order', { ascending: true }),
      ]);

      if (profileRes.error) throw profileRes.error;
      setProfile(profileRes.data);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (blogRes.data) setBlogPosts(blogRes.data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profileId]);

  const refresh = () => {
    fetchData();
  };

  return (
    <ProfileContext.Provider value={{ profile, projects, blogPosts, loading, error, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}