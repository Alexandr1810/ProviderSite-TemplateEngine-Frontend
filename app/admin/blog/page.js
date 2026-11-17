import Header from '@/app/admin/components/header';
import { BlogAdmin } from '@/app/admin/adminPage';
import { loadConfig, loadItemsConfig } from '@/app/utils/components-config';
import { loadBlogAdmin } from '@/app/utils/blog';

export const metadata = {
  title: 'Блог | Панель управления',
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const siteConfig = await loadConfig(true);
  const { logo_small } = await loadItemsConfig(true);
  const blog = await loadBlogAdmin();

  return (
    <div className="adminPage">
      <Header logo_small={logo_small} provider_name={siteConfig.provider_name} />
      <BlogAdmin initial={blog} />
    </div>
  );
}
