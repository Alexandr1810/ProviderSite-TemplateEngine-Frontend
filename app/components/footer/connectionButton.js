'use client';

import { useState } from 'react';
import { useGlobalContext } from '@/app/utils/globalContext';
import Form from '@/app/components/dealForm';
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

export function ArticleDealForm({ siteConfig, activeCity, reachGoals, articleTitle }) {
  return (
    <aside className="blog-article-form">
      <h2>Оставить заявку</h2>
      <Form
        site_config={siteConfig}
        formName={`Блог: ${articleTitle || 'статья'}`}
        reachGoals={reachGoals}
        formId="blogArticleForm"
        reachGoal="zakazatPodkluchenie"
        activeCity={activeCity?.city}
      />
    </aside>
  );
}

export function BlogFeedMore({ children, hiddenCount }) {
  const [open, setOpen] = useState(false);
  if (!hiddenCount) return children;
  return (
    <>
      {open ? children : null}
      {open ? null : (
        <button type="button" className="blog-more" onClick={() => setOpen(true)}>Ещё</button>
      )}
    </>
  );
}