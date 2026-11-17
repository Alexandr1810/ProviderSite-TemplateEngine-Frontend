import { cookies } from 'next/headers';
import { server_config } from '@/app/utils/server_config';
import { blogOrigin } from '@/app/utils/blogView';

function apiOrigin() {
  return blogOrigin();
}

async function readBlog(path, init) {
  const res = await fetch(`${apiOrigin()}/front/blog/${server_config.site_key}${path}`, init);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

const publicCache = { next: { revalidate: server_config.сaching_period } };

export function loadBlogIndex() {
  return readBlog('', publicCache).then((data) => data || { enabled: false, sections: [], articles: [] });
}

export function loadBlogArticle(slug) {
  return readBlog(`/article/${encodeURIComponent(slug)}`, publicCache);
}

export function loadBlogSection(slug) {
  return readBlog(`/section/${encodeURIComponent(slug)}`, publicCache);
}

export async function loadBlogAdmin() {
  const store = await cookies();
  const cookie = store.getAll().map((item) => `${item.name}=${item.value}`).join('; ');
  const res = await fetch(`${apiOrigin()}/back/blog/${server_config.site_key}`, {
    cache: 'no-store',
    headers: cookie ? { cookie } : {},
  });
  if (!res.ok) {
    return { enabled: false, sections: [], articles: [], error: true };
  }
  const json = await res.json();
  return json.data;
}
