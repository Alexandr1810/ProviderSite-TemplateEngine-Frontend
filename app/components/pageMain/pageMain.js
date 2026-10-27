import Slider from '@/app/components/pageMain/slider/slider'

//Компоненты
import Best_Offers from '@/app/components/pageMain/best_offers/bestOffers.js'
import AllOffers from '@/app/components/pageMain/all_offers/allOffers.js'
import Banner from '@/app/components/pageMain/banner/banner.js'
import SpeedPreview from '@/app/components/pageMain/banner/speedPreview.js'
import InfoSection from '@/app/components/pageMain/info_section/infoSection.js'
import MapForm from '@/app/components/map_form/map_form.js'

import QuestionsSection from '@/app/components/pageMain/questions/questions.js'
//Конфиги
import { loadItemsConfig, loadConfig, loadPhoneList } from '@/app/utils/components-config'
import { loadYMConfig } from '@/app/mods/YandexMetrika/YandexMetrika_config.js'

//Функции
import { setActiveCity } from '@/app/utils/getCities'
import { loadOffers } from '@/app/utils/getOffers'
import { openModal } from '@/app/utils/functions'
import { pluralize } from '@/app/utils/functions'


async function PageMain({params_city}){
  const site_config = await loadConfig();
  const { phone_list } = await loadPhoneList();
  const {slider_slides, banner_items, adventages_items, questions_items, main_icons, logo_small, map_img} = await loadItemsConfig();
  const {reachGoals} = await loadYMConfig();
  const activeCity = await setActiveCity(params_city);
  
  return(
    <main>
        <Slider 
            slider_slides={slider_slides} 
            site_config = {site_config}
            activeCity={activeCity}
            reachGoals={reachGoals}
        />
        <Best_Offers 
            activeCity={activeCity}
            main_icons={main_icons}
            site_config={site_config}
        />
        <AllOffers 
            logo_small={logo_small}
            icons={main_icons} 
            activeCity={activeCity} 
            openModal={openModal} 
            pluralize={pluralize}
        />
        <Banner  banner_items={banner_items} />
        <SpeedPreview 
          site_config={site_config}
          logo_small={logo_small}
          activeCity={activeCity}
        />
        <InfoSection 
          site_config={site_config}
          activeCity={activeCity}
          adventages_items={adventages_items}
        />
        <QuestionsSection 
          questions_items={questions_items}
          phone_list={phone_list}
          connection_phone={site_config.connection_phone}
        />
        <MapForm 
          site_config={site_config}
          activeCity={activeCity}
          map_img={map_img}
          reachGoals={reachGoals}
        />
    </main>
  )
}
export default PageMain;