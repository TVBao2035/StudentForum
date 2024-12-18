import './FooterStyle.scss';
import { NavLink } from "react-router-dom";
import { IoHomeSharp, IoNotifications, IoPeople, IoPersonAdd, IoSettingsSharp } from "react-icons/io5";
import {  useSelector } from 'react-redux';
export default function Footer() {
  
  const themesRedux = useSelector(state => state.themes);
  return (
    <div className={`Footer position-fixed bottom-0 w-100 ${themesRedux.isChangeThemes ? "themesDark" : "themesBright"} `}>
      <nav className='d-flex container justify-content-center fs-4 '>
        <li>
          <NavLink to={'../'}>
            <IoHomeSharp/>
          </NavLink>
        </li>
        <li>
          <NavLink to={'../makeFriend'} >
            <IoPersonAdd />
          </NavLink>
        </li>
        <li>
          <NavLink to={'../group/discover'} >
            <IoPeople />
          </NavLink>
        </li>
        <li>
          <NavLink to={'../notification'}>
            <IoNotifications />
          </NavLink>
        </li>
        <li>
          <NavLink to={'../setting'}>
            <IoSettingsSharp/>
          </NavLink>
        </li>
      </nav>
    </div>
  )
}
