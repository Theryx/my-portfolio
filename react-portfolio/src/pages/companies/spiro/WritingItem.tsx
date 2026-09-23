import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompany } from '../../../context/CompanyContext';
import { usePageMeta } from '../../../hooks/usePageMeta';
import { LpMarkdown, ImagePlaceholder } from './Blocks';
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
      <section className="lp-section lp-section--page">
        <p className="lp-muted">That article could not be found.</p>
        <Link to={`${base}/writing`} className="lp-textlink">Back to writing</Link>
      </section>
    );
  }

  const cover = resolveMedia(post.image);

  return (
    <article className="lp-section lp-section--page">
      <Link to={`${base}/writing`} className="lp-back">
        <ArrowLeft size={16} aria-hidden="true" /> Writing
      </Link>

      <header className="lp-article__head">
        <h1 className="lp-article__title">{post.title}</h1>
        {post.excerpt && <p className="lp-article__lede">{post.excerpt}</p>}
        <p className="lp-article__byline">{post.author} / {post.date} / {post.read_time}</p>
      </header>

      {cover ? (
        <figure className="lp-article__hero">
          <img src={cover} alt={post.title} loading="eager" />
        </figure>
      ) : (
        <div className="lp-article__hero lp-article__hero--empty">
          <ImagePlaceholder note={`Cover image for "${post.title}"`} />
        </div>
      )}

      <div className="lp-prose">
        <LpMarkdown text={stripLeadingH1(post.content)} allowHtml />
      </div>
    </article>
  );
}
