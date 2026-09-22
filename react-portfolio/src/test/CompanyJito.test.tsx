import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'jito',
    name: 'Jito Foundation',
    slug: 'jito',
    role: 'Product Designer',
    tagline: 'Product designer working across fintech and design systems.',
    hero_title: 'Ndouken Theryx',
    hero_subtitle: 'Product designer with four years in regulated fintech.',
    badges: ['Fintech', 'Design systems'],
    job_url: 'https://jobs.lever.co/jito/97151aba-e3eb-483d-b56c-34711b873760',
    philosophy_text: 'Clarity is the product.',
    social_links: {
      email: 'ndouken@gmail.com',
      linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
      resume: 'https://example.com/cv.pdf',
    },
    about_content: {},
  };

  const mockProjects = [
    {
      id: 'paysika_fintech',
      tag: 'Product Design',
      title: 'PaySika',
      role: 'UX Design Lead',
      period: '2022 - 2026',
      tagline: 'Payments, KYC and transactions for African fintech.',
      description: 'Payments and KYC.',
      impact: '40% retention lift.',
      image: '',
      responsibilities: ['Redesigned KYC'],
      is_hidden: false,
    },
  ];

  const mockBlogPosts = [
    {
      id: 'fintech_trust',
      title: 'Why African fintech UX has to start with trust',
      excerpt: 'Trust is the product.',
      date: 'April 2026',
      read_time: '6 min read',
      image: '',
      is_hidden: false,
    },
  ];

  return {
    getCompanyBySlug: vi.fn(() => Promise.resolve(mockCompany)),
    getProjectsByProfile: vi.fn(() => Promise.resolve(mockProjects)),
    getBlogPostsByProfile: vi.fn(() => Promise.resolve(mockBlogPosts)),
  };
});

describe('Jito company mini-site', () => {
  it('renders the shell, selected work and nav', async () => {
    render(
      <MemoryRouter initialEntries={['/c/jito']}>
        <Routes>
          <Route path="/c/:slug/*" element={<CompanyRouter />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Ndouken Theryx/).length).toBeGreaterThan(0);
      expect(screen.getByText('PaySika')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Writing' })).toBeInTheDocument();
  });
});
