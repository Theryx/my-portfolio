import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { resolveBlogImage } from '../../../data/blog';
import { usePageMeta } from '../../../hooks/usePageMeta';
import { JitoMarkdown, ImagePlaceholder } from './Blocks';

export default function WritingItem() {
  const { id } = useParams<{ id: string }>();
  const { base, posts, loading } = useCompany();
  const post = posts.find((p) => p.id === id) ?? null;

  usePageMeta({
    title: post?.title,
    description: post?.excerpt,
    image: post?.image,
    type: 'article',
  });

  if (loading && !post) {
    return <section className="jn-section jn-section--page"><p className="jn-muted">Loading.</p></section>;
  }

  if (!post) {
    return (
      <section className="jn-section jn-section--page">
        <p className="jn-muted">That article could not be found.</p>
        <Link to={`${base}/writing`} className="jn-textlink">Back to writing</Link>
      </section>
    );
  }

  const cover = resolveBlogImage(post.image);

  return (
    <article className="jn-section jn-section--page">
      <Link to={`${base}/writing`} className="jn-back">
        <ArrowLeft size={16} aria-hidden="true" /> Writing
      </Link>

      <header className="jn-article__head">
        <h1 className="jn-article__title">{post.title}</h1>
        <p className="jn-article__byline">{post.author} / {post.date} / {post.read_time}</p>
      </header>

      {cover ? (
        <figure className="jn-article__hero">
          <img src={cover} alt={post.title} loading="eager" />
        </figure>
      ) : (
        <div className="jn-article__hero jn-article__hero--empty">
          <ImagePlaceholder note={`Cover image for "${post.title}"`} />
        </div>
      )}

      <div className="jn-prose">
        <JitoMarkdown text={post.content} resolveImage={resolveBlogImage} allowHtml />
      </div>
    </article>
  );
}
