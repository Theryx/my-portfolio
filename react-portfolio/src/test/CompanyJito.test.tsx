import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Page from '../pages/companies/jito/Page';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'jito',
    name: 'Jito Foundation',
    slug: 'jito',
    role: 'Product Designer',
    tagline: 'Designing the layer where execution speed becomes trust.',
    hero_title: 'Clear at a glance. Fast under pressure.',
    hero_subtitle: 'Product designer for dense, high-stakes financial surfaces.',
    badges: ['Product Design', 'Token-based design systems'],
    job_url: 'https://jobs.lever.co/jito/97151aba-e3eb-483d-b56c-34711b873760',
    philosophy_text: 'In a trading app, clarity is the product.',
    social_links: {
      email: 'ndouken@gmail.com',
      linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
      resume: 'https://example.com/cv.pdf',
    },
    about_content: {
      faqs: [{ question: 'You have not designed a trading terminal. Why JTX?', answer: 'Honest answer.' }],
    },
  };

  const mockProjects = [
    {
      id: 'paysika_fintech',
      tag: 'Product Design / Payments',
      title: 'PaySika',
      role: 'UX Design Lead',
      period: '2022 - 2026',
      description: 'Payments, KYC and transactions for African fintech.',
      impact: '40% retention lift.',
      image: '',
      responsibilities: ['Redesigned KYC'],
    },
  ];

  const mockBlogPosts = [
    {
      id: 'fintech_trust',
      title: 'Why African fintech UX has to start with trust',
      excerpt: 'Trust is the product.',
      image: '',
    },
  ];

  return {
    getCompanyBySlug: vi.fn(() => Promise.resolve(mockCompany)),
    getProjectsByProfile: vi.fn(() => Promise.resolve(mockProjects)),
    getBlogPostsByProfile: vi.fn(() => Promise.resolve(mockBlogPosts)),
  };
});

describe('Jito company page', () => {
  it('renders the hero, a case study and the CTA', async () => {
    render(
      <MemoryRouter initialEntries={['/c/jito']}>
        <Routes>
          <Route path="/c/jito" element={<Page />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Clear at a glance/i)).toBeInTheDocument();
      expect(screen.getByText('PaySika')).toBeInTheDocument();
    });

    expect(screen.getByText(/Start a conversation/i)).toBeInTheDocument();
    expect(screen.getByText(/Let us make JTX/i)).toBeInTheDocument();
  });
});
