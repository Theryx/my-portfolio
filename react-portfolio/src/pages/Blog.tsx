import ProfileLink from '../components/ProfileLink';
import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import { blogImageMap } from '../data/blog';
import { motion } from 'framer-motion';
import { Calendar, Clock, PenLine } from 'lucide-react';
import { gridVariants, tileVariants } from '../lib/motion';

export default function Blog() {
  const { profile, blogPosts, loading, error } = useProfile();

  return (
    <PageTransition>
      <section className="blog">
        <div className="container">
          <div className="page-hero">
            <span className="section-sticker section-sticker--accent">
              <PenLine size={13} aria-hidden="true" />
              Notes from the field
            </span>
            <h2 className="section__title page-hero__title">Blog & Insights</h2>
            <p className="page-hero__sub">{profile?.social_links?.blog_intro || 'Thoughts on design, technology, and the future of fintech in Africa.'}</p>
          </div>

          {loading ? (
            <p role="status" aria-live="polite">Loading blog posts...</p>
          ) : error ? (
            <p role="alert" style={{ color: 'var(--color-error, #e53e3e)', textAlign: 'center', padding: '60px 0' }}>
              Failed to load posts. Please try again later.
            </p>
          ) : (
            <>
              {blogPosts.length === 0 && (
                <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                  No posts published yet.
                </p>
              )}

              <motion.div
                className="blog__grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
              >
                {blogPosts.map((post, index) => {
                  const isFeatured = index === 0;
                  return (
                    <motion.div key={post.id} variants={tileVariants} className={isFeatured ? 'blog-card-wrap--featured' : ''}>
                      <ProfileLink to={`/blog/${post.id}`} className={`blog-card ${isFeatured ? 'blog-card--featured' : ''}`}>
                        {isFeatured && <span className="blog-card__latest">Latest</span>}
                        <div className="blog-card__image">
                          <img
                            src={blogImageMap[post.image] || ''}
                            alt={post.title}
                            loading={isFeatured ? 'eager' : 'lazy'}
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
                      </ProfileLink>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
