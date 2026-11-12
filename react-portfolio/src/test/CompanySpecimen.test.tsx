import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within, configure } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

// The site's pages are lazy-loaded; a cold first import can exceed the 1s default.
configure({ asyncUtilTimeout: 5000 });

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'bold-entrepreneur',
    name: 'Test company',
    slug: 'specimen',
    role: 'Product Designer',
    tagline: 'Product designer.',
    hero_title: "I'm Ndouken, a product designer in Douala.",
    hero_subtitle: 'I design the app, and the brand around it.',
    philosophy_title: 'How I work',
    philosophy_text: '',
    intro_expanded_text: 'First paragraph.\n\nSecond paragraph.',
    badges: [],
    job_url: '',
    social_links: { email: 'ndouken@gmail.com', role_line: 'Product designer' },
    theme_config: {
      disciplines: ['Web and mobile apps', 'Brand identity'],
      practice: [{ title: 'Look around first', text: 'Research and a competitor review.' }],
      sheet: [{ image: 'https://example.com/screen.png', kind: 'Screens', project: 'paysika_fintech' }],
      projects: {
        paysika_fintech: {
          sector: 'Fintech',
          did: ['Product', 'Brand'],
          specimen: [
            { label: 'Colour', value: '#00CC92', swatch: '#00CC92' },
            { label: 'Type', value: 'Muli' },
          ],
        },
      },
    },
    about_content: {
      lede: 'I am a product designer in Douala, Cameroon.',
      location: 'Douala, Cameroon',
      languages: 'English and French',
      tools: [{ label: 'Brand and print', items: ['Affinity Designer'] }],
      experience: [{ role: 'Senior UI/UX Consultant', org: 'Matanga Agency', place: 'Remote', period: 'Dec 2023 to Feb 2024' }],
      skills: ['Design systems'],
      education: [{ degree: 'Masters in Engineering, Land Survey', school: 'NASPW', period: '2015 to 2020' }],
      certifications: [{ name: 'Fundamentals of Graphic Design', meta: 'Sep 2019' }],
    },
  };

  const base = { description: '', impact: '', responsibilities: [], is_hidden: false, location: 'Cameroon' };
  const mockProjects = [
    {
      ...base,
      id: 'paysika_fintech',
      tag: 'Fintech',
      title: 'PaySika',
      role: 'UX Design Lead',
      period: '2022 to 2026',
      tagline: 'A bank app and its brand.',
      image: '',
      content_blocks: [
        { type: 'intro', eyebrow: 'PaySika', heading: 'From the first version to a bank in two countries', text: 'Text.' },
        {
          type: 'gallery',
          heading: 'One source of truth',
          items: [{ image: 'https://example.com/guide.png', title: 'Brand guide' }],
        },
        { type: 'photos', heading: 'At the fair', items: [{ image: '', caption: 'Photo to add' }] },
      ],
    },
    {
      ...base,
      id: 'careathon-brand',
      tag: 'Event brand',
      title: 'Careathon 2024',
      role: 'Brand designer',
      period: '2024',
      tagline: 'An identity for a hackathon.',
      image: '',
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
    </MemoryRouter>,
  );
}

describe('Product designer mini-site (specimen)', () => {
  it('renders home with the contact sheet, project rows and no writing link', async () => {
    renderAt('/c/specimen');

    await waitFor(() => expect(screen.getByText('Careathon 2024')).toBeInTheDocument());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('product designer in Douala');
    expect(screen.getByRole('heading', { name: 'On the table' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I work' })).toBeInTheDocument();
    expect(screen.getByText('Web and mobile apps')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Writing' })).not.toBeInTheDocument();
  });

  it('renders the work list', async () => {
    renderAt('/c/specimen/work');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Products and brands' })).toBeInTheDocument());
    expect(screen.getByText('PaySika')).toBeInTheDocument();
    expect(screen.getByText('Fintech')).toBeInTheDocument();
  });

  it('renders a case study with its specimen strip, blocks and pager', async () => {
    renderAt('/c/specimen/work/paysika_fintech');

    await waitFor(() => expect(screen.getByRole('heading', { name: 'PaySika', level: 1 })).toBeInTheDocument());
    expect(screen.getByText(/Plate 01 of 02/)).toBeInTheDocument();
    expect(screen.getByText('#00CC92')).toBeInTheDocument();
    expect(screen.getByText('Muli')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'From the first version to a bank in two countries' })).toBeInTheDocument();
    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Careathon 2024/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /View image: Brand guide/i }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Brand guide')).toBeInTheDocument();
  });

  it('renders the about page', async () => {
    renderAt('/c/specimen/about');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument());
    expect(screen.getByText('I am a product designer in Douala, Cameroon.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Affinity Designer')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Certificates' })).toBeInTheDocument();
  });

  it('redirects the writing route to home', async () => {
    renderAt('/c/specimen/writing');
    await waitFor(() => expect(screen.getByText('Careathon 2024')).toBeInTheDocument());
  });
});
