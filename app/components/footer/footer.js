
import Modals from './modals/modals'
import { loadConfig, loadItemsConfig } from '@/app/utils/components-config'
import { loadCities, setActiveCity } from '@/app/utils/getCities'
import CitiesButton from './citiesButton'
import ConnectionButton from './connectionButton'

async function Footer({params_city}){
    const site_config = await loadConfig();
    const { logo_small, main_icons } = await loadItemsConfig();
    const { cities_list, cities_list_original } = await loadCities();
    const activeCity = await setActiveCity(params_city)

    return(
        <footer>
            <div className="footer-container">
                <div className="footer-container-top">
                    <a href={`/${activeCity.code}`}>
                        <img className="footer-logo"
                            alt={Number(site_config.show_city) ?
                                `Логотип ${site_config.genitive_provider_name} - интернет-провайдер в г.${activeCity.city}`
                                :
                                `Логотип ${site_config.genitive_provider_name}`
                            } 
                            src={logo_small}
                        />
                    </a>
                    <nav>
                        <a href={`/${activeCity.code}#allOffers`}>Услуги и предложения</a>
                        <a href={`/${activeCity.code}#infoSection`}>Преимущества</a>
                        <a href={`/${activeCity.code}#questions`}>Вопросы</a>
                        {Number(site_config.blog_enabled) ? <a href="/blog">Блог</a> : null}
                        {!Number(site_config.show_city) ? <CitiesButton /> : ''}
                    </nav>
                    
                    <ConnectionButton /> {/* onClick={() => props.setDealModal({modalName: 'Оставьте заявку', showPhone: true, reachGoal: "zakazatPodkluchenie"})} */}
                </div>
                <div className="footer-container-bottom">
                    <p className="footer-text">{site_config.footer_text}</p>
                </div>
            </div>
            
            <Modals
                icons={main_icons}
                logo_small={logo_small}
                cities_list={cities_list} 
                cities_list_original={cities_list_original}
                connection_phone={site_config.connection_phone} 
                support_phone={site_config.support_phone}
                site_config={site_config} 
                activeCity={activeCity}
                params_city={params_city}
            />
        </footer>
    )
}
export default Footer;
