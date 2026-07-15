import { useParams } from 'react-router-dom';
import ProfileLink from '../components/ProfileLink';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlogPostById, type BlogPost } from '../lib/api';
import { blogImageMap, resolveBlogImage } from '../data/blog';
import { usePageMeta } from '../hooks/usePageMeta';
import { lightboxTrigger } from '../lib/a11y';
import { ReadingProgress } from '../components/ReadingProgress';

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  usePageMeta({
    title: post?.title,
    description: post?.excerpt,
    image: post?.image,
    type: 'article',
  });

  const handleImageClick = (src: string, caption: string) => {
    setSelectedImage({ src, caption });
  };

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
          <ProfileLink to="/blog" className="btn btn--primary" style={{ marginTop: '20px' }}>
            Back to Blog
          </ProfileLink>
        </div>
      </PageTransition>
    );
  }

  const imageSrc = resolveBlogImage(post.image);

  return (
    <PageTransition>
      <ReadingProgress />
      <article className="blog-detail">
        <div className="container">
          <ProfileLink to="/blog" className="blog-detail__back">
            <ArrowLeft size={20} />
            Back to Blog
          </ProfileLink>

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

          <div 
            className="blog-detail__hero"
            {...lightboxTrigger(() => handleImageClick(imageSrc, post.title), 'Enlarge cover image')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={imageSrc}
              alt={post.title}
              loading="eager"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <div className="blog-detail__body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ src, alt, ...props }) => {
                  const decodedSrc = decodeURIComponent(src || '');
                  const resolvedSrc = blogImageMap[decodedSrc] || src;
                  return (
                    <div 
                      className="markdown-image-wrapper" 
                      style={{ 
                        margin: 'var(--spacing-lg) 0', 
                        textAlign: 'center',
                        display: 'block',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <img
                        src={resolvedSrc}
                        alt={alt}
                        loading="lazy"
                        {...lightboxTrigger(() => handleImageClick(resolvedSrc || '', alt || ''), `Enlarge: ${alt || 'image'}`)}
                        style={{ 
                          cursor: 'pointer', 
                          borderRadius: '16px', 
                          boxShadow: 'var(--shadow-md)', 
                          maxWidth: '100%', 
                          height: 'auto',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        className="markdown-zoom-image"
                        {...props}
                      />
                      {alt && (
                        <span 
                          className="markdown-image-caption" 
                          style={{ 
                            display: 'block', 
                            fontSize: '0.875rem', 
                            color: 'var(--color-text-muted)', 
                            marginTop: '8px', 
                            fontStyle: 'italic' 
                          }}
                        >
                          {alt}
                        </span>
                      )}
                    </div>
                  );
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="blog-detail__footer">
            <div className="blog-detail__navigation">
              <ProfileLink to="/blog" className="blog-detail__nav-btn">
                <ArrowLeft size={20} />
                All Posts
              </ProfileLink>
            </div>
          </footer>
        </div>
      </article>
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="image-lightbox__content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="image-lightbox__close" onClick={() => setSelectedImage(null)}>&times;</button>
              <img src={selectedImage.src} alt={selectedImage.caption} />
              <div className="image-lightbox__caption">
                <p>{selectedImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
