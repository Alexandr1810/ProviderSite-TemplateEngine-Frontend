import { notFound } from 'next/navigation';
import { loadConfig } from '@/app/utils/components-config';
import { loadBlogIndex } from '@/app/utils/blog';
import { blogOrigin, blogRobots } from '@/app/utils/blogView';
import Breadcrumbs from '@/app/components/blog/breadcrumbs';
import { BlogFeed, SectionNav } from '@/app/components/blog/blogFeed';

export async function generateMetadata() {
  const [siteConfig, blog] = await Promise.all([loadConfig(), loadBlogIndex()]);
  if (!blog.enabled) return { title: 'Блог', robots: { index: false, follow: false } };

  const title = `Блог ${siteConfig.provider_name}`;
  const description = `Статьи и инструкции ${siteConfig.genitive_provider_name}: подключение интернета, тарифы и ответы на вопросы.`;
  const url = `${blogOrigin()}/blog`;

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
      type: 'website',
      locale: 'ru_RU',
    },
  };
}

export default async function BlogPage() {
  const [siteConfig, blog] = await Promise.all([loadConfig(), loadBlogIndex()]);
  if (!blog.enabled) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Блог ${siteConfig.provider_name}`,
    url: `${blogOrigin()}/blog`,
    blogPost: blog.articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      url: `${blogOrigin()}/blog/${article.slug}`,
      datePublished: article.created_at,
    })),
  };

  return (
    <div className="blog-wrap">
      <Breadcrumbs provider={siteConfig.provider_name} />
      <h1>Блог</h1>
      <SectionNav sections={blog.sections} />
      <BlogFeed articles={blog.articles} emptyText="Статьи скоро появятся." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
