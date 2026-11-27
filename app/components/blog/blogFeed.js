import { blogImageUrl, formatBlogDate, formatBlogReadTime } from '@/app/utils/blogView';
import { BlogFeedMore } from '@/app/components/footer/connectionButton';

export function SectionNav({ sections, activeSlug }) {
  if (!sections?.length) return null;

  return (
    <nav className="blog-sections" aria-label="Разделы блога">
      <a href="/blog" className={activeSlug ? '' : 'active'}>Все</a>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`/blog/section/${section.slug}`}
          className={activeSlug === section.slug ? 'active' : ''}
        >
          {section.name}
        </a>
      ))}
    </nav>
  );
}

function ArticleMeta({ article }) {
  const date = formatBlogDate(article.created_at);
  const readTime = formatBlogReadTime(article.read_time);
  if (!date && !readTime) return null;
  return (
    <div className="blog-meta">
      {date ? <time dateTime={article.created_at}>{date}</time> : null}
      {date && readTime ? <span aria-hidden="true">·</span> : null}
      {readTime ? <span>{readTime}</span> : null}
    </div>
  );
}

export function BlogCard({ article }) {
  return (
    <a className="blog-card" href={`/blog/${article.slug}`}>
      {article.cover
        ? <img src={blogImageUrl(article.cover)} alt="" />
        : <div className="blog-card-cover" aria-hidden="true" />}
      <div className="blog-card-body">
        {article.section_name ? <span>{article.section_name}</span> : null}
        <h2>{article.title}</h2>
        {article.description ? <p>{article.description}</p> : null}
        <ArticleMeta article={article} />
      </div>
    </a>
  );
}

export function BlogFeed({ articles, emptyText, limit }) {
  if (!articles?.length) {
    return <p className="blog-empty">{emptyText || 'В этом разделе пока нет статей.'}</p>;
  }

  const cards = (
    <div className="blog-feed">
      {articles.map((article) => <BlogCard article={article} key={article.id} />)}
    </div>
  );

  if (!limit || articles.length <= limit) return cards;

  return <BlogFeedMore>{cards}</BlogFeedMore>;
}

export function RelatedArticles({ articles }) {
  if (!articles?.length) return null;
  return (
    <section className="blog-related">
      <h2>Читать дальше</h2>
      <div className="blog-feed">
        {articles.map((article) => <BlogCard article={article} key={article.id} />)}
      </div>
    </section>
  );
}
