'use client'

import React, {useState, useEffect, useId} from 'react'
import { openModal, closeModal } from '@/app/utils/functions'


function AllOffers_Item(props){
    console.log('icons', props.icons)
    const uid = useId()

    const [planStyles, setPlanStyles] = useState('allOffers-container-block')
    
    useEffect(() => {
        setPlanStyles(
        'allOffers-container-block' + (props.plan.services.includes('iptv') ? ' ultra' : '') +
            (props.plan.bestOffer ? ' best' : '')
        )
    }, [props.plan])
    return(
        <div className={planStyles}>
            <span className='allOffers-block-title'>{props.plan.name}</span>
            <div className='allOffers-container-inner'>
                <div className='properties'>
                    {props.plan.services.includes('internet') &&
                    <div className='properties-item'>
                        <img src={props.icons.inet_icon} /> 
                        <span className='properties-item-title'>до <b>{props.plan.speed}</b> Мбит/сек</span>
                        <span className='properties-item-text'>Стабильный сигнал в любое время</span>
                    </div>
                    }
                    {(!props.plan.services.includes('iptv') && !props.plan.services.includes('ktv')) &&
                    <div className='properties-item'>
                        <img src={props.icons.unlim_icon} /> 
                        <span className='properties-item-title'>Безлимит</span>
                        <span className='properties-item-text'>Доступ в интернет без ограничений</span>
                    </div> }
                    {props.plan.services.includes('iptv') &&
                    <div className='properties-item'>
                        <img src={props.icons.tv_icon} /> 
                        <span className='properties-item-title'>{props.plan.tv} телеканалов</span>
                        <span className='properties-item-text'>Cпорт, кино, путешествия, хобби. Найдется все!</span>
                    </div> }
                    {(props.plan.services.includes('ktv') && !props.plan.services.includes('iptv')) &&
                    <div className='properties-item'>
                        <img src={props.icons.tv_icon} /> 
                        <span className='properties-item-title'>{props.plan.tv} кабельных телеканалов</span>
                        <span className='properties-item-text'>Работает всегда, даже без интернета!</span>
                    </div> }
                    {(props.plan.services.includes('ktv') && !props.plan.services.includes('internet')) &&
                    <div className='properties-item'>
                        <img src={props.icons.feather_icon} /> 
                        <span className='properties-item-title'>Все просто</span>
                        <span className='properties-item-text'>Без сложных настроек: включил — и смотри</span>
                    </div> }
                </div>
                {(props.plan.discount_description && props.plan.discount_description !== '0') &&
                    <div className='saleBlock'>{props.plan.discount_description}</div>
                }
                <div className='elems'>
                {props.plan.services.includes('sim') &&
                    <div className='elem mobile'>
                        <div className={props.plan.needPristavka ? `left-side active` : `left-side`}>
                            <img src={props.icons.sim_card} />
                            <div className="mobile-container">
                                <span className='mobile-title'>Мобильная связь</span>
                                <span>
                                    {
                                        `${props.plan.sim_gb ? `${props.plan.sim_gb}гб` : ""}${props.plan.sim_min ? `/${props.plan.sim_min}мин` : ""}${props.plan.sim_sms ? `/${props.plan.sim_sms}смс` : ""}`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {props.plan.services.includes('internet') &&
                    <div className='elem'>
                        <div className={props.plan.needRouter ? `left-side active` : `left-side`}>
                            <img src={props.icons.router_icon} />
                            <span>WiFi<br />Роутер</span>
                            {(props.plan.router_conditions && props.plan.router_conditions !== '0') &&
                                <div className="elemInfo">
                                    <img src={props.icons.i_icon} />
                                    <span>{props.plan.router_conditions}</span>
                                </div>
                            }
                        </div>
                        <div className='right-side'>
                            <label className="checkbox-ios" htmlFor={`needRouter_${props.plan.id}_${uid}`}>
                                <input type="checkbox" aria-label="Нужен роутер" id={`needRouter_${props.plan.id}_${uid}`} checked={props.plan.needRouter} onChange={(event)=>props.toggleFieldById(props.plan.id, 'needRouter', event.target)}/>
                                <span className="checkbox-ios-switch"></span>
                            </label>
                        </div>
                    </div>
                }
                {props.plan.services.includes('iptv') &&
                    <div className='elem'>
                        <div className={props.plan.needPristavka ? `left-side active` : `left-side`}>
                            <img src={props.icons.pristavka_icon} />
                            <span>ТВ<br />Приставка</span>
                            {(props.plan.pristavka_conditions && props.plan.pristavka_conditions !== '0') &&
                                <div className="elemInfo">
                                    <img src={props.icons.i_icon} />
                                    <span>{props.plan.pristavka_conditions}</span>
                                </div>
                            }
                        </div>
                        <div className='right-side'>
                            <label className="checkbox-ios" htmlFor={`needPristavka_${props.plan.id}_${uid}`}>
                                <input type="checkbox" aria-label="Нужна приставка" id={`needPristavka_${props.plan.id}_${uid}`} checked={props.plan.needPristavka} onChange={(event)=>props.toggleFieldById(props.plan.id, 'needPristavka', event.target)}/>
                                <span className="checkbox-ios-switch" ></span>
                            </label>
                        </div>
                    </div>
                }
                </div>
                {props.plan.plan_additionals.length > 0 &&
                    <div className='elem-additionals'>
                        <span className='elem-additionals-preview'>Дополнительно к тарифу</span>
                        <div className='elem-additionals-container'>
                            {
                                props.plan.plan_additionals.map((additional_id, index)=>(
                                    <div className='elem-additionals-item' key={index}>
                                        <img src={props.icons.additionals.find(item => item.id === additional_id).img}/>
                                        <span>{props.icons.additionals.find(item => item.id === additional_id).name}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
                <div className='elem-price'>
                    <div className='elem-price-wrapper'>
                        <div className='left-side'> 
                            {
                            (props.plan.discount_price || props.plan.discount_period) ? props.plan.discount_price : props.plan.price
                            }₽/мес
                        </div>
                        {(props.plan.discount_period > 0)  && //скидка на время
                            <div className='right-side'>
                                <span className='elem-price-periodText'>
                                    {props.pluralize(props.plan.discount_period, 'первый', 'первые', 'первые')} {props.plan.discount_period !== 1 ? props.plan.discount_period : ''} {props.pluralize(props.plan.discount_period, 'месяц', 'месяца', 'месяцев')}
                                </span>
                                <span className='elem-price-outDiscount'>далее {props.plan.price}₽/мес</span>
                            </div>
                        }
                        {(props.plan.discount_period === 0 && props.plan.discount_price > 0)  && //скидка бессрочная
                            <div className='right-side'> 
                                <span className='elem-price-periodText'>
                                    бессрочно
                                </span>
                                <span className='elem-price-outDiscount'>
                                    вместо <span className='discount'>{props.plan.price}₽/мес</span>
                                </span>
                            </div>
                        }
                    </div>
                </div>
                {props.plan.connection_price !== 9999 &&
                <div className='elem-priceConnection'>
                    <span className='elem-priceConnection-preview'>Стоимость подключения <b>{props.plan.connection_price}</b> руб.</span>
                    <div className='elem-priceConnection-container'><b>Как проходит подключение?</b><br/>Наши специалисты обо всем позаботятся!<br/><br/> Назначим удобное время, договоримся с управляющей компанией, заведем кабель и настроим все необходимое оборудование. <br/><br/>Останется только подписать договор и можно сразу пользоваться услугами.</div>
                </div>
                }
            </div>
            {!props.modalItem &&
                <div className='allOffers-block-buttons'>
                    <button className='toFormButton' onClick={() => {
                        props.setActiveOffer(props.plan)
                        openModal('offerModal')
                    }}>Оставить заявку</button>
                    <a className='infoButton' 
                        onClick={() => {
                            props.setActiveOffer(props.plan)
                        }}
                        href={`/${props.activeCity.code}/offer/${props.plan.url_name}`} 
                        aria-label="Перейти к тарифу"
                    ><svg alt="Дополнительно о тарифе" xmlns="http://www.w3.org/2000/svg" role="img" width="32" height="32" className="sc-e7ab66e9-0 jaeEaw sc-12037ea7-0 esAZvG sc-b2685e77-0 hrepvk" id="info-circle-flip" viewBox="0 0 24 24"><g id="contour"><path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g><g id="guts"><path d="M12 16V11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.0055 8H11.9965" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                    </a>
                </div>
            }
        </div>
    )
}
export default AllOffers_Item;