import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfileProvider, useProfile } from '../context/ProfileContext';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ 
            data: { 
              id: 'default', 
              name: 'Default', 
              is_active: true,
              bio: 'Test Bio',
              tagline: 'Test Tagline',
              hero_title: 'Design Engineer',
              hero_subtitle: 'Building products',
              philosophy_title: 'Philosophy',
              philosophy_text: 'Philosophy text',
              badges: ['Available'],
              social_links: {}
            }, 
            error: null 
          })),
          order: vi.fn(() => Promise.resolve({ 
            data: [
              {
                id: 'paysika',
                profile_id: 'default',
                tag: 'Fintech',
                title: 'PaySika',
                tagline: 'Mobile finance',
                image: '',
                description: 'Description',
                impact: 'Impact',
                site: 'https://example.com',
                role: 'Designer',
                period: '2024',
                location: 'Cameroon',
                responsibilities: ['Design'],
                challenge: 'Challenge',
                challenge_text: 'Challenge text',
                solution: 'Solution',
                solution_text: 'Solution text',
                result: 'Result',
                result_text: 'Result text',
                is_hidden: false,
                sort_order: 1
              }
            ], 
            error: null 
          }))
        })),
        order: vi.fn(() => Promise.resolve({ 
          data: [
            {
              id: 'test-post',
              profile_id: 'default',
              title: 'Test Post',
              excerpt: 'Excerpt',
              content: '<p>Content</p>',
              date: '2024-01-01',
              author: 'Theryx',
              read_time: '5 min',
              tags: ['Test'],
              image: '',
              is_hidden: false,
              sort_order: 1
            }
          ], 
          error: null 
        }))
      }))
    }))
  }
}));

describe('ProfileContext', () => {
  afterEach(() => {
    cleanup();
  });

  it('provides default profile', async () => {
    const TestConsumer = () => {
      const { profile, loading } = useProfile();
      
      if (loading) return <div>Loading...</div>;
      
      return (
        <div>
          <span data-testid="profile-name">{profile?.name}</span>
          <span data-testid="profile-title">{profile?.hero_title}</span>
        </div>
      );
    };

    render(
      <BrowserRouter>
        <ProfileProvider>
          <TestConsumer />
        </ProfileProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-name')).toHaveTextContent('Default');
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByTestId('profile-title')).toHaveTextContent('Design Engineer');
    }, { timeout: 5000 });
  });

  it('provides projects', async () => {
    const TestConsumer = () => {
      const { projects, loading } = useProfile();
      
      if (loading) return <div>Loading...</div>;
      
      return <span data-testid="projects-count">{projects.length}</span>;
    };

    render(
      <BrowserRouter>
        <ProfileProvider>
          <TestConsumer />
        </ProfileProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('projects-count')).toHaveTextContent('1');
    }, { timeout: 5000 });
  });

  it('provides blog posts', async () => {
    const TestConsumer = () => {
      const { blogPosts, loading } = useProfile();
      
      if (loading) return <div>Loading...</div>;
      
      return <span data-testid="posts-count">{blogPosts.length}</span>;
    };

    render(
      <BrowserRouter>
        <ProfileProvider>
          <TestConsumer />
        </ProfileProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    }, { timeout: 5000 });
  });

  it('throws error when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestConsumer = () => {
      useProfile();
      return null;
    };

    expect(() => render(<TestConsumer />)).toThrow('useProfile must be used within a ProfileProvider');
    
    consoleError.mockRestore();
  });

  it('provides refresh function', async () => {
    const TestConsumer = () => {
      const { refresh, loading } = useProfile();
      
      if (loading) return <div>Loading...</div>;
      
      return <button onClick={refresh} data-testid="refresh-btn">Refresh</button>;
    };

    render(
      <BrowserRouter>
        <ProfileProvider>
          <TestConsumer />
        </ProfileProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('refresh-btn')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});