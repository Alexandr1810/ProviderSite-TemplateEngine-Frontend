'use client'

import React, {useState, useEffect} from 'react'
import Header from '@/app/admin/components/header.js';

import Navigator from '@/app/admin/components/navigator.js'
import General from '@/app/admin/components/sections/general.js'
import FrontHeader from '@/app/admin/components/sections/frontHeader.js'
import Slider from '@/app/admin/components/sections/slider.js'
import Banner from '@/app/admin/components/sections/banner.js'
import Cities from '@/app/admin/components/sections/cities.js'
import PhoneList from '@/app/admin/components/sections/phoneList.js'
import Offers from '@/app/admin/components/sections/offers.js'
import OfferPage from '@/app/admin/components/sections/offerPage.js'
import Questions from '@/app/admin/components/sections/questions.js'
import Adventeges from '@/app/admin/components/sections/adventeges.js'
import YandexMetrika from '@/app/admin/components/sections/YandexMetrika.js'
import Metatags from '@/app/admin/components/sections/metatags.js'
import AbbreviationsList from '@/app/admin/components/sections/abbreviationsList.js'
import Mediateka from '@/app/admin/components/sections/mediateka.js'
import Alerts from '@/app/admin/components/alerts/alerts.js'
import ClearCacheButton from '@/app/admin/components/clearCacheButton.js'

function PageAdmin({
  logo,
  logo_small,

  site_config, 
  main_icons, 
  header_links, 
  slider_slides, 
  banner_items, 
  OfferDescriptions_items_undecoded,
  adventages_items_undecoded,
  questions_items_undecoded,
  metatags,

  allIcons, 
  allSliderImages, 
  additionalsImages,
  advantagesImages,

  reachGoals_original,
  
  cities_list_original,
  cities_list_shared,
  phone_list,
  allOffers_plans
}) {
  const [activeAlert, setActiveAlert] = useState('')

  const [logo_admin, setLogo_admin] = useState(``)
  const [logo_small_admin, setLogo_small_admin] = useState(``)

  const [allIcons_admin, setAllIcons_admin] = useState([])
  const [allSliderImages_admin, setAllSliderImages_admin] = useState([])
  const [additionalsImages_admin, setAdditionalsImages_admin] = useState([])
  const [advantagesImages_admin, setAdvantagesImages_admin] = useState([])

  const [site_config_admin, setSite_config_admin] = useState({})
  const [main_icons_admin, setMain_icons_admin] = useState({additionals:[]})
  const [cities_list_admin, setCities_list_admin] = useState([])
  const [phone_list_admin, setPhone_list_admin] = useState([])
  const [header_links_admin, setHeader_links_admin] = useState([])
  const [slider_slides_admin, setSlider_slides_admin] = useState([])
  const [banner_items_admin, setBanner_items_admin] = useState([])
  const [OfferDescriptions_items_undecoded_admin, setOfferDescriptions_items_undecoded_admin] = useState([])
  const [adventages_items_undecoded_admin, setAdventages_items_undecoded_admin] = useState([])
  const [questions_items_undecoded_admin, setQuestions_items_undecoded_admin]  = useState([])
  const [metatags_admin, setMetatags_admin] = useState({})
  
  useEffect(()=>{
    setLogo_admin(`${logo}`)
    setLogo_small_admin(`${logo_small}`)

    setAllIcons_admin([...allIcons])
    setAllSliderImages_admin([...allSliderImages])
    setAdditionalsImages_admin([...additionalsImages])
    setAdvantagesImages_admin([...advantagesImages])

    setSite_config_admin({...site_config})
    setMain_icons_admin({...main_icons})
    setCities_list_admin([...cities_list_original])
    setPhone_list_admin(Array.isArray(phone_list) ? [...phone_list] : [])
    setHeader_links_admin([...header_links])
    setSlider_slides_admin([...slider_slides])
    setBanner_items_admin([...banner_items])
    setOfferDescriptions_items_undecoded_admin([...OfferDescriptions_items_undecoded])
    setAdventages_items_undecoded_admin([...adventages_items_undecoded])
    setQuestions_items_undecoded_admin([...questions_items_undecoded])
    setMetatags_admin({...metatags})
  },[])

  function showAlert(alertName){
    setActiveAlert(alertName)
    setTimeout(()=>{
      setActiveAlert('')
    }, 5000)
  }
  function validateRequiredFields(data, requiredFields) {
    if (!Array.isArray(data)) return false;

    return data.every(item =>
      requiredFields.every(field => {
        const value = item[field];

        if (value === null || value === undefined) return false;

        if (typeof value === 'string') {
          return value.trim() !== '';
        }

        return true; // для number / boolean
      })
    );
  }
  
  console.log(cities_list_original)
  console.log(main_icons.additionals)
  return (
    <div className='adminPage'>
      <Header 
      logo_small={logo_small_admin} provider_name={site_config.provider_name} />
      <div className='main'>
        <Navigator />
        <div className='content'>
          <General 
            logo={logo_admin} 
            setLogo={setLogo_admin}
            logo_small={logo_small_admin} 
            setLogo_small={setLogo_small_admin}

            site_config={site_config_admin} 
            setSite_config={setSite_config_admin}
            main_icons={main_icons_admin} 
            setMain_icons={setMain_icons_admin}
            additionalsImages={additionalsImages_admin}
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <Mediateka 
            allIcons={allIcons_admin}  
            additionalsImages={additionalsImages_admin} 
            allSliderImages={allSliderImages_admin} 
            advantagesImages={advantagesImages_admin}

            setAllIcons={setAllIcons_admin}
            setAllSliderImages={setAllSliderImages_admin}
            setAdditionalsImages={setAdditionalsImages_admin}
            setAdvantagesImages={setAdvantagesImages_admin}

            showAlert={showAlert}
          />
          <FrontHeader 
            site_config={site_config} 
            header_links={header_links}

            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <Slider 
            slider_slides={slider_slides} 
            allIcons={allIcons_admin} 
            allSliderImages={allSliderImages_admin} 

            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <Banner 
            banner_items={banner_items} 
            allIcons={allIcons_admin} 
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <Cities 
            site_config={site_config_admin} 
            cities_list={cities_list_admin} 
            cities_list_shared = {cities_list_shared}
            setCities_list={setCities_list_admin}
            setSite_config={setSite_config_admin}
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <PhoneList
            phone_list={phone_list_admin}
            setPhone_list={setPhone_list_admin}

            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <Offers
            site_config={site_config_admin} 
            cities_list={cities_list_admin} 
            allOffers_plans={allOffers_plans} 
            additionals={main_icons_admin.additionals} 
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <OfferPage 
            OfferDescriptions_items={OfferDescriptions_items_undecoded}
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <Adventeges 
            advantagesImages={advantagesImages_admin}
            adventages_items={adventages_items_undecoded}
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <Questions 
            questions_items={questions_items_undecoded}
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          <YandexMetrika
            reachGoals={reachGoals_original}
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}
          />
          {/* 
          <Metatags 
            metatags = {metatags_admin}
            setMetatags = {setMetatags_admin}
            
            showAlert={showAlert}
            validateRequiredFields={validateRequiredFields}          
          />
          */}
          <AbbreviationsList 
            site_config={site_config_admin}
          />
          <Alerts 
            activeAlert={activeAlert}
          />
          <ClearCacheButton
          
          />
        </div>
      </div>
    </div>
  );
}


export default PageAdmin;