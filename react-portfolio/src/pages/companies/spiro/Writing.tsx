import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import Loader from './Loader';

export default function Writing() {
  const { base, posts, loading } = useCompany();
  const visible = posts.filter((p) => !p.is_hidden);

  return (
    <section className="lp-section lp-section--page">
      <header className="lp-pagehead">
        <p className="lp-eyebrow">Writing</p>
        <h1 className="lp-pagehead__title">Notes from the work</h1>
        <p className="lp-pagehead__lede">
          Short pieces on service design, support reduction and building journeys in the field.
        </p>
      </header>

      {loading && visible.length === 0 ? (
        <Loader />
      ) : visible.length === 0 ? (
        <p className="lp-muted">Nothing published yet.</p>
      ) : (
        <ul className="lp-index">
          {visible.map((post, i) => (
            <li key={post.id} className="lp-index__row">
              <Link to={`${base}/writing/${post.id}`} className="lp-index__link">
                <span className="lp-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="lp-index__body">
                  <span className="lp-index__title">{post.title}</span>
                  {post.excerpt && <span className="lp-index__tagline">{post.excerpt}</span>}
                  <span className="lp-index__meta">{post.date} / {post.read_time}</span>
                </span>
                <span aria-hidden="true" />
                <ArrowRight className="lp-index__arrow" size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
