import { notFound } from 'next/navigation';
import { loadConfig } from '@/app/utils/components-config';
import { loadBlogIndex, loadBlogSection } from '@/app/utils/blog';
import { blogOrigin, blogRobots } from '@/app/utils/blogView';
import Breadcrumbs from '@/app/components/blog/breadcrumbs';
import { BlogFeed, SectionNav } from '@/app/components/blog/blogFeed';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [siteConfig, data] = await Promise.all([loadConfig(), loadBlogSection(slug)]);
  if (!data) return { title: 'Раздел блога', robots: { index: false, follow: false } };

  const title = `${data.section.name} — блог ${siteConfig.provider_name}`;
  const description = data.section.description?.trim()
    || `Статьи раздела «${data.section.name}» в блоге ${siteConfig.genitive_provider_name}.`;
  const url = `${blogOrigin()}/blog/section/${data.section.slug}`;

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

export default async function BlogSectionPage({ params }) {
  const { slug } = await params;
  const [siteConfig, data, blog] = await Promise.all([
    loadConfig(),
    loadBlogSection(slug),
    loadBlogIndex(),
  ]);
  if (!data) notFound();

  const url = `${blogOrigin()}/blog/section/${data.section.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.section.name,
    description: data.section.description || undefined,
    url,
    isPartOf: { '@type': 'Blog', name: `Блог ${siteConfig.provider_name}`, url: `${blogOrigin()}/blog` },
  };

  return (
    <div className="blog-wrap">
      <Breadcrumbs provider={siteConfig.provider_name} section={data.section} />
      <SectionNav sections={blog.sections} activeSlug={data.section.slug} />
      <h1>{data.section.name}</h1>
      {data.section.description ? <p className="blog-lead">{data.section.description}</p> : null}
      <BlogFeed articles={data.articles} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
