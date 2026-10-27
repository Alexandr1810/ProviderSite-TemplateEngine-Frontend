import { Overpass } from "next/font/google";
import "@/app/globals.css";
import GlobalContext from '@/app/utils/globalContext';
import { loadOffers } from '@/app/utils/getOffers';


import { loadContext, loadConfig } from '@/app/utils/components-config.js';
import { loadStyles } from '@/app/utils/style-config'

import { loadYMConfig } from '@/app/mods/YandexMetrika/YandexMetrika_config.js'
import YandexMetrikaWithB242YA from '@/app/mods/YandexMetrika/YandexMetrika.js';

import PixelVictory from '@/app/utils/PixelVictory'

import { server_config } from '@/app/utils/server_config.js'

const OverpassSans = Overpass({
  subsets: ["latin"],
});


export async function generateMetadata() {
  const site_config = await loadConfig();
  const { reachGoals } = await loadYMConfig()

  let title, description;

  const seo_indexing = Number(site_config.seo_indexing) ? true : false;
  const canonical_enabled = site_config.canonical_url.includes('http');
  const canonical_url = site_config.canonical_url;

  if (server_config.site_key === 'domatelecom') {  //Только домателеком
    title = `${site_config.provider_name} — подбор тарифов на интернет и телевидение по всей России.`;
    description = `Бесплатный подбор провайдеров и тарифов на интернет и телевидение по всей России! Поможем подключить интернет быстро и без проблем. ☎️Подключение: ${site_config.connection_phone}.`;
  }
  else if(Number(site_config.yr_typeOf_site)){   // Сайты под юриков
    title = `${site_config.provider_name} | Подключение интернета и видеонаблюдения для бизнеса в Вашем городе.`;
    description = `Актуальные тарифы на интернет для бизнеса от ${site_config.genitive_provider_name} в Вашем городе! Скидки до -50% новым абонентам. ☎️Подключение: ${site_config.connection_phone}.`;
  }
  else{                                            //Все сайты
    title = `${site_config.provider_name} | Подключение домашнего интернета и ТВ в Вашем городе.`;
    description = `Актуальные тарифы на домашний интернет и ТВ от ${site_config.genitive_provider_name} в Вашем городе! Скидки до -50% новым абонентам. ☎️Подключение: ${site_config.connection_phone}.`;
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
    verification: {
      yandex: reachGoals.yandex_verification,
    },
  };
}

export default async function RootLayout({ children }) {
  const site_config = await loadConfig();
  const { reachGoals } = await loadYMConfig()

  const styleConfig = await loadStyles();
  const { allIconsCss } = await loadContext();

  const { allOffers_plans } = await loadOffers();


  return (
    <html lang="ru" className={OverpassSans.className}>
      <body>
        <style dangerouslySetInnerHTML={{ __html: styleConfig }} />
        <style dangerouslySetInnerHTML={{ __html: allIconsCss }} />
        <GlobalContext initialOffers={allOffers_plans}>
          {children}
        </GlobalContext>
        {Number(site_config.victorycorp) ? <PixelVictory /> : ''}
        <YandexMetrikaWithB242YA counter={reachGoals.ym_counter} />
      </body>
    </html>
  );
}
