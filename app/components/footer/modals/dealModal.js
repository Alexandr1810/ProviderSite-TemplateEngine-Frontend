'use client'

import React, {useState} from 'react'
import Form from '@/app/components/dealForm'

import { useGlobalContext } from '@/app/utils/globalContext';
import {closeModal} from '@/app/utils/functions'


export default function DealModal({icons, logo_small, activeCity, connection_phone, reachGoals, site_config }){ 
    const { dealModal } = useGlobalContext()

    return(
        <div className='modal' id="dealModal">
            <div className='modal-background modal-fade' onClick={()=>closeModal('dealModal')} ></div>
            <div className='modal-content modal-fade'>
                <div className='modal-header'>
                    <span className='modal-header-title'></span>
                    <img className='modal-header-close' onClick={()=>closeModal('dealModal')} src={icons.close_icon} />
                </div>
                <div className='modal-body'>
                    <div className='dealModal-infoBlock'>
                        <img src={logo_small} />
                        <span>Подключиться прямо сейчас: <br />быстро и удобно!</span>
                    </div>
                    {(dealModal.showPhone && Number(site_config.show_phone)) ? 
                        <div className='dealModal-phoneBlock'>
                            <span className='dealModal-phoneBlock-title'>Позвоните нам по номеру <a onClick={()=>{
                                console.log(1)
                                if (window.ym) {
                                    console.log(2)
                                    console.log(reachGoals.ym_counter)
                                    console.log(reachGoals.phoneHead)
                                    window.ym(reachGoals.ym_counter, 'reachGoal', reachGoals.phoneHead); 
                                }
                            }} href={`tel:${connection_phone}`}><b>{connection_phone}</b></a></span>
                            <span className='dealModal-phoneBlock-or'>или</span>
                        </div> : ''
                    }
                    <div className='dealModal-formBlock'>
                        <span className='dealModal-formBlock-title'>{dealModal.modalName}</span>
                        <Form site_config={site_config} formName={dealModal.formName || `${dealModal.modalName} (Модальное окно)`} reachGoals={reachGoals} formId="modalForm" reachGoal={dealModal.reachGoal} activeCity={activeCity} />
                    </div>
                </div>
            </div>
        </div>
    )
}
