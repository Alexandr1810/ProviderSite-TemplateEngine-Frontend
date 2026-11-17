import { server_config } from '@/app/utils/server_config';

export function blogOrigin() {
  return `${server_config.api_protocol}://${server_config.site_folder}`;
}

export function blogImageUrl(file) {
  if (!file) return '';
  if (/^https?:\/\//i.test(file)) return file;
  return `${blogOrigin()}/uploads/${server_config.site_key}/blog/${encodeURIComponent(file)}`;
}

export function blogPlaceholderUrl() {
  return `${blogOrigin()}/uploads/${server_config.site_key}/additionals/noneImage.png`;
}

export function formatBlogDate(value) {
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function blogRobots(siteConfig) {
  const index = Number(siteConfig?.seo_indexing) === 1;
  return {
    index,
    follow: index,
    googleBot: { index, follow: index },
  };
}
