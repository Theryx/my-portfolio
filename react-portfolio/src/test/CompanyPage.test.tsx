import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyPage from '../pages/CompanyPage';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'trust-wallet',
    name: 'Trust Wallet',
    slug: 'trust-wallet',
    role: 'Design Engineer',
    hero_title: 'Design Engineer for Trust Wallet',
    hero_subtitle: 'Closing the gap between Figma and production code.',
    badges: ['Design Engineering', 'React Native & React', 'Design Systems & Tokens'],
    job_url: 'https://jobs.ashbyhq.com/trust-wallet/72c2f324-d2d7-4037-b3a8-d9afb25dbe18',
    social_links: {
      email: 'ndouken@gmail.com',
      linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
      resume: 'https://example.com/cv.pdf',
    },
    about_content: {
      faqs: [
        {
          question: 'Why Trust Wallet?',
          answer: 'Trust Wallet empowers 200M+ users.',
        },
      ],
    },
  };

  const mockProjects = [
    {
      id: 'paysika_design-engineer',
      tag: 'Design system',
      title: 'PaySika design system',
      role: 'Design Engineer',
      period: '2022 - 2026',
      description: 'Semantic tokens shared between Figma and code.',
      impact: 'Cut visual-fidelity bug tickets.',
      image: '',
      responsibilities: ['Defined semantic tokens'],
    },
  ];

  const mockBlogPosts = [
    {
      id: 'de_handoff',
      title: 'The best handoff is no handoff',
      excerpt: 'When the designer writes the component, bugs disappear.',
      image: '',
    },
  ];

  return {
    getCompanyBySlug: vi.fn(() => Promise.resolve(mockCompany)),
    getProjectsByProfile: vi.fn(() => Promise.resolve(mockProjects)),
    getBlogPostsByProfile: vi.fn(() => Promise.resolve(mockBlogPosts)),
    fallbackProfiles: {
      'trust-wallet': mockCompany,
    },
  };
});

describe('CompanyPage Component', () => {
  it('renders Trust Wallet company brief and headline', async () => {
    render(
      <MemoryRouter initialEntries={['/trust-wallet']}>
        <Routes>
          <Route path="/trust-wallet" element={<CompanyPage slug="trust-wallet" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Trust Wallet · Design Engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/From Figma to React Native/i)).toBeInTheDocument();
      expect(screen.getByText(/PaySika design system/i)).toBeInTheDocument();
      expect(screen.getByText(/The best handoff is no handoff/i)).toBeInTheDocument();
    });
  });

  it('renders action buttons and links', async () => {
    render(
      <MemoryRouter initialEntries={['/c/trust-wallet']}>
        <Routes>
          <Route path="/c/:slug" element={<CompanyPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Start Conversation/i)).toBeInTheDocument();
      expect(screen.getByText(/Download CV/i)).toBeInTheDocument();
      expect(screen.getByText(/View Ashby Job Posting/i)).toBeInTheDocument();
    });
  });
});
