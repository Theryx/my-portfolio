import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'spiro',
    name: 'Spiro',
    slug: 'spiro',
    role: 'Global Customer Experience Lead',
    tagline: 'Experience and service design across digital, physical and human touchpoints.',
    hero_title: 'Ndouken Theryx',
    hero_subtitle: 'I design experiences end to end: the digital screens, the physical moments and the people in between.',
    badges: ['Journey mapping', 'Service design'],
    job_url: '',
    philosophy_text: 'A journey is only real if it holds up in the field.',
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
      tag: 'Service design',
      title: 'PaySika',
      role: 'UX Design Lead',
      period: 'Nov 2022 - Aug 2026',
      tagline: 'A card journey that runs from the app to a relay point.',
      description: 'The physical card service end to end.',
      impact: '',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [
        {
          type: 'steps',
          eyebrow: 'The card journey',
          heading: 'Order, deliver, hand over, activate',
          items: [{ title: 'Ordering', text: 'The delivery method, the fees and the timing on one screen.' }],
        },
        {
          type: 'gallery',
          heading: 'The work behind the screens',
          items: [{ image: '', title: 'Relay point', description: 'A screenshot to add.' }],
        },
      ],
    },
    {
      id: 'crowdremit_fintech',
      tag: 'Journey mapping',
      title: 'CrowdRemit',
      role: 'UX Researcher & Product Designer',
      period: 'Jan 2021 - Jun 2021',
      tagline: 'End-to-end UX for cross-border transfers.',
      description: 'Research first: interviews, journey maps, personas.',
      impact: '',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [],
    },
  ];

  const mockBlogPosts = [
    {
      id: 'designing-a-back-office-for-physical-card-delivery-in-cameroon',
      title: 'Designing a Back Office for Physical Card Delivery in Cameroon',
      excerpt: 'Status enforcement, agent workflows and two delivery models.',
      date: 'June 30, 2026',
      read_time: '10 min read',
      author: 'Ndouken Theryx',
      image: '',
      is_hidden: false,
      content:
        '# Designing a Back Office for Physical Card Delivery in Cameroon\n\nThe interface should make the correct action obvious.\n\n> Insert image here: the Distributions tab',
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

describe('Spiro mini-site', () => {
  it('renders the shell, selected work and nav', async () => {
    renderAt('/c/spiro');

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
    renderAt('/c/spiro/work/paysika_fintech');

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'PaySika' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Order, deliver, hand over, activate' })).toBeInTheDocument();
      },
      { timeout: 4000 }
    );

    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: 'Overview' })).not.toBeInTheDocument();
  });

  it('strips the duplicated H1 and turns a note into a placeholder', async () => {
    renderAt('/c/spiro/writing/designing-a-back-office-for-physical-card-delivery-in-cameroon');

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Back Office for Physical Card Delivery/i })
      ).toBeInTheDocument();
    });

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
  });
});
