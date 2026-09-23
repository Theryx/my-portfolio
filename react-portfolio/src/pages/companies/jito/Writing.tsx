import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import Loader from './Loader';

export default function Writing() {
  const { base, posts, loading } = useCompany();
  const visible = posts.filter((p) => !p.is_hidden);

  return (
    <section className="jn-section jn-section--page">
      <header className="jn-pagehead">
        <p className="jn-eyebrow">Writing</p>
        <h1 className="jn-pagehead__title">Notes and essays</h1>
        <p className="jn-pagehead__lede">
          On design systems, fintech UX and building products with engineering.
        </p>
      </header>

      {loading && visible.length === 0 ? (
        <Loader />
      ) : visible.length === 0 ? (
        <p className="jn-muted">Nothing published yet.</p>
      ) : (
        <ul className="jn-index">
          {visible.map((post) => (
            <li key={post.id} className="jn-index__row">
              <Link to={`${base}/writing/${post.id}`} className="jn-index__link">
                <span className="jn-index__body">
                  <span className="jn-index__title">{post.title}</span>
                  {post.excerpt && <span className="jn-index__tagline">{post.excerpt}</span>}
                  <span className="jn-index__meta">{post.date} / {post.read_time}</span>
                </span>
                <ArrowRight className="jn-index__arrow" size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
