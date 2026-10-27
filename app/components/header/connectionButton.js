'use client';

import { useGlobalContext } from '@/app/utils/globalContext';

import { openModal } from '@/app/utils/functions'
import { useUtm  } from '@/app/components/hooks/useUtm.js';
import { resolvePhone } from '@/app/utils/resolvePhone.js';

export default function ConnectionButton({site_config, phone_list, reachGoals}) {

  const { setDealModal } = useGlobalContext();
  const { utm_source } = useUtm();

  const connection_phone = resolvePhone(phone_list, utm_source, site_config.connection_phone)
  console.log(phone_list)

  return (
    <a className="header-btn"
      onClick={()=>{
        if (window.ym) {
            console.log(2)
            console.log(reachGoals.ym_counter)
            console.log(reachGoals.phoneHead)
            window.ym(reachGoals.ym_counter, 'reachGoal', reachGoals.phoneHead); 
        }
      }} href={`tel:${connection_phone}`}
    >{connection_phone}</a> 
  );
}