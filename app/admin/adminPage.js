'use client'

import React, {useState, useEffect, useRef} from 'react'
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
import axios from 'axios';
import { server_config } from '@/app/utils/server_config';
import { blogSlug } from '@/app/utils/blogSlug';
import { blogImageUrl, blogPlaceholderUrl } from '@/app/utils/blogView';
import { revalidateBlog } from '@/app/actions/revalidate';

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

const origin = `${server_config.api_protocol}://${server_config.site_folder}`;
const BLOCKS = [
  ['h2', 'Подзаголовок H2'],
  ['h3', 'Малый заголовок H3'],
  ['p', 'Абзац'],
  ['ul', 'Список'],
  ['ol', 'Нумерация'],
  ['quote', 'Цитата'],
  ['image', 'Картинка'],
  ['table', 'Таблица'],
  ['html', 'HTML'],
];

function blockOf(type) {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if (type === 'table') return { id, type, headers: ['', ''], rows: [['', ''], ['', '']] };
  if (type === 'image') return { id, type, file: '', alt: '' };
  if (type === 'html') return { id, type, html: '' };
  return { id, type, text: '' };
}

function blocksWithIds(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) return [blockOf('p')];
  return blocks.map((block) => {
    const base = blockOf(block.type || 'p');
    return { ...base, ...block, id: block.id || base.id };
  });
}

function emptyArticle(sectionId) {
  return {
    id: null,
    section_id: sectionId || '',
    title: '',
    slug: '',
    slugLocked: false,
    excerpt: '',
    read_time: '',
    cta_text: 'Подключай домашний интернет у нас',
    cover: '',
    published: 0,
    content: [blockOf('p')],
  };
}

export function BlogAdmin({ initial }) {
  const [enabled, setEnabled] = useState(Boolean(initial?.enabled));
  const [sections, setSections] = useState(() => (initial?.sections || []).map((section) => ({
    ...section,
    localId: `s-${section.id}`,
    slugLocked: true,
    visible: Number(section.visible) ? 1 : 0,
  })));
  const [articles, setArticles] = useState(initial?.articles || []);
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState(initial?.error ? 'Не удалось загрузить блог. Проверьте, что сервер запущен и вы вошли в панель.' : '');
  const [busy, setBusy] = useState(false);
  const [importMode, setImportMode] = useState('append');
  const imageInputRef = useRef(null);
  const imageTargetRef = useRef(null);
  const importInputRef = useRef(null);

  async function uploadFile(file) {
    const form = new FormData();
    form.append('image', file);
    const res = await axios.post(`${origin}/upload/${server_config.site_key}/blog`, form, { withCredentials: true });
    return res.data.filename;
  }

  async function toggleEnabled(checked) {
    setEnabled(checked);
    try {
      await axios.post(`${origin}/back/blog/settings/${server_config.site_key}`, {
        blog_enabled: checked ? 1 : 0,
      }, { withCredentials: true });
      await revalidateBlog();
      setStatus(checked ? 'Блог включён на сайте.' : 'Блог скрыт. Страницы блога отдают 404.');
    } catch (error) {
      setEnabled(!checked);
      setStatus(error.response?.data?.message || 'Не удалось сохранить переключатель.');
    }
  }

  function changeSection(localId, field, value) {
    setSections((prev) => prev.map((section) => {
      if (section.localId !== localId) return section;
      if (field === 'name' && !section.slugLocked) {
        return { ...section, name: value, slug: blogSlug(value) };
      }
      if (field === 'slug') {
        if (!String(value).trim()) return { ...section, slug: blogSlug(section.name), slugLocked: false };
        return { ...section, slug: blogSlug(value), slugLocked: true };
      }
      if (field === 'visible') return { ...section, visible: value ? 1 : 0 };
      return { ...section, [field]: value };
    }));
  }

  async function saveSections() {
    setBusy(true);
    try {
      const res = await axios.post(`${origin}/back/blog/sections/${server_config.site_key}`, {
        sections: sections.map((section) => ({
          id: section.id || null,
          name: section.name,
          slug: section.slug,
          description: section.description || '',
          visible: section.visible ? 1 : 0,
        })),
      }, { withCredentials: true });
      setSections(res.data.data.map((section) => ({
        ...section,
        localId: `s-${section.id}`,
        slugLocked: true,
        visible: Number(section.visible) ? 1 : 0,
      })));
      await revalidateBlog();
      setStatus('Разделы сохранены.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Не удалось сохранить разделы.');
    } finally {
      setBusy(false);
    }
  }

  function openArticle(article) {
    setDraft({
      ...article,
      slugLocked: true,
      published: Number(article.published) ? 1 : 0,
      content: blocksWithIds(article.content),
      read_time: article.read_time || '',
      cta_text: article.cta_text || 'Подключай домашний интернет у нас',
    });
    setStatus('');
  }

  function updateDraft(patch) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function changeTitle(value) {
    setDraft((prev) => ({
      ...prev,
      title: value,
      slug: prev.slugLocked ? prev.slug : blogSlug(value),
    }));
  }

  function changeSlug(value) {
    if (!value.trim()) {
      setDraft((prev) => ({ ...prev, slug: blogSlug(prev.title), slugLocked: false }));
      return;
    }
    setDraft((prev) => ({ ...prev, slug: blogSlug(value), slugLocked: true }));
  }

  function updateBlock(index, patch) {
    setDraft((prev) => ({
      ...prev,
      content: prev.content.map((block, blockIndex) => (blockIndex === index ? { ...block, ...patch } : block)),
    }));
  }

  function moveBlock(index, direction) {
    setDraft((prev) => {
      const content = [...prev.content];
      const next = index + direction;
      if (next < 0 || next >= content.length) return prev;
      const [item] = content.splice(index, 1);
      content.splice(next, 0, item);
      return { ...prev, content };
    });
  }

  async function saveArticle() {
    if (!draft.title.trim()) {
      setStatus('Введите заголовок статьи.');
      return;
    }
    if (!draft.section_id) {
      setStatus('Сначала выберите раздел. Если разделов нет — создайте и сохраните их.');
      return;
    }
    setBusy(true);
    try {
      const res = await axios.post(`${origin}/back/blog/article/${server_config.site_key}`, {
        id: draft.id,
        section_id: Number(draft.section_id),
        title: draft.title,
        slug: draft.slug,
        excerpt: draft.excerpt,
        read_time: draft.read_time,
        cta_text: draft.cta_text,
        cover: draft.cover,
        published: draft.published ? 1 : 0,
        content: draft.content.map(({ id, ...block }) => block),
      }, { withCredentials: true });
      const saved = res.data.data;
      setArticles((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        if (!exists) return [saved, ...prev];
        return prev.map((item) => (item.id === saved.id ? saved : item));
      });
      setDraft({ ...saved, slugLocked: true, content: blocksWithIds(saved.content) });
      await revalidateBlog();
      setStatus(saved.published ? 'Статья опубликована.' : 'Черновик сохранён. На сайте его не видно.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Не удалось сохранить статью.');
    } finally {
      setBusy(false);
    }
  }

  async function removeArticle(article) {
    if (!window.confirm(`Удалить статью «${article.title}»?`)) return;
    setBusy(true);
    try {
      await axios.delete(`${origin}/back/blog/article/${server_config.site_key}/${article.id}`, { withCredentials: true });
      setArticles((prev) => prev.filter((item) => item.id !== article.id));
      if (draft?.id === article.id) setDraft(null);
      await revalidateBlog();
      setStatus('Статья удалена.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Не удалось удалить статью.');
    } finally {
      setBusy(false);
    }
  }

  function openImagePicker(target) {
    imageTargetRef.current = target;
    imageInputRef.current?.click();
  }

  async function onPickedImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    const target = imageTargetRef.current;
    if (!file || target == null) return;
    try {
      const filename = await uploadFile(file);
      if (target === 'cover') updateDraft({ cover: filename });
      else updateBlock(target, { file: filename });
    } catch {
      setStatus('Не удалось загрузить картинку.');
    }
  }

  function rememberSections(list) {
    setSections(list.map((section) => ({
      ...section,
      localId: `s-${section.id}`,
      slugLocked: true,
      visible: Number(section.visible) ? 1 : 0,
    })));
  }

  async function exportArticles() {
    setBusy(true);
    try {
      const res = await axios.get(`${origin}/back/blog/export/${server_config.site_key}`, { withCredentials: true });
      const blob = new Blob([JSON.stringify(res.data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blog-${server_config.site_key}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus('Файл статей скачан.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Не удалось выгрузить статьи.');
    } finally {
      setBusy(false);
    }
  }

  async function importArticles(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (importMode === 'replace' && !window.confirm('Текущие разделы и статьи этого сайта будут удалены и заменены файлом. Продолжить?')) return;
    setBusy(true);
    try {
      const payload = JSON.parse(await file.text());
      const res = await axios.post(`${origin}/back/blog/import/${server_config.site_key}`, {
        ...payload,
        mode: importMode,
      }, { withCredentials: true });
      rememberSections(res.data.data.sections);
      setArticles(res.data.data.articles);
      setDraft(null);
      await revalidateBlog();
      const missing = res.data.data.missing_images || [];
      setStatus(missing.length
        ? `Импортировано статей: ${res.data.data.imported}. Не найдены картинки: ${missing.join(', ')}`
        : `Импортировано статей: ${res.data.data.imported}.`);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Не удалось импортировать статьи.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="blog-admin">
      <a className="blog-admin-back" href="/admin">🡐 Панель управления</a>
      <h2>Блог</h2>
      <label className="blog-admin-toggle">
        <input type="checkbox" checked={enabled} onChange={(event) => toggleEnabled(event.target.checked)} />
        <span>Показывать блог на сайте</span>
      </label>
      {status ? <p className="blog-admin-status">{status}</p> : null}

      <section>
        <h3>Разделы</h3>
        <div className="sectionContent">
          {sections.map((section) => (
            <div className="blog-admin-card" key={section.localId}>
              <label>Название
                <input value={section.name} onChange={(event) => changeSection(section.localId, 'name', event.target.value)} />
              </label>
              <label>URL раздела
                <input value={section.slug} onChange={(event) => changeSection(section.localId, 'slug', event.target.value)} />
              </label>
              <label>Описание для SEO
                <textarea value={section.description || ''} onChange={(event) => changeSection(section.localId, 'description', event.target.value)} />
              </label>
              {section.slug ? <span className="blog-admin-url">/blog/section/{section.slug}</span> : null}
              <button type="button" onClick={() => setSections((prev) => prev.filter((item) => item.localId !== section.localId))}>Удалить</button>
            </div>
          ))}
          <div className="blog-admin-actions">
            <button type="button" onClick={() => setSections((prev) => [...prev, {
              localId: `new-${Date.now()}`,
              id: null,
              name: '',
              slug: '',
              description: '',
              visible: 1,
              slugLocked: false,
            }])}>Добавить раздел</button>
            <button type="button" onClick={saveSections} disabled={busy}>Сохранить разделы</button>
          </div>
        </div>
      </section>

      <section>
        <h3>Статьи</h3>
        <div className="sectionContent">
          <div className="blog-admin-transfer">
            <button type="button" onClick={exportArticles} disabled={busy}>🡑 Экспорт</button>
            <button type="button" onClick={() => importInputRef.current?.click()} disabled={busy}>🡓 Импорт</button>
            <label>
              <input
                type="radio"
                name="blog-import-mode"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
              />
              Добавить к текущим
            </label>
            <label>
              <input
                type="radio"
                name="blog-import-mode"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
              />
              Заменить все
            </label>
            <input ref={importInputRef} type="file" accept="application/json,.json" hidden onChange={importArticles} />
          </div>
          <button
            type="button"
            onClick={() => setDraft(emptyArticle(sections.find((section) => section.id)?.id || ''))}
          >+ Новая статья</button>
          <div className="blog-admin-list">
            {articles.map((article) => (
              <div className='blog-admin-list-item' key={article.id}>
                <button type="button" onClick={() => openArticle(article)}>{article.title}</button>
                <span>{article.section_name}</span>
                <span>/blog/{article.slug}</span>
                <span>{article.published ? 'Опубликован' : 'Черновик'}</span>
                <button type="button" onClick={() => removeArticle(article)}>Удалить</button>
              </div>
            ))}
          </div>

          {draft ? (
            <div className="blog-editor">
              <div className="blog-editor-header">
                <h3>{draft.id ? 'Редактирование' : 'Новая статья'}</h3>
                <label className="blog-admin-check">
                  <input type="checkbox" checked={Boolean(draft.published)} onChange={(event) => updateDraft({ published: event.target.checked ? 1 : 0 })} />
                  <span>Опубликовать</span>
                </label>
              </div>
              
              <div className="blog-editor-config f-row">
                <label>Раздел
                  <select value={draft.section_id || ''} onChange={(event) => updateDraft({ section_id: event.target.value })}>
                    <option value="">Выберите раздел</option>
                    {sections.filter((section) => section.id).map((section) => (
                      <option value={section.id} key={section.id}>{section.name}</option>
                    ))}
                  </select>
                </label>
                <label>Заголовок
                  <input value={draft.title} onChange={(event) => changeTitle(event.target.value)} />
                </label>
                <label>URL статьи 
                  <input value={draft.slug} onChange={(event) => changeSlug(event.target.value)} />
                
                </label>
                <label>Время чтения
                  <input value={draft.read_time || ''} onChange={(event) => updateDraft({ read_time: event.target.value })} placeholder="5 мин" />
                </label>
              </div>
              <label>Краткое описание для поисковиков
                <textarea value={draft.excerpt} onChange={(event) => updateDraft({ excerpt: event.target.value })} />
              </label>
              
              <div className="blog-admin-cover">
                <span>Обложка</span>
                <div className="imgContainer blog-pick" onClick={() => openImagePicker('cover')}>
                  <img src={draft.cover ? blogImageUrl(draft.cover) : blogPlaceholderUrl()} alt="Обложка статьи" />
                </div>
                {draft.cover ? <button type="button" onClick={() => updateDraft({ cover: '' })}>Убрать обложку</button> : null}
              </div>
              <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={onPickedImage} />

              

              {draft.content.map((block, index) => (
                <div className="blog-block" key={block.id}>
                  <div className="blog-block-bar">
                    <span>{BLOCKS.find(([type]) => type === block.type)?.[1] || block.type}</span>
                    
                    
                  </div>
                  <div className="blog-block-content">
                    <div className="blog-block-inner">
                      {block.type === 'image' ? (
                        <>
                          <div className="imgContainer blog-pick" onClick={() => openImagePicker(index)}>
                            <img src={block.file ? blogImageUrl(block.file) : blogPlaceholderUrl()} alt={block.alt || 'Картинка статьи'} />
                          </div>
                          Подпись для SEO (alt): <input placeholder="Подпись для SEO" value={block.alt || ''} onChange={(event) => updateBlock(index, { alt: event.target.value })} />
                        </>
                      ) : null}
                      {block.type === 'table' ? (
                        <TableBlock block={block} onChange={(patch) => updateBlock(index, patch)} />
                      ) : null}
                      {block.type === 'html' ? (
                        <textarea value={block.html || ''} onChange={(event) => updateBlock(index, { html: event.target.value })} placeholder="<p>Текст<br>продолжение</p>" />
                      ) : null}
                      {block.type !== 'image' && block.type !== 'table' && block.type !== 'html' ? (
                        <textarea
                          value={block.text || ''}
                          onChange={(event) => updateBlock(index, { text: event.target.value })}
                          placeholder={block.type === 'ul' || block.type === 'ol' ? 'Каждый пункт с новой строки' : 'Текст'}
                        />
                      ) : null}
                    </div>

                    <div className="slider-item bottom-side  f-row">
                        <div className="left-side">
                          <button type="button" className="delIcon-Button"  onClick={() => updateDraft({ content: draft.content.filter((item) => item.id !== block.id) })}></button>
                        </div>
                        <div className="right-side">
                          <button type="button" className="top-Button" onClick={() => moveBlock(index, -1)}></button>
                          <button type="button" className="bottom-Button" onClick={() => moveBlock(index, 1)}></button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
              <span>Добавить:</span>
              <div className="blog-admin-toolbar">
                {BLOCKS.map(([type, label]) => (
                  <button type="button" key={type} onClick={() => updateDraft({ content: [...draft.content, blockOf(type)] })}>{label}</button>
                ))}
              </div>

              <label>Текст перед кнопкой заявки
                <textarea value={draft.cta_text} onChange={(event) => updateDraft({ cta_text: event.target.value })} />
              </label>

              <div className="blog-admin-actions">
                <button type="button" onClick={saveArticle} disabled={busy}>Сохранить статью</button>
                <button type="button" onClick={() => setDraft(null)}>Закрыть</button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function TableBlock({ block, onChange }) {
  const headers = block.headers?.length ? block.headers : [''];
  const rows = block.rows?.length ? block.rows : [headers.map(() => '')];
  const canRemoveColumn = headers.length > 1;
  const canRemoveRow = rows.length > 1;

  function setHeader(index, value) {
    const next = [...headers];
    next[index] = value;
    onChange({ headers: next });
  }

  function setCell(rowIndex, cellIndex, value) {
    const next = rows.map((row, index) => {
      if (index !== rowIndex) return row;
      const copy = [...row];
      copy[cellIndex] = value;
      return copy;
    });
    onChange({ rows: next });
  }

  function addColumn() {
    onChange({
      headers: [...headers, ''],
      rows: rows.map((row) => [...row, '']),
    });
  }

  function addRow() {
    onChange({ rows: [...rows, headers.map(() => '')] });
  }

  function removeColumn(index) {
    if (!canRemoveColumn) return;
    onChange({
      headers: headers.filter((_, cellIndex) => cellIndex !== index),
      rows: rows.map((row) => row.filter((_, cellIndex) => cellIndex !== index)),
    });
  }

  function removeRow(index) {
    if (!canRemoveRow) return;
    onChange({ rows: rows.filter((_, rowIndex) => rowIndex !== index) });
  }

  return (
    <div className="blog-table-editor">
      <div className="blog-table-scroll">
        <table>
          <thead>
            <tr>
              {headers.map((cell, index) => (
                <th key={index}>
                  <div className="blog-table-cell">
                    <input value={cell} onChange={(event) => setHeader(index, event.target.value)} />
                    <button type="button" className="delIcon-Button" disabled={!canRemoveColumn} onClick={() => removeColumn(index)} title="Удалить столбец">—</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, cellIndex) => (
                  <td key={cellIndex}>
                    <input value={row[cellIndex] || ''} onChange={(event) => setCell(rowIndex, cellIndex, event.target.value)} />
                  </td>
                ))}
                <td className="blog-table-add">
                  <button type="button" className="delIcon-Button" disabled={!canRemoveRow} onClick={() => removeRow(rowIndex)} title="Удалить строку">—</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="blog-admin-actions">
        <button type="button" onClick={addColumn}>Столбец</button>
        <button type="button" onClick={addRow}>Строка</button>
      </div>
    </div>
  );
}
