import { blogImageUrl, formatBlogDate } from '@/app/utils/blogView';

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

export function BlogFeed({ articles, emptyText }) {
  if (!articles?.length) {
    return <p className="blog-empty">{emptyText || 'В этом разделе пока нет статей.'}</p>;
  }

  return (
    <div className="blog-feed">
      {articles.map((article) => (
        <a className="blog-card" href={`/blog/${article.slug}`} key={article.id}>
          {article.cover
            ? <img src={blogImageUrl(article.cover)} alt="" />
            : <div className="blog-card-cover" aria-hidden="true" />}
          <div className="blog-card-body">
            {article.section_name ? <span>{article.section_name}</span> : null}
            <h2>{article.title}</h2>
            {article.description ? <p>{article.description}</p> : null}
            <time dateTime={article.created_at}>{formatBlogDate(article.created_at)}</time>
          </div>
        </a>
      ))}
    </div>
  );
}
