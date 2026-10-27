import { notFound } from 'next/navigation';

import { loadItemsConfig, loadConfig, loadPhoneList } from '@/app/utils/components-config'
import { loadYMConfig } from '@/app/mods/YandexMetrika/YandexMetrika_config.js'

import OfferSection from '@/app/components/pageOffer/offerPreview/offerSection'
import OfferDescription from '@/app/components/pageOffer/offerDescription/offerDescription'
import QuestionsSection from '@/app/components/pageMain/questions/questions'
import MapForm from '@/app/components/map_form/map_form.js'

import { pluralize } from '@/app/utils/functions'
import { setActiveCity } from '@/app/utils/getCities'

async function PageOffer({params_city, url_name}){
  const site_config = await loadConfig();
  const { phone_list } = await loadPhoneList();
  const {reachGoals} = await loadYMConfig();
  const activeCity = await setActiveCity(params_city);
  const {questions_items, OfferDescriptions_items, main_icons, logo_small, map_img} = await loadItemsConfig();
  
    return(
        <main>
            <OfferSection 
                /*activeOffer={item()}*/
                url_name={url_name}
                icons={main_icons}
                pluralize={pluralize}
                logo_small={logo_small}
                activeCity={activeCity}
                reachGoals={reachGoals}
                site_config={site_config}
            />
            <OfferDescription 
                /*activeOffer={item()}*/
                url_name={url_name}
                icons={main_icons}
                site_config={site_config}
                OfferDescriptions_items={OfferDescriptions_items}
            />
            <QuestionsSection
                questions_items={questions_items}
                phone_list={phone_list}
                connection_phone={site_config.connection_phone}
            />
            <MapForm
                map_img={map_img}
                activeCity={activeCity}
                site_config={site_config}
                reachGoals={reachGoals}
            />
        </main>
    )
}

export default PageOffer
