import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'sweed',
    name: 'Sweed',
    slug: 'sweed',
    role: 'Product Owner (eCommerce)',
    tagline: 'Product Owner across fintech operations and eCommerce checkout journeys.',
    hero_title: 'Ndouken Theryx',
    hero_subtitle:
      'I own product features from problem discovery and Shortcut acceptance criteria through QA, launch, and Mixpanel iteration.',
    badges: ['Product Ownership', 'eCommerce Checkout', 'Backlog & PRDs', 'Mixpanel Analytics'],
    job_url: 'https://sweedpos.com/#/',
    social_links: {
      email: 'ndouken@gmail.com',
      linkedin: 'https://www.linkedin.com/in/ndoukentheryx',
      resume: 'https://example.com/cv.pdf',
    },
    about_content: {
      location: 'Douala, Cameroon',
      languages: 'English and French (fluent)',
      education: [
        {
          degree: 'Masters in Engineering, Land Survey',
          school: 'National Advanced School of Public Works',
          period: '08.2015 - 09.2020',
        },
      ],
      skills: ['Shortcut backlog & PRDs', 'eCommerce checkout flows', 'QA & UAT collaboration'],
      certifications: [
        { name: 'Google Project Management Certificate', meta: 'Completed 2 Nov 2026' },
      ],
      faqs: [
        {
          question: 'How do you handle incomplete or conflicting stakeholder asks?',
          answer: 'I write down the missing context, surface edge cases before dev starts, and confirm trade-offs in Shortcut.',
        },
      ],
    },
  };

  const mockProjects = [
    {
      id: 'paysika_project-manager',
      tag: 'Product Ownership · Regulated Fintech',
      title: 'PaySika Product Ownership',
      role: 'Product Manager',
      period: 'Dec 2021 - Aug 2026',
      tagline: 'Prioritized Shortcut backlog and 15-person squad delivery across Cameroon and Gabon.',
      description: 'Owned backlog, PRDs, QA sign-off, and multi-city operations configuration.',
      impact: '+40% retention, -60% support tickets',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [
        {
          type: 'metrics',
          heading: 'Measured outcomes',
          items: [
            { value: '+40%', label: 'Retention lift', note: 'Tracked in Mixpanel.' },
          ],
        },
        {
          type: 'steps',
          eyebrow: 'SDLC',
          heading: 'From request to QA release',
          items: [
            {
              title: 'Spec and acceptance criteria',
              text: 'Every story carried edge cases and a Definition of Ready in Shortcut.',
              image: 'https://example.com/spec.png',
            },
          ],
        },
        {
          type: 'gallery',
          heading: 'Back-office artifacts',
          items: [{ image: '', title: 'Multi-city config', description: 'Screenshot to add.' }],
        },
      ],
    },
    {
      id: 'lovingtech-cx',
      tag: 'eCommerce · Checkout & Tracking',
      title: 'Loving Tech',
      role: 'Customer Success Consultant',
      period: 'Jan 2026 - Apr 2026',
      tagline: 'End-to-end eCommerce checkout, payment-on-delivery, and order tracking.',
      description: 'Defined cart, checkout, delivery/pickup, and WhatsApp support workflows.',
      impact: '',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [],
    },
    {
      id: 'paysika_fintech',
      tag: 'Product · Ordering & Multi-Market',
      title: 'PaySika Ordering & Gabon Expansion',
      role: 'Product Manager & UX Lead',
      period: 'Dec 2021 - Aug 2026',
      tagline: 'Physical card ordering, QR handover, and Gabon rollout.',
      description: 'Owned ordering, delivery, and multi-market KYC flows.',
      impact: '',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [],
    },
  ];

  return {
    getCompanyBySlug: vi.fn(() => Promise.resolve(mockCompany)),
    getProjectsByProfile: vi.fn(() => Promise.resolve(mockProjects)),
    getBlogPostsByProfile: vi.fn(() => Promise.resolve([])),
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

describe('Sweed mini-site', () => {
  it('renders Home with selected projects and navigation without Writing', async () => {
    renderAt('/c/sweed');

    await waitFor(
      () => {
        expect(screen.getAllByText(/Ndouken Theryx/).length).toBeGreaterThan(0);
        expect(screen.getByText('PaySika Product Ownership')).toBeInTheDocument();
        expect(screen.getByText('Loving Tech')).toBeInTheDocument();
      },
      { timeout: 4000 }
    );

    expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Writing' })).not.toBeInTheDocument();
  });

  it('renders Work index with all three case studies', async () => {
    renderAt('/c/sweed/work');

    await waitFor(
      () => {
        expect(screen.getByText('PaySika Product Ownership')).toBeInTheDocument();
        expect(screen.getByText('Loving Tech')).toBeInTheDocument();
        expect(screen.getByText('PaySika Ordering & Gabon Expansion')).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });

  it('renders a case study and opens lightbox on thumbnail click', async () => {
    renderAt('/c/sweed/work/paysika_project-manager');

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'PaySika Product Ownership' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'From request to QA release' })).toBeInTheDocument();
      },
      { timeout: 4000 }
    );

    const thumb = await screen.findByRole(
      'button',
      { name: /View image: Spec and acceptance criteria/i },
      { timeout: 4000 }
    );
    fireEvent.click(thumb);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Spec and acceptance criteria')).toBeInTheDocument();

    fireEvent.click(dialog);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('renders About with skills, education, certifications, and FAQs', async () => {
    renderAt('/c/sweed/about');

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
      },
      { timeout: 4000 }
    );

    expect(screen.getByText('Shortcut backlog & PRDs')).toBeInTheDocument();
    expect(screen.getByText('Google Project Management Certificate')).toBeInTheDocument();
    expect(screen.getByText('Completed 2 Nov 2026')).toBeInTheDocument();
  });

  it('redirects /writing back to Home', async () => {
    renderAt('/c/sweed/writing');

    await waitFor(
      () => {
        expect(screen.getByText('Selected case studies')).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });
});
