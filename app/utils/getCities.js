import axios from 'axios';
import { server_config } from '@/app/utils/server_config'
import { loadConfig } from '@/app/utils/components-config'
import { notFound } from 'next/navigation';


let activeCity = {}

let cities_list = [];
let cities_list_original = [];
let cities_list_shared = [];

export async function setActiveCity(detectedCity_code = null){
  console.log('detectedCity_code', detectedCity_code)
  await loadCities(detectedCity_code)
  
  return activeCity;
}

export function getActiveCity(){
  return activeCity;
}

export async function loadCities(detectedCity_code = null, isAdmin = false) {
  console.log('Загружаю города', detectedCity_code)
  const site_config = await loadConfig();
  
  const res = await fetch(`${server_config.api_protocol}://${server_config.site_folder}/front/getCities/${server_config.site_key}`, {
    ...(isAdmin
      ? { cache: 'no-store' }
      : { next: { revalidate: server_config.сaching_period } })
  });

  const data = await res.json();
  console.log(data)
  cities_list_original = data.data.cities_list
  cities_list_shared = data.data.cities_list_shared
  
  //Если нет в списке - отдаем
  console.log(cities_list_original)
  console.log(detectedCity_code)
  console.log('итог1:', cities_list_original.find(item => item.code === detectedCity_code))
  console.log('итог:', typeof cities_list_original.find(item => item.code === detectedCity_code) === 'undefined')
  if (!cities_list_original.find(item => item.code === detectedCity_code) && detectedCity_code !== null) {
    console.log('Прошел!!')
    notFound();
  }

  const detectedCity = detectedCity_code !== null 
  ? cities_list_original.find(item => item.code === detectedCity_code).city 
  : detectedCity_code
  
  if (Number(site_config.sortCity_regions)){
    cities_list = prepareCities_byRegion(cities_list_original, detectedCity)
  }else{
    //Если нет сортировки по регионам - просто закидываем все в массив
    cities_list_original.forEach(element => {
      console.log('cities_list', cities_list)
      try{
        cities_list.push(element.city)
      }catch(e){
        cities_list.cities_list.push(element.city)
      }
    });;
    cities_list = prepareCities_byLiters(cities_list, detectedCity)
  }
  return {cities_list, cities_list_original, cities_list_shared}
  
}
function prepareCities_byRegion(cities_list, detectedCity = null) {
    // 1. Группируем города по региону
    const grouped = cities_list.reduce((acc, {city, region}) => {
      if (!acc[region]) acc[region] = [];
      if (!acc[region].includes(city)) acc[region].push(city); // удаляем дубли
      return acc;
    }, {});

    // 2. Преобразуем объект в массив
    const result = [
      ...Object.entries(grouped).map(([liter, cities]) => ({ liter, cities }))
    ];

    
    // 3. Определяем город клиента
    const clientCity =
      result.find(group => group.cities.includes(detectedCity))?.cities.includes(detectedCity)
      ? detectedCity
      : result[0].cities[0];

    console.log('result', result)
    console.log(clientCity)


    activeCity = {
      city: clientCity,
      code: cities_list_original.find(item => item.city === clientCity).code,
      detected: false,
      selected: false,
      saved: false,
      url: false
    }
    console.log(activeCity)

    return { clientCity, cities_list: result };
}
function prepareCities_byLiters(cities_list, detectedCity = null) {
    // 1. Удаляем дубли
    const uniqueCities = [...new Set(cities_list)];

    // 2. Сортируем по алфавиту
    uniqueCities.sort((a, b) => a.localeCompare(b, 'ru'));

    // 3. Определяем город клиента
    const clientCity = uniqueCities.includes(detectedCity)
      ? detectedCity
      : uniqueCities[0];

    activeCity = {
      city: clientCity,
      code: cities_list_original.find(item => item.city === clientCity).code,
      detected: false,
      selected: false,
      saved: false,
      url: false  
    }

    // 4. Группируем по первой букве
    const groupsMap = new Map();

    uniqueCities.forEach(city => {
      const letter = city[0].toUpperCase();
      if (!groupsMap.has(letter)) {
        groupsMap.set(letter, []);
      }
      groupsMap.get(letter).push(city);
    });

    // 5. Преобразуем в массив формата liter → cities[]
    const cities_list_grouped = [...groupsMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], 'ru'))
      .map(([liter, cities]) => ({
        liter,
        cities
      }));

    return { clientCity, cities_list: cities_list_grouped };
}