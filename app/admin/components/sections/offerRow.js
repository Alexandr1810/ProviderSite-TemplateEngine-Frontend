import React, {useState, useEffect} from 'react'

function OfferRow(props) {
  const { item, cities_list, additionals, register, isSelected, onToggleSelect } = props
  const [offer, setOffer] = useState({...item})

  useEffect(()=>{
    register(item.id, () => offer);
  }, [offer])
  

  function handleChange(e) {
    const { id, name, value, checked } = e.target;
    console.log(id, name, value, checked)
    setOffer(prev =>({
      ...prev,
      [name.replace('_checkbox', '')]:
        name.includes('checkbox') ? Number(checked) : value
    }));
  }

  function getAdditionalById(id){
    return props.additionals.find((item) => item.id === id)
  }
  function addCity(offer_id, e, field){
    const { value } = e.target;
    console.log(offer_id, value, field)
    setOffer(prev => (
        !offer[field].includes(value) ? {
            ...prev,
            [field]:
                [...offer[field], field === 'plan_additionals' ? Number(value) : value]
        } : offer
    ));
  }
  function delCity(offer_id, value, field) {
    console.log(offer_id, value, field)
    setOffer(prev => ({
      ...prev,
      [field]:
        offer[field].filter(val => val !== value)
    }));
  }

  return (
    <div className='slider-item' alt={offer.id} htmlFor={offer.position}>
        <div className='slider-item-select f-row'>
          <label className='select-offer-label f-row'>
            <input
              type='checkbox'
              checked={!!isSelected}
              onChange={() => onToggleSelect(offer.id)}
            />
            <span>Выбрать</span>
          </label>
        </div>

        <span className='label-title'><b>Основные параметры</b></span>
        <div className='top-side'>
          <label><span className='label-title'>Название тарифа:</span>
          <input type='text' id={offer.id} name='name' placeholder="Название" value={offer.name} onChange={handleChange} /></label>

          <label><span className='label-title'>Скорость интернета:</span>
          <input type='text' id={offer.id} name='speed' placeholder="Мбит/с" value={offer.speed} onChange={handleChange} /></label>

          <label><span className='label-title'>Кол-во каналов:</span>
          <input type='text' id={offer.id} name='tv' placeholder="Кол-во каналов" value={offer.tv} onChange={handleChange} /></label>

          <label><span className='label-title'>Гигабайт (сим):</span>
          <input type='text' id={offer.id} name='sim_gb' placeholder="Кол-во гигабайт" value={offer.sim_gb} onChange={handleChange} /></label>

          <label><span className='label-title'>Минут (сим):</span>
          <input type='text' id={offer.id} name='sim_min' placeholder="Кол-во минут" value={offer.sim_min} onChange={handleChange} /></label>

          <label><span className='label-title'>СМС (сим):</span>
          <input type='text' id={offer.id} name='sim_sms' placeholder="Кол-во смс" value={offer.sim_sms} onChange={handleChange} /></label>

          <label><span className='label-title'>Цена:</span>
          <input type='text' id={offer.id} name='price' placeholder="0" value={offer.price} onChange={handleChange} /></label>

          <label><span className='label-title'>Цена по скидке:</span>
          <input type='text' id={offer.id} name='discount_price' placeholder="0" value={offer.discount_price} onChange={handleChange} /></label>

          <label><span className='label-title'>Период акции:</span>
          <input type='text' id={offer.id} name='discount_period' placeholder="0" value={offer.discount_period} onChange={handleChange} /></label>

          <label><span className='label-title'>Описание акции:</span>
          <input type='text' id={offer.id} name='discount_description' placeholder="Описание" value={offer.discount_description} onChange={handleChange} /></label>

          <label><span className='label-title'>Стоимость подключения:</span>
          <input type='text' id={offer.id} name='connection_price' placeholder="0" value={offer.connection_price} onChange={handleChange} /></label>

          <label><span className='label-title'>WIFI Роутер:</span>
          <input type='text' id={offer.id} name='router_conditions' placeholder="Условия" value={offer.router_conditions} onChange={handleChange} /></label>

          <label><span className='label-title'>ТВ Приставка:</span>
          <input type='text' id={offer.id} name='pristavka_conditions' placeholder="Условия" value={offer.pristavka_conditions} onChange={handleChange} /></label>
        </div>
        <span className='label-title'><b>Дополнительный параметры</b></span>
        <div className='middle-side'>
            <div className='middle-side-item'>
            <span className='label-title'>Города:</span>
            <div className='cities-configurator f-row'>
                {offer.cities.map((city, index)=>(
                <button className='cities-configurator-item' id={index} key={index} onClick={()=>delCity(offer.id, city, 'cities')}>
                    {city}
                </button>
                ))
                }
                <select value="0" className='cities-configurator-addCity' onChange={(e)=>addCity(offer.id, e, 'cities')}>
                <option value="0">Добавить</option>
                {cities_list.map((city, index)=>(
                    <option value={city.city} key={index}>{city.city}</option>
                ))}
                </select>
            </div>
            </div>
            <div className='middle-side-item'>
            <span className='label-title'>Услуги:</span>
            <div className='cities-configurator f-row'>
                {offer.services.map((service, index)=>(
                <button className='cities-configurator-item' id={index} key={index} onClick={()=>delCity(offer.id, service, 'services')}>
                    {service}
                </button>
                ))
                }
                <select value="0" className='cities-configurator-addCity' onChange={(e)=>addCity(offer.id, e, 'services')}>
                <option value="0">Добавить</option>
                <option value="internet">Интернет</option>
                <option value="iptv">Цифровое ТВ</option>
                <option value="ktv">Кабельное ТВ</option>
                <option value="sim">Сим-карта</option>
                </select>
            </div>
            </div>
            <div className='middle-side-item'>
            <span className='label-title'>Дополнения:</span>
            <div className='cities-configurator f-row'>
                {offer.plan_additionals.map((additional, index)=>{
                  return (
                <button className='cities-configurator-item' id={index} key={index} onClick={()=>delCity(offer.id, additional, 'plan_additionals')}>
                    {
                    props.getAdditionalById(Number(additional)).name
                    }
                </button>
                )})
                }
                <select value="0" className='cities-configurator-addCity' onChange={(e)=>addCity(offer.id, e, 'plan_additionals')}>
                <option value="0">Добавить</option>
                {additionals.map((additional, index)=>(
                    <option value={additional.id} key={index}>{additional.name}</option>
                ))}
                </select>
            </div>
            </div>
            <div className='middle-side-item'>
            <span className='label-title'>Лучший тариф:</span>
            <div className='f-row'>
                <label className='radio-label'>
                <input type='radio' id={offer.id} name={`bestOffer_${offer.id}`} value="1" checked={Number(offer.bestOffer) === 1} onChange={()=>handleChange({target:{id: offer.id, name: "bestOffer", value: 1, checked: 1 }})} />
                <span>Да</span>
                </label>
                <label className='radio-label'>
                <input type='radio' id={offer.id} name={`bestOffer_${offer.id}`} value="0" checked={Number(offer.bestOffer) === 0} onChange={()=>handleChange({target:{id: offer.id, name: "bestOffer", value: 0, checked: 0 }})} />
                <span>Нет</span>
                </label>
            </div>
            </div>
        </div>
        
        <div className='bottom-side f-row'>
            <div className='left-side'>
                <button className='delIcon-Button' onClick={()=>props.delOffer(offer.id)}></button>
            </div>
            <div className='right-side'>
                <button className='top-Button' onClick={()=>props.setPosition(offer.id, 0)}></button>
                <button className='bottom-Button' onClick={()=>props.setPosition(offer.id, 1)}></button>
            </div>
        </div>
    </div>
  );
}


export default OfferRow;
