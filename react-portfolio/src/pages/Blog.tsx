import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { blogPosts, blogImageMap, blogTags } from '../data/blog';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export default function Blog() {
  const [activeTag, setActiveTag] = useState('All');

  const filteredPosts = activeTag === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.tags.includes(activeTag));

  return (
    <PageTransition>
      <section className="blog">
        <div className="container">
          <h2 className="section__title">Blog & Insights</h2>
          <p className="section__subtitle">Thoughts on design, technology, and the future of fintech in Africa.</p>

          {/* Filter pills */}
          <div className="projects__filters">
            {blogTags.map(tag => (
              <button
                key={tag}
                className={`projects__filter-btn ${activeTag === tag ? 'projects__filter-btn--active' : ''}`}
                onClick={() => setActiveTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>

          <motion.div className="blog__grid" layout>
            {filteredPosts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="blog-card">
                <div className="blog-card__image">
                  <img src={blogImageMap[post.id]} alt={post.title} loading="lazy" />
                </div>
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="blog-card__date">
                      <Calendar size={14} />
                      {post.date}
                    </span>
                    <span className="blog-card__read-time">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__tags">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="blog-card__tag">{tag}</span>
                    ))}
                  </div>
                  <span className="blog-card__cta">Read More <span className="blog-card__cta-arrow">→</span></span>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
