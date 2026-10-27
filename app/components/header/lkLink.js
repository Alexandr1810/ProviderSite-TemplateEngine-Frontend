'use client';

export default function LkLink({ lk_link_on }) {
  return (
    <a href={lk_link_on} id="lk_link">
      {lk_link_on !== 'none' && "Личный кабинет"}
    </a> 
  );
}