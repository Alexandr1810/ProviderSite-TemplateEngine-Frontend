'use client';

import { useGlobalContext } from '@/app/utils/globalContext';

import {openModal} from '@/app/utils/functions'

export default function ConnectionButton() {

  const { setDealModal } = useGlobalContext();


  return (
    <button className="footer-btn"
        onClick={() => {
            setDealModal({modalName: 'Оставьте заявку', showPhone: true, reachGoal: "zakazatPodkluchenie"})
            openModal('dealModal')
        }}
        
    >Подключить</button> 
  );
}

export function ArticleCta({ text, articleTitle }) {
  const { setDealModal } = useGlobalContext();
  const label = text?.trim() || 'Подключай домашний интернет у нас';

  function openDeal() {
    setDealModal({
      modalName: 'Оставить заявку',
      showPhone: true,
      reachGoal: 'zakazatPodkluchenie',
      formName: `Блог: ${articleTitle || 'статья'}`,
    });
    openModal('dealModal');
  }

  return (
    <aside className="blog-cta">
      <p>{label}</p>
      <button type="button" onClick={openDeal}>Оставить заявку</button>
    </aside>
  );
}