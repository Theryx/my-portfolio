import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'spiro',
    name: 'Spiro',
    slug: 'spiro',
    role: 'Global Customer Experience Lead',
    tagline: 'UX Design Lead. I design the product and the parts around it.',
    hero_title: 'Ndouken Theryx',
    hero_subtitle: 'I design the product and the parts people do not see.',
    badges: ['UX design', 'Product design'],
    job_url: '',
    philosophy_text: 'A flow that only works on a good day is not finished.',
    social_links: {
      email: 'ndouken@gmail.com',
      linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
      resume: 'https://example.com/cv.pdf',
    },
    about_content: {
      location: 'Douala, Cameroon',
      languages: 'English and French',
      education: [
        {
          degree: 'Masters in Engineering, Land Survey',
          school: 'National Advanced School of Public Works',
          period: '08.2015 - 09.2020',
        },
      ],
      skills: ['Product, interaction design', 'Design system'],
      certifications: [{ name: 'Google PMP Certification', meta: 'In progress, since August 2026' }],
    },
  };

  const mockProjects = [
    {
      id: 'paysika_fintech',
      tag: 'Fintech',
      title: 'PaySika',
      role: 'UX Design Lead',
      period: 'Nov 2022 - Aug 2026',
      tagline: 'The card that leaves the app.',
      description: 'The physical card, from order to activation.',
      impact: '',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [
        {
          type: 'steps',
          eyebrow: 'The card, step by step',
          heading: 'Order, deliver, hand over, activate',
          items: [
            {
              title: 'Ordering',
              text: 'The delivery choice, the fee and the timing on one screen.',
              image: 'https://example.com/order.png',
            },
          ],
        },
        {
          type: 'gallery',
          heading: 'What held it together',
          items: [{ image: '', title: 'Relay point', description: 'A screenshot to add.' }],
        },
      ],
    },
    {
      id: 'crowdremit_fintech',
      tag: 'Cross-border',
      title: 'CrowdRemit',
      role: 'UX Researcher & Product Designer',
      period: 'Jan 2021 - Jun 2021',
      tagline: 'We talked to people before we drew anything.',
      description: 'Research first, then the app.',
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
      excerpt: 'Status enforcement and two delivery models.',
      date: 'June 30, 2026',
      read_time: '10 min read',
      author: 'Ndouken Theryx',
      image: '',
      is_hidden: false,
      content: '# Designing a Back Office\n\nA note.\n\n> Insert image here: the Distributions tab',
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
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Writing' })).not.toBeInTheDocument();
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

  it('opens a project image in the lightbox and closes on the backdrop', async () => {
    renderAt('/c/spiro/work/paysika_fintech');

    const thumb = await screen.findByRole('button', { name: /View image: Ordering/i });
    fireEvent.click(thumb);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Ordering')).toBeInTheDocument();

    fireEvent.click(dialog);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('renders education, skills and certifications on the about page', async () => {
    renderAt('/c/spiro/about');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
    });

    expect(screen.getByText('Masters in Engineering, Land Survey')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('Product, interaction design')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Licenses and Certifications' })).toBeInTheDocument();
    expect(screen.getByText('Google PMP Certification')).toBeInTheDocument();
  });
});
