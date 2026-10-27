import { loadYMConfig } from '@/app/mods/YandexMetrika/YandexMetrika_config'
import { loadConfig, loadItemsConfig, loadPhoneList } from '@/app/utils/components-config'
import SupportLink from './supportLink'
import LkLink from './lkLink'
import ModalLink from './modalLink'
import TpButton from './tpButton'
import ConnectionButton from './connectionButton'
import { setActiveCity } from '@/app/utils/getCities'

async function Header({params_city}){
    const site_config = await loadConfig();
    const {phone_list} = await loadPhoneList();
    const {header_links, logo} = await loadItemsConfig();
    const {reachGoals} = await loadYMConfig()
    const activeCity = await setActiveCity(params_city);


    return(
        <header>
            <div className='headerTop'>
                <div className='headerTop-menuBlock'>
                    {/* Тут ричгол берем из конфига шапки */}
                    {
                        header_links.map((item, index) => (
                            item.active ? 
                            <ModalLink item={item} key={index}/> : ''
                        ))
                    }
                    
                    <TpButton />
                </div>
                <div className='headerTop-contactBlock'>
                    {/*
                    <span className='headerTop-contactBlock-tp_desctop'>Техническая поддержка</span>
                    <span className='headerTop-contactBlock-tp_mobile'>Тех. Поддержка</span>
                    <SupportLink
                        phone={site_config.support_phone}
                        reachGoals={reachGoals}
                        hideSupportPhone={site_config.hideSupportPhone}
                    />
                    */}

                    {/*<TpButton /> // КНОПКА ТП */}

                </div>
                <div className='headerTop-contactBlock'>
                    {
                    <LkLink
                        lk_link_on={site_config.lk_link}
                    />
                    }
                </div>
            </div>
            <div className='headerBottom'>
                <div className='headerBottom-leftSide'>
                    <a href={`/${activeCity.code}`}>
                        <img className='header-logo' 
                        alt={Number(site_config.show_city) ?
                                `Логотип ${site_config.genitive_provider_name} - интернет-провайдер в г.${activeCity.city}`
                                :
                                `Логотип ${site_config.genitive_provider_name}`
                            }
                        src={logo} 
                        />
                    </a>
                    <nav>
                        <a href="#allOffers">Услуги и предложения</a>
                        <a href="#infoSection">Преимущества</a>
                        <a href="#questions">Вопросы</a>
                    </nav>
                </div>
                
                <div className='headerBottom-rightSide'>
                    {/* Тут ричгол берем из конфига метрики */}

                    {Number(site_config.show_phone) ? <ConnectionButton site_config={site_config} phone_list={phone_list} reachGoals={reachGoals}/> : ''}
                </div>

            </div>
            </header>
    )
}
export default Header;