'use client'

import React, {useState, useEffect} from 'react'
import { api } from '@/app/utils/api.js';
import { server_config } from '@/app/utils/server_config.js'
import axios from 'axios';

function Header(props) {
  const [user_name, setUser_name] = useState(null)

  const logout = async () => {
    await api('/auth/logout', { method: 'POST', body: JSON.stringify({ site_key: server_config.site_key }) });
    window.location.href = '/login';
  };
  useEffect(() => {
    (async () => {
        try {
            const res = await axios.get(
                `${server_config.api_protocol}://${server_config.site_folder}/auth/me/${server_config.site_key}`,
                { withCredentials: true }
            );
            setUser_name(res.data.login);
        } catch (e) {
            console.error(e);
        }
    })();
  }, []);

  return (
    <header>
        <div className='left-side'>
            <img className="logo" src={props.logo_small || null} />
            <h2>Панель управления</h2>
        </div>
        <div className='right-side'>
            <span>{props.provider_name}</span>
            <span>|</span>
            <span>{user_name}</span>
            <button onClick={logout}>Выйти</button>
        </div>
    </header>
  );
}


export default Header;