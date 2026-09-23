import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'mtn-cameroon',
    name: 'MTN Cameroon',
    slug: 'mtn-cameroon',
    role: 'Coordinator, Products Core B2B',
    tagline: 'Product manager and product designer working on regulated products.',
    hero_title: 'Ndouken Theryx',
    hero_subtitle: 'I work on digital products end to end.',
    badges: ['Product lifecycle', 'Regulated delivery'],
    job_url: '',
    philosophy_text: 'A product only counts when it ships.',
    social_links: {
      email: 'ndouken@gmail.com',
      linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
      resume: 'https://example.com/cv.pdf',
    },
    about_content: {},
  };

  const mockProjects = [
    {
      id: 'paysika_project-manager',
      tag: 'Fintech',
      title: 'PaySika',
      role: 'Product Owner & Project Manager',
      period: 'Dec 2021 - Present',
      tagline: 'Owned the product backlog for a scaling neo-bank.',
      description: 'One prioritized backlog across mobile and web.',
      impact: '',
      image: '',
      responsibilities: ['Own a prioritized backlog'],
      is_hidden: false,
      content_blocks: [
        {
          type: 'steps',
          heading: 'How a request becomes a release',
          items: [{ title: 'One place for every request', text: 'One backlog.' }],
        },
        {
          type: 'gallery',
          heading: 'The artefacts I kept',
          items: [{ image: '', title: 'The backlog itself', description: 'A screenshot to add.' }],
        },
      ],
    },
    {
      id: 'shomi_project-manager',
      tag: 'EdTech',
      title: 'Shomi',
      role: 'Co-founder & Product Owner',
      period: 'Dec 2019 - Dec 2020',
      tagline: 'Owned an ed-tech product end to end.',
      description: 'Grant-funded MVP and a documented sunset.',
      impact: '',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [],
    },
  ];

  const mockBlogPosts = [
    {
      id: 'pm_kyc_three_sprints',
      title: "How we shipped PaySika's KYC redesign in 3 sprints",
      excerpt: 'A small team shipped a KYC redesign in three sprints.',
      date: 'May 14, 2026',
      read_time: '8 min read',
      author: 'Ndouken Theryx',
      image: '',
      is_hidden: false,
      content:
        "# How we shipped PaySika's KYC redesign in 3 sprints\n\nThe overlap was the problem.\n\n> Insert image here: a screenshot of the KYC funnel",
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

describe('MTN Cameroon mini-site', () => {
  it('renders the shell, selected work and nav', async () => {
    renderAt('/c/mtn-cameroon');

    await waitFor(() => {
      expect(screen.getAllByText(/Ndouken Theryx/).length).toBeGreaterThan(0);
      expect(screen.getByText('PaySika')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Writing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeInTheDocument();
  });

  it('renders a case study with its own block sequence', async () => {
    renderAt('/c/mtn-cameroon/work/paysika_project-manager');

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'PaySika' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'How a request becomes a release' })).toBeInTheDocument();
      },
      { timeout: 4000 }
    );

    // The missing cover and the missing gallery image both surface a placeholder.
    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
    // The block story is used instead of the fixed Overview template.
    expect(screen.queryByRole('heading', { name: 'Overview' })).not.toBeInTheDocument();
  });

  it('strips the duplicated H1 and turns a note into a placeholder', async () => {
    renderAt('/c/mtn-cameroon/writing/pm_kyc_three_sprints');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /KYC redesign in 3 sprints/i })).toBeInTheDocument();
    });

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
  });
});
