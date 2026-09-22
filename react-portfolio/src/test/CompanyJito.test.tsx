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
      content_blocks: [
        {
          type: 'gallery',
          heading: 'Process',
          items: [{ image: '', title: 'KYC camera flow', description: 'Guided capture.' }],
        },
      ],
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
      content: 'A note.\n\n> Insert image here: a screenshot of the transaction list',
    },
  ];

  return {
    getCompanyBySlug: vi.fn(() => Promise.resolve(mockCompany)),
    getProjectsByProfile: vi.fn(() => Promise.resolve(mockProjects)),
    getBlogPostsByProfile: vi.fn(() => Promise.resolve(mockBlogPosts)),
  };
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/c/:slug/*" element={<CompanyRouter />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Jito company mini-site', () => {
  it('renders the shell, selected work and nav', async () => {
    renderAt('/c/jito');

    await waitFor(() => {
      expect(screen.getAllByText(/Ndouken Theryx/).length).toBeGreaterThan(0);
      expect(screen.getByText('PaySika')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Writing' })).toBeInTheDocument();
  });

  it('renders a case study with structured blocks and image placeholders', async () => {
    renderAt('/c/jito/work/paysika_fintech');

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'PaySika' })).toBeInTheDocument();
        expect(screen.getByText('Process')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'KYC camera flow' })).toBeInTheDocument();
      },
      { timeout: 4000 }
    );

    // Missing cover and missing gallery image both surface an honest placeholder.
    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
  });

  it('turns an "insert image here" note into a placeholder', async () => {
    renderAt('/c/jito/writing/fintech_trust');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /start with trust/i })).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
  });
});
