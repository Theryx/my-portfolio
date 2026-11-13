import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within, configure } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

// The site's pages are lazy-loaded; a cold first import can exceed the 1s default.
configure({ asyncUtilTimeout: 5000 });

const RIDERS = 'PaySika delivery riders’ app';

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'sun-king',
    name: 'Test company',
    slug: 'sunking',
    role: 'Senior Product Designer',
    tagline: 'Product designer.',
    hero_title: 'I design for people in the field.',
    hero_subtitle: 'Riders on cheap phones and first-time card holders.',
    philosophy_title: 'How I work',
    philosophy_text: '',
    intro_expanded_text: 'First paragraph.\n\nSecond paragraph.',
    badges: [],
    job_url: '',
    social_links: { email: 'ndouken@gmail.com', role_line: 'Product designer' },
    theme_config: {
      facts: [{ value: '+40%', label: 'retention' }],
      practice: [{ title: 'Go into the field', text: 'Once a month.' }],
      projects: {
        'paysika-riders-app': {
          side: 'Agent app',
          field: [
            { label: 'Device', value: 'Cheap smartphones' },
            { label: 'Network', value: 'Weak, partly offline' },
            { label: 'Training', value: 'A few hours' },
          ],
        },
      },
    },
    about_content: {
      lede: 'I am a product designer from Cameroon.',
      location: 'Douala, Cameroon. Can relocate to Lagos.',
      languages: 'English and French',
      tools: [{ label: 'Design', items: ['Figma Make'] }],
      experience: [{ role: 'UX Design Lead', org: 'PaySika', place: 'Douala', period: 'Nov 2022 to Aug 2026' }],
      skills: ['Field research'],
      education: [],
      certifications: [],
      faqs: [{ question: 'Where can you work from?', answer: 'Douala, and I can relocate to Lagos.' }],
    },
  };

  const base = { description: '', impact: '', responsibilities: [], is_hidden: false, location: 'Cameroon' };
  const mockProjects = [
    {
      ...base,
      id: 'paysika-riders-app',
      tag: 'Field app',
      title: 'PaySika delivery riders’ app',
      role: 'UX Design Lead',
      period: 'Apr - Jun 2026',
      tagline: 'A web app for 15 riders.',
      image: '',
      content_blocks: [
        { type: 'intro', eyebrow: 'PaySika', heading: 'Thirty minutes at the relay point', text: 'Text.' },
        {
          type: 'steps',
          eyebrow: 'Constraints',
          heading: 'Designed for a phone in the middle of a shift',
          items: [{ title: 'Works without internet where it counts', text: 'Address and scan.' }],
        },
        { type: 'gallery', heading: 'Screens', items: [{ image: 'https://example.com/scan.png', title: 'QR scan' }] },
        { type: 'photos', heading: 'In use', items: [{ image: '', caption: 'Rider photo to add' }] },
      ],
    },
    {
      ...base,
      id: 'crowdremit_fintech',
      tag: 'Cross-border',
      title: 'CrowdRemit',
      role: 'UX Researcher',
      period: '2021',
      tagline: 'Transfers across four platforms.',
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

describe('Product designer mini-site (sunking)', () => {
  it('renders home with facts, project rows, practice and no writing link', async () => {
    renderAt('/c/sunking');

    await waitFor(() => expect(screen.getByText('CrowdRemit')).toBeInTheDocument());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('people in the field');
    expect(screen.getByText('+40%')).toBeInTheDocument();
    expect(screen.getByText('Agent app')).toBeInTheDocument();
    expect(screen.getByText('Cheap smartphones')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I work' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Writing' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Daylight/ })).not.toBeInTheDocument();
  });

  it('renders the work list', async () => {
    renderAt('/c/sunking/work');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument());
    expect(screen.getByText(RIDERS)).toBeInTheDocument();
  });

  it('renders a case study with its field card, blocks and pager', async () => {
    renderAt('/c/sunking/work/paysika-riders-app');

    await waitFor(() => expect(screen.getByRole('heading', { name: RIDERS, level: 1 })).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'At a glance' })).toBeInTheDocument();
    expect(screen.getByText('A few hours')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Designed for a phone in the middle of a shift' })).toBeInTheDocument();
    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /CrowdRemit/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /View image: QR scan/i }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('QR scan')).toBeInTheDocument();
  });

  it('renders the about page', async () => {
    renderAt('/c/sunking/about');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument());
    expect(screen.getByText('I am a product designer from Cameroon.')).toBeInTheDocument();
    expect(screen.getByText('Douala, Cameroon. Can relocate to Lagos.')).toBeInTheDocument();
    expect(screen.getByText('Figma Make')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Where can you work from?' })).toBeInTheDocument();
  });

  it('redirects the writing route to home', async () => {
    renderAt('/c/sunking/writing');
    await waitFor(() => expect(screen.getByText('CrowdRemit')).toBeInTheDocument());
  });
});
