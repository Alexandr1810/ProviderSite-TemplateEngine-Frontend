import axios from "axios";
import {server_config} from '@/app/utils/server_config'
import React, {useState, useEffect, useRef} from 'react'


function General(props) {
    const [site_config, setSite_config] = useState({})
    const [additionals, setAdditionals] = useState([])
    const [favicon32, setFavicon32] = useState()
    const [favicon16, setFavicon16] = useState()
    const [OG_Image, setOG_Image] = useState()
    const [active_addImage_item, setActive_addImage_item] = useState(null)

    const fileInputRef_logo = useRef(null);
    const fileInputRef_logo_small = useRef(null);

    const fileInputRef_favicon32 = useRef(null);
    const fileInputRef_favicon16 = useRef(null);
    const fileInputRef_OG_Image = useRef(null);

    const fileInputRef_politika = useRef(null);
    const fileInputRef_sogl = useRef(null);
    const fileInputRef_robots = useRef(null);

    function setImage(slide_id, image_name, image_src){
        console.log(additionals[0].original_img)
        setAdditionals(prev =>
        prev.map(item =>
            item.id === Number(slide_id)
            ? {...item, original_img: image_name, img: image_src}
            : item
        )
        );
    }

    useEffect(()=>{
        setSite_config({...props.site_config})
        setAdditionals([...props.main_icons.additionals])
        setFavicon32(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png`)
        setFavicon16(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-16x16.png`)
        setOG_Image(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/img/OG_Image.png`)
    },[props.site_config, props.main_icons])


    function handleChange_additionals(e) {
        const { id, name, value, checked } = e.target;
        console.log(id, name, value, checked)
        console.log(additionals)
        setAdditionals(prev =>
            prev.map(item =>
                item.id === Number(id)
                ? {...item, [name.replace('_checkbox', '')]: name.includes('checkbox') ? Number(checked) : value }
                : item
            )
        );
    }
    function handleChange(e) {
        const { name, value, checked } = e.target;
        setSite_config(prev => ({
            ...prev,
            [name]: name.includes('checkbox') ? checked : String(value) //politicCheckbox
        }));
    }
    
    function delAdditional(id){
        setAdditionals(prev =>
        prev.filter(city => city.id !== id)
        )
    }
    function addAdditional(){
        
        setAdditionals(prev =>
        [...prev, {
            id: prev[prev.length-1] ? prev[prev.length-1].id+1 : 0,
            name: '',
            original_img: 'noneImage.png',
            img: props.additionalsImages.find(image => image.name == 'noneImage.png').src
        }]
        )
    }

    const handleClick = (section) => {
        switch(section) {
        case 'logo':
            fileInputRef_logo.current.click();
            break;
        case 'logo_small':
            fileInputRef_logo_small.current.click();
            break;
        case 'favicon32':
            fileInputRef_favicon32.current.click();
            break;
        case 'favicon16':
            fileInputRef_favicon16.current.click();
            break;
        case 'OG_Image':
            fileInputRef_OG_Image.current.click();
            break;
        case 'politika':
            fileInputRef_politika.current.click();
            break;
        case 'sogl':
            fileInputRef_sogl.current.click();
            break;
        case 'robots':
            fileInputRef_robots.current.click();
            break;
        }
    };

    const handleFileChange = async (e, name, path) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log(e, name, path)

        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", name);

        
        try {
            const res = await axios.post(`${server_config.api_protocol}://${server_config.site_folder}/upload/replace/${server_config.site_key}?file_path=${path}`, formData);
            
            console.log(res)
            switch(name) {
                case 'logo.webp':
                    props.setLogo(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/${res.data.filename}?v=${Date.now()}`);
                    break;
                case 'logo_small.svg':
                    props.setLogo_small(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/${res.data.filename}?v=${Date.now()}`,);
                    break;
                case 'favicon-32x32.png':
                    setFavicon32(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-32x32.png?v=${Date.now()}`)
                    break;
                case 'favicon-16x16.png':
                    setFavicon16(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/favicon/favicon-16x16.png?v=${Date.now()}`)
                    break;
                case 'OG_Image.png':
                    setOG_Image(`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/img/OG_Image.png?v=${Date.now()}`)
                    break;
            }
        
        } catch (err) {
        console.error("Upload error:", err);
        }
    };


    async function saveGeneral(){
        try{
            const emptyFields = Object.keys(site_config).filter(key => site_config[key] === "");
            const isValid = props.validateRequiredFields(additionals, ['name']);

            if (emptyFields.length || !isValid) {
                alert(`Не все поля заполнены!
${emptyFields}`)
                return;
            }
            await axios.post(`${server_config.api_protocol}://${server_config.site_folder}/back/update/site_config/${server_config.site_key}`, {
                site_config: site_config,
                additionals: additionals
            },{
                withCredentials: true
            }).then((response) => {
                console.log(response)
                props.showAlert("successAlert")
                props.setSite_config(site_config)
                props.setMain_icons({...props.main_icons, additionals: additionals})
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
  
    console.log('---- site_config ----')
    console.log(site_config)
  return (
    <section>
        <h2 className='sectionTitle'>Основные настройки</h2>
        <div className='sectionContent' id="general">
            <div className='left-side'>
                <div className='logo-editor'>
                    <h3>Логотип</h3>
                    <div className='logo-editor-item'>
                        <span>Лого для шапки (.webp):</span>
                        <div className='imgContainer' onClick={()=>handleClick("logo")}>
                            <img src={props.logo || null}/>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef_logo}
                            style={{ display: "none" }}
                            accept=".webp,image/webp"
                            name="logo.webp"
                            onChange={(e)=>handleFileChange(e, "logo.webp",`./uploads/${server_config.site_key}`)}
                        />
                    </div>
                    <div className='logo-editor-item'>
                        <span>Лого провайдера (.svg):</span>
                        <div className='imgContainer' onClick={()=>handleClick("logo_small")}>
                            <img src={props.logo_small || null} />  
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef_logo_small}
                            style={{ display: "none" }}
                            accept=".svg,image/svg+xml"
                            onChange={(e)=>handleFileChange(e, "logo_small.svg", `./uploads/${server_config.site_key}`)}
                        />
                    </div>
                    <div className='logo-editor-item'>
                        <span>Иконка 32х32 (.png):</span>
                        <div className='imgContainer' onClick={()=>handleClick("favicon32")}>
                            <img src={favicon32} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef_favicon32}
                            style={{ display: "none" }}
                            accept=".png,image/png"
                            onChange={(e)=>handleFileChange(e, "favicon-32x32.png",`./uploads/${server_config.site_key}/favicon`)}
                        />
                    </div>
                    <div className='logo-editor-item'>
                        <span>Иконка 16х16 (.png):</span>
                        <div className='imgContainer' onClick={()=>handleClick("favicon16")}>
                            <img src={favicon16} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef_favicon16}
                            style={{ display: "none" }}
                            accept=".png,image/png"
                            onChange={(e)=>handleFileChange(e, "favicon-16x16.png",`./uploads/${server_config.site_key}/favicon`)}
                        />
                    </div>
                </div>
                <div className='logo-editor'>
                    <h3>Файлы</h3>
                    <div className='logo-editor-item'>
                        <span>Политика конф-ти:</span>
                        <div className='imgContainer' onClick={()=>handleClick("politika")}>
                            <img src={`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/pdf.svg`}  />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef_politika}
                            style={{ display: "none" }}
                            accept=".pdf"
                            onChange={(e)=>handleFileChange(e, "politika.pdf",`./uploads/${server_config.site_key}/politics`)}
                        />
                    </div>
                    <div className='logo-editor-item'>
                        <span>Согласие на обработку перс..:</span>
                        <div className='imgContainer' onClick={()=>handleClick("sogl")}>
                            <img src={`${server_config.api_protocol}://${server_config.site_folder}/uploads/${server_config.site_key}/icons/pdf.svg`} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef_sogl}
                            style={{ display: "none" }}
                            accept=".pdf"
                            onChange={(e)=>handleFileChange(e, "sogl.pdf",`./uploads/${server_config.site_key}/politics`)}
                        />
                    </div>
                    <div className='logo-editor-item'>
                        <span>OG Image (.png):</span>
                        <div className='imgContainer' onClick={()=>handleClick("OG_Image")}>
                            <img src={OG_Image} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef_OG_Image}
                            style={{ display: "none" }}
                            accept=".png,image/png"
                            onChange={(e)=>handleFileChange(e, "OG_Image.png",`./uploads/${server_config.site_key}/img`)}
                        />
                    </div>
                </div>
                <div className='style-data'>
                    <h3>Стиль:</h3>
                    <label><span className='label-title hasDescription'>Основной цвет:
                        <div className='label-decription'>Контрастный темный цвет, на котором будет хорошо виден белый текст</div>
                    </span>
                        <div className='label-line'>
                            <div className="colorPreview" style={{background: site_config.primary_color}}></div><input type='text' name='primary_color' placeholder='#fe403c' value={site_config.primary_color || ''} onChange={handleChange} />
                        </div>
                    </label>
                    <label><span className='label-title hasDescription'>Дополнительный цвет:
                        <div className='label-decription'>Контрастный светлый цвет, на котором будет хорошо виден черный текст</div>
                    </span>
                        <div className='label-line'>
                            <div className="colorPreview" style={{background: site_config.secondary_color}}></div><input type='text' name='secondary_color' placeholder='#bbff00' value={site_config.secondary_color || ''} onChange={handleChange} />
                        </div>
                    </label>
                </div>
                <div className='additionals-data'>
                    <h3>Дополнения:</h3>
                    {additionals.map((item) => (
                        <div className="slider-item" key={item.id}>
                            <div className='left-side'>
                                <div className="slider-item-id">{item.id}</div>
                                <div className={item.id === active_addImage_item ? 'imgContainer sliderImage active': 'imgContainer sliderImage'} onClick={()=>{item.id === active_addImage_item ? setActive_addImage_item(null) : setActive_addImage_item(item.id)}}>
                                    <img src={item.img} />  
                                    <div className='allImagesContainer'>
                                        {props.additionalsImages.map((image, index) =>(
                                            <div className='imgContainer plus white' onClick={()=>setImage(item.id, image.name, image.src)} key={index}>
                                                <img key={image.name} alt={image.name} src={image.src} />  
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <label><span className='label-title'>Название:</span>
                                <input type='text' id={item.id} name='name' placeholder="START" value={item.name || ''} onChange={handleChange_additionals} /></label>
                                <button className='delIcon-Button' onClick={()=>delAdditional(item.id)}></button>
                            </div>
                        </div>
                        ))}
                        
                    <button className='addIcon-Button' onClick={addAdditional}></button>
                </div>
            </div>
            <div className='general-data'>
                <h3>Основные данные</h3>
                <label><span className='label-title'>Название провайдера:</span>
                <input type='text' name='provider_name' placeholder='Электронный город' value={site_config.provider_name || ''} onChange={handleChange} /></label>
                <label><span className='label-title'>Название провайдера (Родительный падеж):</span>
                <input type='text' name='genitive_provider_name' placeholder='Электронного города' value={site_config.genitive_provider_name || ''} onChange={handleChange} /></label>
                <label><span className='label-title'>Юридическое название провайдера:</span>
                <input type='text' name='company_name' placeholder='Новотелеком' value={site_config.company_name || ''} onChange={handleChange} /></label>
                <label><span className='label-title'>Владелец сайта:</span>
                <input type='text' name='siteOwner_name' placeholder='ИП Ерисов Михаил Иванович (ОГРНИП: 321246800032514)' value={site_config.siteOwner_name || ''} onChange={handleChange} /></label>
                <label>
                    <span className='label-title'>Скрывать имя провайдера в "Превью скорости"</span>
                    <div className="radioContainer">
                        <div className="radioItem">
                            <input type='radio' name='hideProviderName_onBanner' checked={site_config.hideProviderName_onBanner ? Number(site_config.hideProviderName_onBanner) : '0' } value="1" onChange={handleChange} />
                            <span className='label-title'>Да</span>
                        </div>
                        <div className="radioItem">
                            <input type='radio' name='hideProviderName_onBanner' checked={site_config.hideProviderName_onBanner ? !Number(site_config.hideProviderName_onBanner) : '0' } value="0" onChange={handleChange} />
                            <span className='label-title'>Нет</span>
                        </div>
                    </div>
                </label>
                <label>
                    <span className='label-title'>SEO индексация</span>
                    <div className="radioContainer">
                        <div className="radioItem">
                            <input type='radio' name='seo_indexing' checked={site_config.seo_indexing ? Number(site_config.seo_indexing) : '0' } value="1" onChange={handleChange} />
                            <span className='label-title'>Включена</span>
                        </div>
                        <div className="radioItem">
                            <input type='radio' name='seo_indexing' checked={site_config.seo_indexing ? !Number(site_config.seo_indexing) : '0' } value="0" onChange={handleChange} />
                            <span className='label-title'>Отключена</span>
                        </div>
                    </div>
                </label>
                <label>
                    <span className='label-title'>Адаптировать Мету под Юр'ов</span>
                    <div className="radioContainer">
                        <div className="radioItem">
                            <input type='radio' name='yr_typeOf_site' checked={site_config.yr_typeOf_site ? Number(site_config.yr_typeOf_site) : '0' } value="1" onChange={handleChange} />
                            <span className='label-title'>Да</span>
                        </div>
                        <div className="radioItem">
                            <input type='radio' name='yr_typeOf_site' checked={site_config.yr_typeOf_site ? !Number(site_config.yr_typeOf_site) : '0' } value="0" onChange={handleChange} />
                            <span className='label-title'>Нет</span>
                        </div>
                    </div>
                </label>
                <label>
                    <span className='label-title'>Показывать номер</span>
                    <div className="radioContainer">
                        <div className="radioItem">
                            <input type='radio' name='show_phone' checked={site_config.show_phone ? Number(site_config.show_phone) : '0' } value="1" onChange={handleChange} />
                            <span className='label-title'>Да</span>
                        </div>
                        <div className="radioItem">
                            <input type='radio' name='show_phone' checked={site_config.show_phone ? !Number(site_config.show_phone) : '0' } value="0" onChange={handleChange} />
                            <span className='label-title'>Нет</span>
                        </div>
                    </div>
                </label>
                <label>
                    <span className='label-title'>Отображение городов:</span>
                    <div className="radioContainer">
                        <div className="radioItem">
                            <input type='radio' name='show_city' checked={site_config.show_city ? Number(site_config.show_city) : '0' } value="1" onChange={handleChange} />
                            <span className='label-title'>Да</span>
                        </div>
                        <div className="radioItem">
                            <input type='radio' name='show_city' checked={site_config.show_city ? !Number(site_config.show_city) : '0' } value="0" onChange={handleChange} />
                            <span className='label-title'>Нет</span>
                        </div>
                    </div>
                </label>
                <label><span className='label-title'>Создавать сделки в стадии: (базовая)</span>
                <input type='text' name='base_stage' placeholder='NEW' value={site_config.base_stage || ''} onChange={handleChange} />
                </label>
                <label><span className='label-title hasDescription'>Ссылка на Личный кабинет провайдера:
                    <div className='label-decription'>Если поле заполено как "none" - ссылка на личный кабинет в шапке будет скрыта </div>
                </span>
                <input type='text' name='lk_link' placeholder='https://domain.ru/lk' value={site_config.lk_link || ''} onChange={handleChange} />
                </label>
                <label>
                    <span className='label-title hasDescription'>Показывать поле "Жилое/Не жилое"
                        <div className='label-decription'>При выборе клиентом типа помещения "Жилое" сделки будут содаваться в базовой стадии(поле выше), при выборе "Не жилое" - сделка будет создана в стадии Сделана(PREPAYMENT_INVOICE) </div>
                    </span>
                    <div className="radioContainer">
                        <div className="radioItem">
                            <input type='radio' name='show_type_of_house' checked={site_config.show_type_of_house ? Number(site_config.show_type_of_house) : '0' } value="1" onChange={handleChange} />
                            <span className='label-title'>Да</span>
                        </div>
                        <div className="radioItem">
                            <input type='radio' name='show_type_of_house' checked={site_config.show_type_of_house ? !Number(site_config.show_type_of_house) : '0' } value="0" onChange={handleChange} />
                            <span className='label-title'>Нет</span>
                        </div>
                    </div>
                </label>
                <label><span className='label-title'>Телефон (поддержка):</span>
                <input type='text' name='support_phone' placeholder='8 (800) 700-60-50' value={site_config.support_phone || ''} onChange={handleChange} />
                </label>
                <label><span className='label-title hasDescription'>Телефон основной/резервный (подключение):
                    <div className='label-decription'>Если заполнен раздел "Номера по UTM" - будут использоваться номера из того списка. Этот номер будет использоваться в случаях когда: 
                        <br /> 
                        •  Раздел "Номера по UTM" не заполнен
                        <br /> 
                        •  utm_source не передан
                        <br /> 
                        •  utm_source передан, но не найден в списке раздела "Номера по UTM"
                        </div>
                </span>
                <input type='text' name='connection_phone' placeholder='8 (800) 400-30-20' value={site_config.connection_phone || ''} onChange={handleChange} /></label>
                <label>
                <span className='label-title hasDescription'>Текст в подвале сайта: 
                <div className='label-decription'>В этом блоке вы можете использовать ссылки из списка сокращений что бы вставить заранее прописанное значение или функцию.</div>
                </span>
                <textarea type='text' name='footer_text_undecoded' placeholder='Введите текст...' value={site_config.footer_text_undecoded || ''} onChange={handleChange} /></label>
                <label><span className='label-title'>Ссылка на телеграм канал:</span>
                <input type='text' name='telegram_link' placeholder='https://t.me/...' value={site_config.telegram_link || ''} onChange={handleChange} /></label>
                <label><span className='label-title hasDescription'>Текст приглашения в телеграм канал:
                    <div className='label-decription'>В этом блоке вы можете использовать ссылки из списка сокращений что бы вставить заранее прописанное значение или функцию. <br /> В этом блоке так же доступны html теги, например '<code>&lt;br /&gt;</code>' для переноса строки</div>
                </span>
                <textarea type='text' name='telegramText_undecoded' placeholder='Введите текст...' value={site_config.telegramText_undecoded || ''} onChange={handleChange} /></label>
            </div>
            <div className='save-block'>
                <button type='button' onClick={saveGeneral}>Сохранить</button>
            </div>
        </div>
        
    </section>
  );
}


export default General;