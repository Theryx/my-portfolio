import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from '../context/ProfileContext';
import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Blog from '../pages/Blog';
import NotFound from '../pages/NotFound';

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
              title: 'Test Blog Post',
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

function renderWithTestRouter() {
  return render(
    <BrowserRouter>
      <ProfileProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ProfileProvider>
    </BrowserRouter>
  );
}

describe('Home Page', () => {
  it('renders hero section with profile data', async () => {
    renderWithTestRouter();
    
    await waitFor(() => {
      expect(screen.getByText(/Design Engineer/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders availability badge', async () => {
    renderWithTestRouter();
    
    await waitFor(() => {
      screen.getByText(/Available/i);
    }, { timeout: 5000 });
  });
});

describe('Projects Page', () => {
  it('renders projects heading', async () => {
    renderWithTestRouter();
    
    await waitFor(() => {
      expect(screen.getByText(/Selected Work/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders project cards', async () => {
    renderWithTestRouter();
    
    await waitFor(() => {
      expect(screen.getByText(/PaySika/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});

describe('Blog Page', () => {
  it('renders blog heading', async () => {
    renderWithTestRouter();
    
    await waitFor(() => {
      expect(screen.getByText(/Blog & Insights/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders blog posts', async () => {
    renderWithTestRouter();
    
    await waitFor(() => {
      expect(screen.getByText(/Test Blog Post/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});

describe('NotFound Page', () => {
  it('renders 404 message', async () => {
    renderWithTestRouter();
    
    await waitFor(() => {
      expect(screen.getByText(/404/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});