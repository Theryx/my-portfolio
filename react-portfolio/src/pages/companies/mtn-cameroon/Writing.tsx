import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import Loader from './Loader';

export default function Writing() {
  const { base, posts, loading } = useCompany();
  const visible = posts.filter((p) => !p.is_hidden);

  return (
    <section className="sig-section sig-section--page">
      <header className="sig-pagehead">
        <p className="sig-eyebrow">Writing</p>
        <h1 className="sig-pagehead__title">Notes from the work</h1>
        <p className="sig-pagehead__lede">
          Short pieces on delivery, regulated products and shipping in small teams.
        </p>
      </header>

      {loading && visible.length === 0 ? (
        <Loader />
      ) : visible.length === 0 ? (
        <p className="sig-muted">Nothing published yet.</p>
      ) : (
        <ul className="sig-index">
          {visible.map((post, i) => (
            <li key={post.id} className="sig-index__row">
              <Link to={`${base}/writing/${post.id}`} className="sig-index__link">
                <span className="sig-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="sig-index__body">
                  <span className="sig-index__title">{post.title}</span>
                  {post.excerpt && <span className="sig-index__tagline">{post.excerpt}</span>}
                  <span className="sig-index__meta">{post.date} / {post.read_time}</span>
                </span>
                <span aria-hidden="true" />
                <ArrowRight className="sig-index__arrow" size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
