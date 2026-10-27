import "@/app/globals.css";


import { loadConfig } from '@/app/utils/components-config.js';


import { server_config } from '@/app/utils/server_config.js'



export async function generateMetadata() {
  const site_config = await loadConfig();
  const title = `${site_config.provider_name} | Панель управления`;
  const description = `Актуальные тарифы на домашний интернет и ТВ от ${site_config.genitive_provider_name} в Вашем городе! Скидки до -50% новым абонентам. ☎️Подключение: ${site_config.connection_phone}.`;
  
  return {
    icons: {
      icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png`,
      shortcut: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png`,
      apple: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png`,
    },
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
