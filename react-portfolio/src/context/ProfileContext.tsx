/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getProfileById,
  getActiveProfile,
  getProjectsByProfile,
  getBlogPostsByProfile,
  type Profile,
  type Project,
  type BlogPost,
} from '../lib/api';

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

  const profileIdParam = searchParams.get('profile');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const resolvedProfile = profileIdParam
        ? await getProfileById(profileIdParam)
        : await getActiveProfile();

      if (!resolvedProfile) throw new Error('Profile not found');
      setProfile(resolvedProfile);

      const profileId = resolvedProfile.id;
      const [fetchedProjects, fetchedPosts] = await Promise.all([
        getProjectsByProfile(profileId),
        getBlogPostsByProfile(profileId),
      ]);

      setProjects(fetchedProjects);
      setBlogPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [profileIdParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ProfileContext.Provider value={{ profile, projects, blogPosts, loading, error, refresh: fetchData }}>
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
