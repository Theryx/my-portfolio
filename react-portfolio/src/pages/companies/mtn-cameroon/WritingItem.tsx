import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import { SigMarkdown, ImagePlaceholder } from './Blocks';
import { resolveMedia, stripLeadingH1 } from './media';
import Loader from './Loader';

export default function WritingItem() {
  const { id } = useParams<{ id: string }>();
  const { base, posts, loading } = useCompany();
  const post = posts.find((p) => p.id === id) ?? null;

  usePageMeta({
    title: post?.title,
    description: post?.excerpt,
    image: resolveMedia(post?.image),
    type: 'article',
  });

  if (loading && !post) {
    return <Loader />;
  }

  if (!post) {
    return (
      <section className="sig-section sig-section--page">
        <p className="sig-muted">That article could not be found.</p>
        <Link to={`${base}/writing`} className="sig-textlink">Back to writing</Link>
      </section>
    );
  }

  const cover = resolveMedia(post.image);

  return (
    <article className="sig-section sig-section--page">
      <Link to={`${base}/writing`} className="sig-back">
        <ArrowLeft size={16} aria-hidden="true" /> Writing
      </Link>

      <header className="sig-article__head">
        <h1 className="sig-article__title">{post.title}</h1>
        {post.excerpt && <p className="sig-article__lede">{post.excerpt}</p>}
        <p className="sig-article__byline">{post.author} / {post.date} / {post.read_time}</p>
      </header>

      {cover ? (
        <figure className="sig-article__hero">
          <img src={cover} alt={post.title} loading="eager" />
        </figure>
      ) : (
        <div className="sig-article__hero sig-article__hero--empty">
          <ImagePlaceholder note={`Cover image for "${post.title}"`} />
        </div>
      )}

      <div className="sig-prose">
        <SigMarkdown text={stripLeadingH1(post.content)} allowHtml />
      </div>
    </article>
  );
}
