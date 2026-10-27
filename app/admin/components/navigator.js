import React, {useState, useEffect} from 'react'
import { useScrollSpy } from './useScrollSpy'

function Navigator(props) {
  const sections = [
    { id: "general", label: "Основные настройки" },
    { id: "media", label: "Медиатека" },
    { id: "frontHeader", label: "Шапка сайта" },
    { id: "slider", label: "Главный слайдер" },
    { id: "banner", label: "Баннер преимуществ" },
    { id: "cities", label: "Список городов" },
    { id: "phoneList", label: "Номера по UTM" },
    { id: "offers", label: "Список тарифов" },
    { id: "offerPage", label: "Страница тарифа" },
    { id: "adventeges", label: "Преимущества" },
    { id: "faq", label: "Частые вопросы" },
    { id: "metrics", label: "Яндекс Метрика" },
    { id: "abbreviationsList", label: "Список Сокращений" },
  ]; //{ id: "metatags", label: "Метатеги" },

  const activeSection = useScrollSpy(sections, 300);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  };

  return (
    <div>
        <nav>
          <h3>Компоненты</h3>

          {sections.map((section) => (
            <a
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={activeSection === section.id ? "active" : ""}
            >
              {section.label}
            </a>
          ))}


          <p id="nav-autor">
            site by{" "}
            <a href="https://t.me/Redhaired_bestia" target="_blank">
              redhaired bestia
            </a>
          </p>
        </nav>
    </div>
  );
}


export default Navigator;