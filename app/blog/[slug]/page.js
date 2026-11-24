import { notFound } from 'next/navigation';
import { loadConfig } from '@/app/utils/components-config';
import { loadYMConfig } from '@/app/mods/YandexMetrika/YandexMetrika_config';
import { loadBlogArticle, loadBlogSection } from '@/app/utils/blog';
import { blogImageUrl, blogOrigin, blogRobots, formatBlogDate } from '@/app/utils/blogView';
import { setActiveCity } from '@/app/utils/getCities';
import Breadcrumbs from '@/app/components/blog/breadcrumbs';
import ArticleBody from '@/app/components/blog/articleBody';
import { RelatedArticles } from '@/app/components/blog/blogFeed';
import { ArticleCta, ArticleDealForm } from '@/app/components/footer/connectionButton';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [siteConfig, article] = await Promise.all([loadConfig(), loadBlogArticle(slug)]);
  if (!article) return { title: 'Статья', robots: { index: false, follow: false } };

  const title = `${article.title} — ${siteConfig.provider_name}`;
  const description = article.description || `Статья «${article.title}» в блоге ${siteConfig.provider_name}.`;
  const url = `${blogOrigin()}/blog/${article.slug}`;

  return {
    title,
    description,
    robots: blogRobots(siteConfig),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.provider_name,
      type: 'article',
      locale: 'ru_RU',
      publishedTime: article.created_at || undefined,
      modifiedTime: article.updated_at || undefined,
      images: article.cover ? [{ url: blogImageUrl(article.cover), alt: article.title }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const [siteConfig, article, reachConfig, activeCity] = await Promise.all([
    loadConfig(),
    loadBlogArticle(slug),
    loadYMConfig(),
    setActiveCity(),
  ]);
  if (!article) notFound();

  const sectionData = article.section_slug ? await loadBlogSection(article.section_slug) : null;
  const related = (sectionData?.articles || [])
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const url = `${blogOrigin()}/blog/${article.slug}`;
  const home = blogOrigin();
  const date = formatBlogDate(article.created_at);
  const readTime = String(article.read_time || '').trim();
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      datePublished: article.created_at,
      dateModified: article.updated_at || article.created_at,
      mainEntityOfPage: url,
      articleSection: article.section_name,
      image: article.cover ? blogImageUrl(article.cover) : undefined,
      author: { '@type': 'Organization', name: siteConfig.provider_name, url: home },
      publisher: { '@type': 'Organization', name: siteConfig.provider_name, url: home },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: siteConfig.provider_name, item: home },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: `${home}/blog` },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ],
    },
  ];

  return (
    <div className="blog-wrap blog-article-page">
      <div className="blog-article-layout">
        <article className="blog-article">
          <Breadcrumbs provider={siteConfig.provider_name} articleTitle={article.title} />
          <a className="blog-kicker" href={`/blog/section/${article.section_slug}`}>{article.section_name}</a>
          <h1>{article.title}</h1>
          {(date || readTime) ? (
            <div className="blog-meta">
              {date ? <time dateTime={article.created_at}>{date}</time> : null}
              {date && readTime ? <span aria-hidden="true">·</span> : null}
              {readTime ? <span>{readTime}</span> : null}
            </div>
          ) : null}
          {article.excerpt ? <p className="blog-excerpt">{article.excerpt}</p> : null}
          <ArticleBody blocks={article.content} />
          <ArticleCta text={article.cta_text} articleTitle={article.title} />
          <RelatedArticles articles={related} />
        </article>
        <ArticleDealForm
          siteConfig={siteConfig}
          activeCity={activeCity}
          reachGoals={reachConfig.reachGoals}
          articleTitle={article.title}
        />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
