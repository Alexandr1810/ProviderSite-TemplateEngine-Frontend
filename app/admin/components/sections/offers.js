import React, {useState, useEffect, useRef} from 'react'
import OfferRow from './offerRow'
import UploadOffers from './UploadOffers'
import axios from "axios";
import {server_config} from '@/app/utils/server_config'

function Offers(props) {
  const rowsRef = React.useRef({});

  const [cities_list, setCities_list] = useState([])
  const [additionals, setAdditionals] = useState([])
  const [allOffers_plans, setAllOffers_plans] = useState([])

  // --- Фильтры ---
  const [filterCity, setFilterCity] = useState("");   // "" = все города
  const [filterName, setFilterName] = useState("");   // "" = без фильтра по названию

  // --- Массовое удаление ---
  const [selectedIds, setSelectedIds] = useState([]); // id тарифов, отмеченных чекбоксом

  useEffect(()=>{
    setCities_list([...props.cities_list])
    setAdditionals([...props.additionals])
    setAllOffers_plans([...props.allOffers_plans.sort((a, b) => a.position - b.position)])
  },[props.cities_list, props.additionals, props.allOffers_plans])

  // При смене фильтра сбрасываем выбор чекбоксов, чтобы не удалить случайно
  // скрытый (невидимый под текущим фильтром) тариф.
  useEffect(() => {
    setSelectedIds([]);
  }, [filterCity, filterName]);

  // Список тарифов, которые реально показываются с учётом фильтров.
  // ВАЖНО: filteredOffers — это только *отображение*. Полный список
  // allOffers_plans остаётся источником правды и целиком уходит в saveOffers.
  const filteredOffers = allOffers_plans.filter((offer) => {
    const matchesCity =
      filterCity === "" || (offer.cities || []).includes(filterCity);

    const matchesName =
      filterName.trim() === "" ||
      (offer.name || "").toLowerCase().includes(filterName.trim().toLowerCase());

    return matchesCity && matchesName;
  });

  function resetFilters() {
    setFilterCity("");
    setFilterName("");
  }

  function getAdditionalById(id){
    console.log(id)
    console.log(props.additionals)
    return props.additionals.find((item) => item.id === id)
  }

  function delOffer(id){
    setAllOffers_plans(prev =>
      prev.filter(offer => offer.id !== id)
    )
    delete rowsRef.current[id];
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  }

  function addOffer(){
    setAllOffers_plans(prev =>{
      const maxId = prev.length
      ? Math.max(...prev.map(p => p.id))
      : -1;
      const maxPosition = prev.length
      ? Math.max(...prev.map(p => p.position))
      : -1;

      return [...prev, {
        id: maxId + 1,
        position: maxPosition+1,
        name: "",
        services: [],
        speed: 0,
        tv: 0,
        price: 0,
        sim_gb: 0,
        sim_min: 0,
        sim_sms: 0,
        discount_price: 0,
        discount_period: 0,
        discount_description: "",
        connection_price: 0,
        plan_additionals: [],
        cities: prev[prev.length-1] ? prev[prev.length-1].cities : [],
        bestOffer: 0,
        router_conditions: prev[prev.length-1] ? prev[prev.length-1].router_conditions : "",
        pristavka_conditions: prev[prev.length-1] ?  prev[prev.length-1].pristavka_conditions : "",
        needRouter: false,
        needPristavka: false
      }]}
    )
  }

  async function saveOffers() {
    const result = allOffers_plans.map(plan => {
      const getData = rowsRef.current[plan.id];

      const rowData = getData ? getData() : {};

      return {
        ...rowData,
        position: plan.position, // берём из родителя
        id: plan.id              // на всякий случай фиксируем id
      };
    });
    console.log(result);
    setAllOffers_plans(result);


    try{
        console.log(result)
        const isValid = props.validateRequiredFields(result, ['name', 'services', 'speed', 'tv', 'discount_price', 'discount_period', 'connection_price']);

        if (!isValid) {
            alert(`Не все поля заполнены!`)
            return;
        }
        await axios.post(`${server_config.api_protocol}://${server_config.site_folder}/back/update/offers/${server_config.site_key}`, {
            offers: result,
        },{
            withCredentials: true
        }).then((response) => {
            console.log(response)
            props.showAlert("successAlert")
        }).catch((error) => {
            console.error(error)
            props.showAlert("errorAlert")
        })
    }
    catch(error){
        console.error(error)
        props.showAlert("errorAlert")
    }
  }

  // ВАЖНО: направление "вверх/вниз" теперь считается по позиции тарифа
  // в ТЕКУЩЕМ отфильтрованном списке (filteredOffers), а не по всему массиву.
  // Сам position при этом остаётся общим — как и раньше, обмен значениями
  // position у двух тарифов отражается на сайте для всех городов.
  function setPosition(id, direction){
    const currentIndex = filteredOffers.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const swapIndex =
        direction === 0
            ? currentIndex - 1   // вверх
            : currentIndex + 1;  // вниз

    if (swapIndex < 0 || swapIndex >= filteredOffers.length) {
        return;
    }

    const currentItem = filteredOffers[currentIndex];
    const swapItem = filteredOffers[swapIndex];

    setAllOffers_plans((prev) => {
        const updated = prev.map((item) => {
            if (item.id === currentItem.id) {
                return { ...item, position: swapItem.position };
            }
            if (item.id === swapItem.id) {
                return { ...item, position: currentItem.position };
            }
            return item;
        });

        return [...updated].sort((a, b) => a.position - b.position);
    });
  }

  // --- Чекбоксы массового удаления ---

  function toggleSelect(id) {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  }

  const allVisibleSelected =
    filteredOffers.length > 0 &&
    filteredOffers.every(offer => selectedIds.includes(offer.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOffers.map(offer => offer.id));
    }
  }

  // Удаляет отмеченные тарифы. Как и одиночное удаление — это "мягкое"
  // удаление: тарифы пропадают из списка сразу, а на сервере обновятся
  // только после нажатия "Сохранить".
  function deleteSelected() {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Удалить ${selectedIds.length} тариф(ов)? Изменения будут сохранены на сервере только после нажатия "Сохранить".`
    );
    if (!confirmed) return;

    setAllOffers_plans(prev => prev.filter(offer => !selectedIds.includes(offer.id)));
    selectedIds.forEach(id => { delete rowsRef.current[id]; });
    setSelectedIds([]);
  }

  return (
    <section>
        <h2 className='sectionTitle'>Список тарифов</h2>
        <div className='sectionContent' id="offers">
              <h3>Фильтрация</h3>

          <div className='offers-filters f-row'>
            <label>
              <span className='label-title'>Город:</span>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              >
                <option value="">Все города</option>
                {cities_list.map((city) => (
                  <option value={city.city} key={city.id}>{city.city}</option>
                ))}
              </select>
            </label>

            <label>
              <span className='label-title'>Название тарифа:</span>
              <input
                type='text'
                placeholder='Поиск по названию'
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </label>
            
            <label>
              <span className='label-title' style={{color: '#f4f8fb'}}>2</span>
              {(filterCity !== "" || filterName !== "") && (
                <button type='button' className='resetFilters-Button' onClick={resetFilters}>
                  Сбросить фильтр
                </button>
              )}
            </label>
          </div>

          <div className='offers-data'>
              <h3>Тарифы</h3>

              {filteredOffers.length === 0 && (
                <p>Нет тарифов, подходящих под текущий фильтр.</p>
              )}

              {filteredOffers.map((item)=>(
                <OfferRow
                  key={item.id}
                  item={item}
                  setPosition={setPosition}
                  delOffer={delOffer}
                  getAdditionalById={getAdditionalById}
                  cities_list={cities_list}
                  additionals={additionals}
                  register={(id, getData) => {
                    rowsRef.current[id] = getData;
                  }}
                  isSelected={selectedIds.includes(item.id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
          </div>

          <div className='offers-bulk-actions f-row'>
            <label>
              <input
                type='checkbox'
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
              />
              <span>Выбрать все</span>
            </label>

            <button
              type='button'
              className='deleteSelected-Button'
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
            >
              Удалить ({selectedIds.length})
            </button>
          </div>

          <div className='cities-buttons'>
            <button className='addIcon-Button' onClick={addOffer}></button>
            <button type='button' className='saveIcon-Button' onClick={saveOffers}></button>
          </div>
        </div>
        <UploadOffers setAllOffers_plans={setAllOffers_plans} />

    </section>
  );
}


export default Offers;
