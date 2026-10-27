import React, {useState, useEffect} from 'react'
import axios from "axios";
import {server_config} from '@/app/utils/server_config'

function withIdsFromOne(list) {
  return list.map((item, index) => ({
    ...item,
    id: index + 1
  }))
}

function PhoneList(props) {
  const [phone_list, setPhone_list] = useState([])

  useEffect(()=>{
    setPhone_list(withIdsFromOne(Array.isArray(props.phone_list) ? props.phone_list : []))
  },[props.phone_list])

  function handleChange(e) {
    const { id, name, value } = e.target;
    setPhone_list(prev =>
      prev.map(item =>
        item.id === Number(id)
          ? {...item, [name]: value }
          : item
      )
    );
  }
  function delPhone(id){
    setPhone_list(prev =>
      withIdsFromOne(prev.filter(item => item.id !== id))
    )
  }
  function addPhone(){
    setPhone_list(prev =>
      withIdsFromOne([...prev, {
        source: '',
        phone: ''
      }])
    )
  }

  async function savePhones() {
    try{
      const phone_list_to_save = withIdsFromOne(phone_list)
      const isValid = props.validateRequiredFields(phone_list_to_save, [
        'phone'
      ]);
      if (!isValid) {
        alert(`Не все поля заполнены (номер)!`)
        return;
      }

      await axios.post(`${server_config.api_protocol}://${server_config.site_folder}/back/update/phone_list/${server_config.site_key}`, {
        phone_list: phone_list_to_save
      },{
        withCredentials: true
      }).then((response) => {
        console.log(response)
        setPhone_list(phone_list_to_save)
        props.setPhone_list(phone_list_to_save)
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

  return (
    <section>
        <h2 className='sectionTitle'>Номера по UTM</h2>
        <div className='sectionContent' id="phoneList">
          <div className='cities-data'>
              <h3>Список меток</h3>
              {phone_list.map((item)=>(
                <div className='cities-data-item' alt={item.id} key={item.id}>
                  <label><span className='label-title'>UTM-метка:</span>
                  <input type='text' id={item.id} name='source' placeholder='utm_1' value={item.source} onChange={handleChange} /></label>
                  <label><span className='label-title'>Номер:</span>
                  <input type='text' id={item.id} name='phone' placeholder='8 (800) 600-98-11' value={item.phone} onChange={handleChange} /></label>
                  <button className='delIcon-Button' onClick={()=>delPhone(item.id)}></button>
                </div>
              ))}
          </div>
          <div className='cities-buttons'>
            <button className='addIcon-Button' onClick={addPhone}></button>
            <button className='saveIcon-Button' onClick={savePhones}></button>
          </div>
        </div>
    </section>
  );
}


export default PhoneList;
