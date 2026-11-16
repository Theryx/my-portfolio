import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, configure } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

configure({ asyncUtilTimeout: 5000 });

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'wave',
    name: 'Wave',
    slug: 'wave',
    role: 'Product Designer',
    tagline: 'Product designer.',
    hero_title: 'I design mobile money flows people can trust.',
    hero_subtitle: 'Android-first fintech and Expo APK prototypes.',
    philosophy_title: 'How I work on mobile',
    philosophy_text: '',
    intro_expanded_text: 'First paragraph.\n\nSecond paragraph.',
    badges: [],
    job_url: 'https://www.wave.com/en/careers/',
    social_links: { email: 'ndouken@gmail.com', role_line: 'Product designer' },
    theme_config: {
      practice: [{ title: 'Watch real people first', text: 'Monthly field visits.' }],
      ai: {
        title: 'Prototyping with Claude and Expo',
        steps: [{ title: 'Verify on Android APKs via Expo', text: 'With Claude.' }],
        notes: [{ title: 'What stays human', text: 'Sketches first.' }],
      },
      projects: {
        paysika_fintech: {
          side: 'Consumer fintech',
          receipt: [
            { label: 'Markets', value: 'Cameroon and Gabon' },
            { label: 'Outcome', value: '+40% retention, -60% tickets' },
          ],
        },
      },
    },
    about_content: {
      lede: 'I am a product designer in Douala.',
      location: 'Douala, Cameroon',
      languages: 'English and French',
      tools: [{ label: 'Motion', items: ['Rive', 'Figma motion', 'Lottie'] }],
      experience: [{ role: 'UX Design Lead', org: 'PaySika', place: 'Douala', period: 'Dec 2021 - Aug 2026' }],
      skills: ['Prototyping with Claude and Expo APKs'],
      education: [],
      certifications: [],
      faqs: [{ question: 'How do you prototype?', answer: 'Claude, Figma Make and Expo APKs.' }],
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
      period: 'Dec 2021 - Aug 2026',
      tagline: 'Consumer banking for first-time card holders.',
      image: '',
      content_blocks: [
        { type: 'intro', eyebrow: 'PaySika', heading: 'A bank app for people new to banking', text: 'Text.' },
        {
          type: 'steps',
          eyebrow: 'Flows',
          heading: 'Guided camera KYC',
          items: [{ title: 'Resumable steps', text: 'Start anywhere.' }],
        },
        { type: 'gallery', heading: 'Screens', items: [{ image: 'https://example.com/kyc.png', title: 'KYC' }] },
      ],
    },
    {
      ...base,
      id: 'ai-side-projects',
      tag: 'Side projects',
      title: 'Louci and Cici',
      role: 'Product Designer',
      period: '2026',
      tagline: 'Personal finance and ops.',
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

describe('Company site /c/wave (ledger)', () => {
  it('renders Home with the interactive mobile flow strip', async () => {
    renderAt('/c/wave');
    expect(await screen.findByText('I design mobile money flows people can trust.')).toBeInTheDocument();
    expect(screen.getByText('PaySika')).toBeInTheDocument();

    const ridersTab = screen.getByRole('tab', { name: '02 Field riders app' });
    fireEvent.click(ridersTab);
    expect(screen.getByText('Relay handover cut from 30 to 10 min')).toBeInTheDocument();
  });

  it('renders Work ledger list', async () => {
    renderAt('/c/wave/work');
    expect(await screen.findByText('Selected work')).toBeInTheDocument();
    expect(screen.getByText('Louci and Cici')).toBeInTheDocument();
  });

  it('renders a case study with its receipt card and blocks', async () => {
    renderAt('/c/wave/work/paysika_fintech');
    await waitFor(() => {
      expect(screen.getByText('Case receipt')).toBeInTheDocument();
    });
    expect(screen.getByText('+40% retention, -60% tickets')).toBeInTheDocument();
    expect(screen.getByText('A bank app for people new to banking')).toBeInTheDocument();
    expect(screen.getByText('Guided camera KYC')).toBeInTheDocument();
  });

  it('renders About with motion and Expo tools', async () => {
    renderAt('/c/wave/about');
    expect(await screen.findByText('Rive, Figma motion, Lottie')).toBeInTheDocument();
    expect(screen.getByText('PaySika, Douala')).toBeInTheDocument();
  });

  it('redirects /writing back to Home', async () => {
    renderAt('/c/wave/writing');
    expect(await screen.findByText('I design mobile money flows people can trust.')).toBeInTheDocument();
  });
});
