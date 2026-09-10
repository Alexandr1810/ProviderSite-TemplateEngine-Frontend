import React, {useState, useEffect} from 'react'
import axios from "axios";
import {server_config} from '@/app/utils/server_config'

function Cities(props) {
  const [cities_list, setCities_list] = useState([])
  const [sortCity_regions, setSortCity_regions] = useState('0')
  useEffect(()=>{
    setCities_list([...props.cities_list])
    setSortCity_regions(props.site_config.sortCity_regions)
  },[props.cities_list, props.site_config])

  function handleChange(e) {
    const { id, name, value, checked } = e.target;
    setCities_list(prev =>
      prev.map(item =>
        item.id === Number(id)
          ? {...item, [name.replace('_checkbox', '')]: name.includes('checkbox') ? Number(checked) : value }
          : item
      )
    );
  }
  function delCity(id){
    setCities_list(prev =>
      prev.filter(city => city.id !== id)
    )
  }
  function addCity(){
    setCities_list(prev =>
      [...prev, {
        id: prev[prev.length-1] ? prev[prev.length-1].id+1 : 0,
        city: '',
        region: ''
      }]
    )
  }
  
  function addCityFromShared(id){
    console.log(id)
    console.log(props.cities_list_shared)
    const cities_list_shared_item = props.cities_list_shared.find((city_shared) => city_shared.id === Number(id))
    console.log(cities_list_shared_item)
    
    setCities_list(prev =>
      [...prev, {
        ...cities_list_shared_item,
        id: prev[prev.length-1] ? prev[prev.length-1].id+1 : 0,
        id_shared: cities_list_shared_item.id,
      }]
    )
  }

  async function saveCities() {
    try{
      const isValid = props.validateRequiredFields(cities_list, [
        'city',
        'region'
      ]);
      if (!isValid) {
        //alert(`Не все поля заполнены!`)
        //return;
      }
      await axios.post(`${server_config.api_protocol}://${server_config.site_folder}/back/update/site_config/${server_config.site_key}`, {
        site_config: {
          sortCity_regions: String(sortCity_regions)
        }
      },{
        withCredentials: true
      }).then((response) => {
        console.log(response)
        //props.setSite_config(site_config)
      }).catch((error) => {
        console.error(error)
        props.showAlert("errorAlert")
      })

      await axios.post(`${server_config.api_protocol}://${server_config.site_folder}/back/update/cities_list/${server_config.site_key}`, {
        cities_list: cities_list
      },{
        withCredentials: true
      }).then((response) => {
        console.log(response)
        props.setCities_list(cities_list)
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
  console.log(props.cities_list)
  console.log(cities_list)
  return (
    <section>
        <h2 className='sectionTitle'>Список городов</h2>
        <div className='sectionContent' id="cities">
            <div className='cities-settings'>
              <h3>Сортировка</h3>
              <label className='radio-label'>
                  <input type='radio' name='sortCity_regions' disabled checked={Number(sortCity_regions) === 0} onChange={()=>setSortCity_regions("0")} />
                  <span className='label-title'>По алфавиту</span>
              </label>
              <label className='radio-label'>
                  <input type='radio' name='sortCity_regions' disabled checked={Number(sortCity_regions) === 1} onChange={()=>setSortCity_regions("1")} />
                  <span className='label-title'>По регионам</span>
              </label>
            </div>
          <div className='cities-data'>
              <h3>Города</h3>
              {cities_list.map((item)=>(
                <div className='cities-data-item' alt={item.id} key={item.id}>
                  <label><span className='label-title'>Город:</span>
                  <input type='text' id={item.id} name='city' placeholder='Город' value={item.city} onChange={handleChange} /></label>
                  <label><span className='label-title'>Регион:</span>
                  <input type='text' id={item.id} name='region' disabled={!Number(sortCity_regions)} placeholder='Регион/область' value={item.region} onChange={handleChange} /></label>
                  <button className='delIcon-Button' onClick={()=>delCity(item.id)}></button>
                </div>
              ))}

          </div>
          <div className='cities-buttons'>
            <select
                value="0"
                onChange={(e) => addCityFromShared(e.target.value)}
              >
                <option value="0">Все города</option>
                {props.cities_list_shared.map((city) => (
                  <option value={city.id} key={city.id}>{city.city} - {city.region}</option>
                ))}
              </select>
            {/*<button className='addIcon-Button' onClick={addCity}></button>*/}
            <button className='saveIcon-Button' onClick={saveCities}></button>
          </div>
        </div>
        
    </section>
  );
}


export default Cities;