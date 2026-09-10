
import PageAdmin from '@/app/admin/adminPage'

import {
  loadItemsConfig,
  loadMetatags,
  loadContext,
  loadConfig
} from '@/app/utils/components-config.js'

import {
  loadCities
} from '@/app/utils/getCities'

import {
  loadOffers
} from '@/app/utils/getOffers'

import { loadYMConfig } from '@/app/mods/YandexMetrika/YandexMetrika_config.js'

export default async function AdminPage() {
    
  const site_config = await loadConfig(true);
  
  const {
    allIcons,
    allSliderImages,
    advantagesImages,
    additionalsImages
  } = await loadContext(true);

  const {
    logo,
    logo_small, 

    header_links,
    slider_slides, 
    banner_items, 
    main_icons, 
    OfferDescriptions_items_undecoded,
    adventages_items_undecoded,
    questions_items_undecoded,
  } = await loadItemsConfig(true);

  const { metatags } = await loadMetatags(true);

  const { cities_list_original, cities_list_shared } = await loadCities(null, true);

  const { allOffers_plans } = await loadOffers(true);

  const { reachGoals_original } = await loadYMConfig(true);

  return (
    <div className="main">
      <PageAdmin 
        logo={logo}
        logo_small={logo_small}
      
        site_config={site_config} 
        main_icons={main_icons} 
        header_links={header_links} 
        slider_slides={slider_slides} 
        banner_items={banner_items} 
        OfferDescriptions_items_undecoded={OfferDescriptions_items_undecoded}
        adventages_items_undecoded={adventages_items_undecoded}
        questions_items_undecoded={questions_items_undecoded}

        metatags={metatags}

        allIcons={allIcons} 
        allSliderImages={allSliderImages} 
        additionalsImages={additionalsImages}
        advantagesImages={advantagesImages}

        reachGoals_original={reachGoals_original}

        cities_list_original={cities_list_original}
        cities_list_shared={cities_list_shared}
        allOffers_plans={allOffers_plans}
      />
    </div>
  );
}
