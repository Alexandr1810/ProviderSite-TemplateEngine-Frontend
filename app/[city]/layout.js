import "@/app/globals.css";


import { loadConfig } from '@/app/utils/components-config.js';
import { setActiveCity } from '@/app/utils/getCities'

import { server_config } from '@/app/utils/server_config.js'


export async function generateMetadata({params}) {
  const { city } = await params;
  const activeCity = await setActiveCity(city);

  const site_config = await loadConfig();
    
  let title, description;  
  
  const seo_indexing = Number(site_config.seo_indexing) ? true : false;
  const canonical_enabled = site_config.canonical_url.includes('http');
  const canonical_url = site_config.canonical_url;

  if (server_config.site_key === 'domatelecom') {  // Только домателеком
    title = `${site_config.provider_name} — подбор тарифов на интернет и телевидение по всей России.`;
    description = `Бесплатный подбор провайдеров и тарифов на интернет и телевидение по всей России! Поможем подключить интернет быстро и без проблем. ☎️Подключение: ${site_config.connection_phone}.`;
  } 
  else if(Number(site_config.yr_typeOf_site)){   // Сайты под юриков
    title = `${site_config.provider_name} | Подключение интернета и видеонаблюдения для бизнеса в городе ${activeCity.city}.`;
    description = `Актуальные тарифы на интернет для бизнеса от ${site_config.genitive_provider_name} в г.${activeCity.city}! Скидки до -50% новым абонентам. ☎️Подключение: ${site_config.connection_phone}.`;
  }
  else{                                            //Все сайты
    title = `${site_config.provider_name} | Подключение домашнего интернета и ТВ в городе ${activeCity.city}.`;
    description = `Актуальные тарифы на домашний интернет и ТВ от ${site_config.genitive_provider_name} в г.${activeCity.city}! Скидки до -50% новым абонентам. ☎️Подключение: ${site_config.connection_phone}.`;
  }
  return {
    icons: {
      icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png`,
      shortcut: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png`,
      apple: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png`,
    },
    robots: {
      index: seo_indexing,
      follow: seo_indexing,
      // опционально, для гугл-бота отдельно:
      googleBot: {
        index: seo_indexing,
        follow: seo_indexing,
      },
    },
    ...(canonical_enabled ? {
      alternates: {
        canonical: canonical_url,
      },
    } : {}),
    openGraph: { // Мета-штуки
      title: title,
      description: description,
      url: `${server_config.api_protocol}://${server_config.site_folder}/`,
      siteName: site_config.provider_name,
      type: 'website', // og:type
      locale: 'ru_RU',

      images: [
      {
        url: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/img/OG_Image.png`, // абсолютный URL
        alt: `Превью сайта ${site_config.provider_name}`,
      },
    ],

    },
    title: title,
    description: description,
  };
}

export default async function RootLayout({ children }) {

  return (
      <>
          {children}
      </>
  );
}
