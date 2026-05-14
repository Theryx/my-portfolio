import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import { blogImageMap } from '../data/blog';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export default function Blog() {
  const { blogPosts, loading, error } = useProfile();
  const [activeTag, setActiveTag] = useState('All');

  const uniqueTags = ['All', ...new Set(blogPosts.flatMap(p => p.tags || []))];

  const filteredPosts = activeTag === 'All'
    ? blogPosts
    : blogPosts.filter(p => (p.tags || []).includes(activeTag));

  return (
    <PageTransition>
      <section className="blog">
        <div className="container">
          <h2 className="section__title">Blog & Insights</h2>
          <p className="section__subtitle">Thoughts on design, technology, and the future of fintech in Africa.</p>

          {loading ? (
            <p role="status" aria-live="polite">Loading blog posts...</p>
          ) : error ? (
            <p role="alert" style={{ color: 'var(--color-error, #e53e3e)', textAlign: 'center', padding: '60px 0' }}>
              Failed to load posts. Please try again later.
            </p>
          ) : (
            <>
              <div className="blog__filters" role="group" aria-label="Filter posts by tag">
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    className={`projects__filter-btn ${activeTag === tag ? 'projects__filter-btn--active' : ''}`}
                    onClick={() => setActiveTag(tag)}
                    type="button"
                    aria-pressed={activeTag === tag}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                  {activeTag === 'All' ? 'No posts published yet.' : `No posts tagged "${activeTag}".`}
                </p>
              )}

              <motion.div className="blog__grid" layout>
                {filteredPosts.map((post) => (
                  <Link to={`/blog/${post.id}`} key={post.id} className="blog-card">
                    <div className="blog-card__image">
                      <img
                        src={blogImageMap[post.image] || ''}
                        alt={post.title}
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="blog-card__content">
                      <div className="blog-card__meta">
                        <span className="blog-card__date">
                          <Calendar size={14} />
                          {post.date}
                        </span>
                        <span className="blog-card__read-time">
                          <Clock size={14} />
                          {post.read_time}
                        </span>
                      </div>
                      <h3 className="blog-card__title">{post.title}</h3>
                      <p className="blog-card__excerpt">{post.excerpt}</p>
                      <div className="blog-card__tags">
                        {(post.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="blog-card__tag">{tag}</span>
                        ))}
                      </div>
                      <span className="blog-card__cta">Read More <span className="blog-card__cta-arrow">→</span></span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}