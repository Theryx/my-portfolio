import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within, configure } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompanyRouter from '../pages/companies/CompanyRouter';

// The site's pages are lazy-loaded; a cold first import can exceed the 1s default.
configure({ asyncUtilTimeout: 5000 });

vi.mock('../lib/api', () => {
  const mockCompany = {
    id: 'irc',
    name: 'International Rescue Committee',
    slug: 'carnet',
    role: 'Associate Designer',
    tagline: 'UX designer and researcher.',
    hero_title: "Hi, I'm Ndouken. I'm a UX designer and researcher in Douala, Cameroon.",
    hero_subtitle: 'I am a UX designer and researcher in Cameroon.',
    philosophy_title: 'How a field day runs',
    philosophy_text: 'This is how my field days went.',
    intro_expanded_text: 'Much of the work happened away from the screen.',
    badges: [],
    job_url: '',
    social_links: { email: 'ndouken@gmail.com', role_line: 'UX designer and researcher' },
    theme_config: {
      hero_highlight: 'UX designer and researcher',
      hero_fr: 'Je suis designer UX et chercheur au Cameroun.',
      about_fr: 'En français : un résumé.',
      field_steps: [
        { title: 'Go to them', text: 'Meet users in the field.' },
        { title: 'Watch first', text: 'Watch people use the app.' },
      ],
    },
    about_content: {
      lede: 'My background is in land surveying engineering.',
      location: 'Douala, Cameroon',
      languages: 'English and French',
      places: ['Promote, CITS and YAFE fairs in Yaounde'],
      experience: [{ role: 'UX Design Lead', org: 'PaySika', place: 'Douala', period: '2022 to 2026' }],
      skills: ['Field research and observation'],
      education: [{ degree: 'Masters in Engineering, Land Survey', school: 'NASPW', period: '2015 to 2020' }],
      faqs: [{ question: 'Which languages do you work in?', answer: 'French and English.' }],
    },
  };

  const mockProjects = [
    {
      id: 'paysika-field',
      tag: 'Field research',
      title: 'PaySika in the field',
      role: 'UX Design Lead',
      period: '2023 - 2026',
      location: 'Douala and Yaounde, Cameroon',
      tagline: 'A day in the field every month.',
      description: '',
      impact: '',
      image: '',
      responsibilities: [],
      is_hidden: false,
      content_blocks: [
        { type: 'intro', eyebrow: 'PaySika, 2023 to 2026', heading: 'Research happened where people used the app', text: 'Text.' },
        {
          type: 'steps',
          heading: 'Watch, note, write it up, change something',
          items: [{ title: 'Go to them', text: 'Meet users.', image: 'https://example.com/field.png' }],
        },
        { type: 'photos', heading: 'At the fair', items: [{ image: '', caption: 'Field photo to add' }] },
      ],
    },
    {
      id: 'shomi_default',
      tag: 'Research with students',
      title: 'Shomi (Kody)',
      role: 'Product Designer',
      period: '',
      location: 'Cameroon',
      tagline: 'An exam app tested with students.',
      description: 'Shomi was an exam app.',
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
    </MemoryRouter>,
  );
}

describe('IRC mini-site (carnet)', () => {
  it('renders the home page with the logbook index and no writing link', async () => {
    renderAt('/c/carnet');

    await waitFor(() => {
      expect(screen.getByText('PaySika in the field')).toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('UX designer and researcher');
    expect(screen.getByText('Je suis designer UX et chercheur au Cameroun.')).toHaveAttribute('lang', 'fr');
    expect(screen.getByRole('heading', { name: 'How a field day runs' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Writing' })).not.toBeInTheDocument();
  });

  it('renders the work index', async () => {
    renderAt('/c/carnet/work');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Entries' })).toBeInTheDocument());
    expect(screen.getByText('Shomi (Kody)')).toBeInTheDocument();
  });

  it('renders a case study with its stamp, blocks, placeholders and pager', async () => {
    renderAt('/c/carnet/work/paysika-field');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'PaySika in the field' })).toBeInTheDocument();
    });
    expect(screen.getByText('Entry 01 of 02')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Research happened where people used the app' })).toBeInTheDocument();
    expect(screen.getAllByText(/Image to add/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Entry 02/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /View image: Go to them/i }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Go to them')).toBeInTheDocument();
    fireEvent.click(dialog);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('renders the about page', async () => {
    renderAt('/c/carnet/about');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument());
    expect(screen.getByText('My background is in land surveying engineering.')).toBeInTheDocument();
    expect(screen.getByText('Promote, CITS and YAFE fairs in Yaounde')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Which languages do you work in?' })).toBeInTheDocument();
  });

  it('redirects the writing route to home', async () => {
    renderAt('/c/carnet/writing');
    await waitFor(() => expect(screen.getByText('PaySika in the field')).toBeInTheDocument());
  });
});
