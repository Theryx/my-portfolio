import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="not-found">
        <div className="container">
          <div className="not-found__content">
            <h1 className="not-found__title">404</h1>
            <p className="not-found__subtitle">This page doesn't exist.</p>
            <p className="not-found__text">
              The page you're looking for may have been moved, renamed, or never existed.
            </p>
            <Link to="/" className="btn btn--primary">
              <ArrowLeft size={20} />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
