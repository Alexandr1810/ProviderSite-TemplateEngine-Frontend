'use client'

import React, { useState } from 'react';
import QuestionsItem from './questions_item';
import { useUtm } from '@/app/components/hooks/useUtm.js';
import { resolvePhone } from '@/app/utils/resolvePhone.js';

function QuestionsSection({ questions_items, phone_list, connection_phone }) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const { utm_source } = useUtm();

  const phone = resolvePhone(phone_list, utm_source, connection_phone);

  const withPhone = (text) => {
    if (!text || !connection_phone || phone === connection_phone) return text;
    return String(text).replaceAll(connection_phone, phone);
  };

  return (
    <section className="questionsSection" id='questions'>
        <h2 className="questionsSection-title">
          Частые вопросы
        </h2>
        <div className='questionsSection-container'>
          {questions_items.map((item, index) => (
            <QuestionsItem 
              key={index}
              index={index}
              question={withPhone(item.question)}
              answer={withPhone(item.answer)}
              activeQuestion={activeQuestion}
              setActiveQuestion={(id)=>setActiveQuestion(id)}
            />
          ))}
        </div>
    </section>
  );
}

export default QuestionsSection;
