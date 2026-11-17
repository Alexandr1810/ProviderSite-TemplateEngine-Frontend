import { setActiveCity } from '@/app/utils/getCities';

export default async function Breadcrumbs({ provider, articleTitle, section }) {
  const activeCity = await setActiveCity();
  const home = activeCity?.code ? `/${activeCity.code}` : '/';

  return (
    <nav className="blog-crumbs" aria-label="Хлебные крошки">
      <ol>
        <li><a href={home}>{provider}</a></li>
        <li>
          {articleTitle || section ? <a href="/blog">Блог</a> : <span aria-current="page">Блог</span>}
        </li>
        {section ? (
          <li>
            {articleTitle
              ? <a href={`/blog/section/${section.slug}`}>{section.name}</a>
              : <span aria-current="page">{section.name}</span>}
          </li>
        ) : null}
        {articleTitle ? <li><span aria-current="page">{articleTitle}</span></li> : null}
      </ol>
    </nav>
  );
}
