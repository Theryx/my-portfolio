import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://peheavvvckblmlqelbtn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlaGVhdnZ2Y2tibG1scWVsYnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODU3NzEsImV4cCI6MjA5MjE2MTc3MX0.4sFP0RWm5FFHnZl5ZA094SW8971qJ5hIG1reJqXkf_4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  name: string;
  is_active: boolean;
  bio: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  philosophy_title: string;
  philosophy_text: string;
  badges: string[];
  social_links: Record<string, string>;
}

export interface Project {
  id: string;
  profile_id: string;
  tag: string;
  title: string;
  tagline: string;
  image: string;
  description: string;
  impact: string;
  site: string;
  role: string;
  period: string;
  location: string;
  responsibilities: string[];
  challenge: string;
  challenge_text: string;
  solution: string;
  solution_text: string;
  result: string;
  result_text: string;
  is_hidden: boolean;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  profile_id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  read_time: string;
  tags: string[];
  image: string;
  is_hidden: boolean;
  sort_order: number;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  return data;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('id');
  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data || [];
}