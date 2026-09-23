import { Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { CompanyProvider } from '../../context/CompanyContext';
import CompanyPage from '../CompanyPage';
import { companySites } from './registry';

// Dispatches /c/<slug>/* to that company's bespoke mini-site. Companies without
// a registered site fall back to the generic single-page brief.
export default function CompanyRouter() {
  const { slug = '' } = useParams<{ slug: string }>();
  const site = companySites[slug];

  if (!site) {
    return <CompanyPage slug={slug} />;
  }

  const { Site, Loader, Home, Work, WorkItem, About, Writing, WritingItem } = site;

  return (
    <CompanyProvider slug={slug}>
      <Suspense fallback={<Loader full />}>
        <Site>
          <Routes>
            <Route index element={<Home />} />
            <Route path="work" element={<Work />} />
            <Route path="work/:id" element={<WorkItem />} />
            <Route path="about" element={<About />} />
            <Route path="writing" element={<Writing />} />
            <Route path="writing/:id" element={<WritingItem />} />
            <Route path="*" element={<Navigate to={`/c/${slug}`} replace />} />
          </Routes>
        </Site>
      </Suspense>
    </CompanyProvider>
  );
}
