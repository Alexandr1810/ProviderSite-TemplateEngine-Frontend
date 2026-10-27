
import axios from 'axios';
import { server_config } from './server_config.js'

//Здесь вся основная инфа - имя сайта, номера и все остальное (см в бд)
//Сохраняем локально для того, что бы keysDictionary имел доступ к конфигу
export let site_config_local = null

export async function loadConfig(isAdmin = false) {
  console.log('Загружаю основной конфиг')
  let site_config;

  const res = await fetch(`${server_config.api_protocol}://${server_config.site_folder}/front/getSiteConfig/${server_config.site_key}`, {
    ...(isAdmin
      ? { cache: 'no-store' }
      : { next: { revalidate: 0 } }) //3600
  });
  const data = await res.json();
  console.log(data)

  site_config = data.data
  site_config_local = site_config
  
  site_config.footer_text = keysDictionary(site_config.footer_text_undecoded)
  site_config.telegramText = keysDictionary(site_config.telegramText_undecoded)


  return site_config;
}

export async function loadContext(isAdmin = false){
  console.log('Загружаю контекст картинок')
  
  let allIcons = null
  let allIconsCss = `:root {`
  let allSliderImages = null
  let advantagesImages = null
  let additionalsImages = null

  const allIcons_res = await fetch(
    `${server_config.api_protocol}://${server_config.site_folder}/uploads/list/${server_config.site_key}/icons`, {
      ...(isAdmin
        ? { cache: 'no-store' }
        : { next: { revalidate: server_config.сaching_period } })
    });
  
  const allIcons_data = await allIcons_res.json();
  console.log(allIcons_data)

  allIcons = allIcons_data.files.map(file => ({
    name: file,
    src: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/${file}`
  }));
  console.log(allIcons)

  allIcons.forEach((icon) => {
    const varName = `--${icon.name.replace(/\.[^/.]+$/, "")}`; // удаляем расширение
    const url = `url(${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/${icon.name})`;
    //document.documentElement.style.setProperty(varName, url);
    allIconsCss += `
    ${varName}: ${url};
    `
  });
  allIconsCss += `}`

  const allSliderImages_res = await fetch(
    `${server_config.api_protocol}://${server_config.site_folder}/uploads/list/${server_config.site_key}/slider`, {
      ...(isAdmin
        ? { cache: 'no-store' }
        : { next: { revalidate: server_config.сaching_period } })
    });
  
  const allSliderImages_data = await allSliderImages_res.json();
  console.log(allSliderImages_data)

  allSliderImages = allSliderImages_data.files.map(file => ({
    name: file,
    src: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/slider/${file}`
  }));
  console.log(allSliderImages)

  const advantagesImages_res = await fetch(
    `${server_config.api_protocol}://${server_config.site_folder}/uploads/list/${server_config.site_key}/advantages`, {
      ...(isAdmin
        ? { cache: 'no-store' }
        : { next: { revalidate: server_config.сaching_period } })
    });
  
  const advantagesImages_data = await advantagesImages_res.json();
  console.log(advantagesImages_data)

  advantagesImages = advantagesImages_data.files.map(file => ({
    name: file,
    src: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/advantages/${file}`
  }));

  const additionalsImages_res = await fetch(
    `${server_config.api_protocol}://${server_config.site_folder}/uploads/list/${server_config.site_key}/additionals`, {
      ...(isAdmin
        ? { cache: 'no-store' }
        : { next: { revalidate: server_config.сaching_period } })
    });
  
  const additionalsImages_data = await additionalsImages_res.json();
  console.log(additionalsImages_data)

  additionalsImages = additionalsImages_data.files.map(file => ({
    name: file,
    src: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/additionals/${file}`
  }));
  console.log(additionalsImages)

  return {
    allIcons,
    allIconsCss,
    allSliderImages,
    advantagesImages,
    additionalsImages
  }
} 

export async function loadItemsConfig(isAdmin = false) {
  console.log('Загружаю конфиг элементов сайта')

  // -- Лого в двух форматах и карта для формы внизу -- //
  let logo = null
  let logo_small = null
  let map_img = null

  // -- Отдаем все юзаемые иконки сайта + иконки кинотеатров(доп.услуг) -- //
  let main_icons = null

  // --- Формы в шапке --- //
  let header_links = null;

  // --- Главный слайдер на первой странице --- //
  let slider_slides = null;

  // --- Баннер на главной странице --- //
  let banner_items = null;

  // --- Блок преимуществ --- //
  let adventages_items_undecoded = null;
  let adventages_items = null;

  // --- Блок вопросов --- //
  let questions_items_undecoded = null;
  let questions_items = null;

  // --- Блок Дополнительной информации в тарифе --- //
  let OfferDescriptions_items_undecoded = null;
  let OfferDescriptions_items = null;

  console.log('конфиг', server_config)

  const res = await fetch(`${server_config.api_protocol}://${server_config.site_folder}/front/getItemsConfig/${server_config.site_key}`, {
    ...(isAdmin
      ? { cache: 'no-store' }
      : { next: { revalidate: server_config.сaching_period } })
  });
  const data = await res.json();
  console.log(data)


  logo = `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/logo.webp`
  logo_small = `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/logo_small.svg`
  map_img = `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/other/map.webp`
  //document.documentElement.style.setProperty('--map', `url(${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/other/map.png)`);

  main_icons = {
    inet_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/inet-icon.svg`,
    tv_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/tv-icon.svg`,
    sales_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/sales-icon.svg`,
    unlim_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/unlim.svg`,
    router_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/router.svg`,
    pristavka_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/pristavka.svg`,
    sim_card: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/sim_card.svg`,
    phone: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/phone.svg`,
    i_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/i-icon.svg`,
    feather_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/feather.svg`,
    close_icon: `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/close.svg`,
    // Иконки для дополнительных услуг
    additionals: []
  }

  
  // --- Формы в шапке --- //
  header_links = data.data.header_links;
  
  console.log(header_links)

  // --- Главный слайдер на первой странице --- //
  slider_slides = data.data.slider_slides;
  slider_slides.forEach((slide) => {
    slide.image = `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/slider/${slide.original_image}`;
    slide.icons = slide.original_icons.map(icon => `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/${icon}.svg`
    );
  })

  // --- Баннер на главной странице --//
  banner_items = JSON.parse(keysDictionary(JSON.stringify(data.data.banner_items)));
  banner_items.forEach((item) => {
    item.icon = `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/${item.original_icon}.svg`
  })

  // --- Блок преимуществ --- //
  adventages_items_undecoded = data.data.advantages_items
  adventages_items = JSON.parse(keysDictionary(JSON.stringify(data.data.advantages_items)));
  adventages_items.forEach((item) => {
    item.image = `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/advantages/${item.original_image}`
  })

  // --- Блок вопросов --- //
  questions_items_undecoded = data.data.questions_items
  questions_items = JSON.parse(keysDictionary(JSON.stringify(data.data.questions_items)));
  
  // --- Блок Дополнительной информации в тарифе --- //
  OfferDescriptions_items_undecoded = data.data.OfferDescriptions_items
  OfferDescriptions_items = JSON.parse(keysDictionary(JSON.stringify(data.data.OfferDescriptions_items)));

  main_icons.additionals = data.data.additionals
  main_icons.additionals.forEach((item) => {
    item.img = `${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/additionals/${item.original_img}`
  })

  return{
    logo,
    logo_small,
    map_img,

    header_links,
    slider_slides,
    banner_items,
    adventages_items,
    adventages_items_undecoded,
    questions_items,
    questions_items_undecoded,
    OfferDescriptions_items,
    OfferDescriptions_items_undecoded,
    main_icons,
  }

}

export async function loadMetatags(isAdmin = false) {
  console.log("Загружаю когнфиг метатегов")
  
  let metatags = null;

  const metatags_res = await fetch(
    `${server_config.api_protocol}://${server_config.site_folder}/front/getMetaConfig/${server_config.site_key}`, {
    ...(isAdmin
      ? { cache: 'no-store' }
      : { next: { revalidate: server_config.сaching_period } })
  });
  const metatags_data = await metatags_res.json();
  console.log(metatags_data)
  metatags = metatags_data.data[0]

  return {
    metatags
  }
}

export async function loadPhoneList(isAdmin = false) {
  console.log("Загружаю когнфиг номеров")
  
  let phone_list = null;

  const phone_list_res = await fetch(
    `${server_config.api_protocol}://${server_config.site_folder}/front/getPhoneList/${server_config.site_key}`, {
    ...(isAdmin
      ? { cache: 'no-store' }
      : { next: { revalidate: server_config.сaching_period } })
  });
  const phone_list_data = await phone_list_res.json();
  phone_list = phone_list_data.data

  return {
    phone_list
  }
}


//Заменяем понятные сокращения и ссылки на данные из конфига
function keysDictionary(str) {
  if (site_config_local === null) return str;
  const keys = [{
    key: 'domatelecom_link',
    value: `<a target="_blank" href="${site_config_local.telegram_link}">ДомаТелеком</a>`
  },
  {
    key: 'genitive_provider_name',
    value: `${site_config_local.genitive_provider_name}`
  },
  {
    key: 'connection_phone',
    value: `${site_config_local.connection_phone}`
  },
  {
    key: 'support_phone',
    value: `${site_config_local.support_phone}`
  },
  {
    key: 'provider_name',
    value: `${site_config_local.provider_name}` 
  },
  {
    key: 'company_name',
    value: `${site_config_local.company_name}`
  },
  {
    key: 'siteOwner_name',
    value: `${site_config_local.siteOwner_name}`
  },
  {
    key: 'site_domain',
    value: `${server_config.site_folder}`
  },
  ]
  for (let index = 0; index < keys.length; index++) {
    const element = keys[index];
    str = str.replaceAll(`{${element.key}}`, element.value);
  }
  return str;
}


