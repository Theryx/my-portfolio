import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import { usePageTitle } from './hooks/usePageTitle';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ProfileProvider } from './context/ProfileContext';

// Route-level code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./pages/Admin'));

// Scroll-to-top on route change
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  usePageTitle();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Suspense fallback={<LoadingScreen />}><Home /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<LoadingScreen />}><About /></Suspense>} />
        <Route path="/projects" element={<Suspense fallback={<LoadingScreen />}><Projects /></Suspense>} />
        <Route path="/projects/:id" element={<Suspense fallback={<LoadingScreen />}><ProjectDetail /></Suspense>} />
        <Route path="/blog" element={<Suspense fallback={<LoadingScreen />}><Blog /></Suspense>} />
        <Route path="/blog/:id" element={<Suspense fallback={<LoadingScreen />}><BlogPostDetail /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<LoadingScreen />}><Contact /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<LoadingScreen />}><Admin /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<LoadingScreen />}><NotFound /></Suspense>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ProfileProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </ProfileProvider>
    </Router>
  );
}

export default App;
