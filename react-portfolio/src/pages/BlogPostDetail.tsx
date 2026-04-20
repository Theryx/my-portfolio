import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { getBlogPostById, type BlogPost } from '../lib/supabase';
import { blogImageMap } from '../data/blog';

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      const data = await getBlogPostById(id);
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </PageTransition>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
          <h1>Post not found</h1>
          <Link to="/blog" className="btn btn--primary" style={{ marginTop: '20px' }}>
            Back to Blog
          </Link>
        </div>
      </PageTransition>
    );
  }

  const imageSrc = blogImageMap[post.image];

  return (
    <PageTransition>
      <article className="blog-detail">
        <div className="container">
          <Link to="/blog" className="blog-detail__back">
            <ArrowLeft size={20} />
            Back to Blog
          </Link>

          <header className="blog-detail__header">
            <div className="blog-detail__tags">
              {(post.tags || []).map(tag => (
                <span key={tag} className="blog-detail__tag">{tag}</span>
              ))}
            </div>
            <h1 className="blog-detail__title">{post.title}</h1>
            
            <div className="blog-detail__meta">
              <div className="blog-detail__meta-item">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="blog-detail__meta-item">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              <div className="blog-detail__meta-item">
                <Clock size={16} />
                <span>{post.read_time}</span>
              </div>
            </div>
          </header>

          <div className="blog-detail__hero">
            <img src={imageSrc} alt={post.title} loading="eager" />
          </div>

          <div className="blog-detail__body" dangerouslySetInnerHTML={{ __html: post.content }} />

          <footer className="blog-detail__footer">
            <div className="blog-detail__navigation">
              <Link to="/blog" className="blog-detail__nav-btn">
                <ArrowLeft size={20} />
                All Posts
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </PageTransition>
  );
}
