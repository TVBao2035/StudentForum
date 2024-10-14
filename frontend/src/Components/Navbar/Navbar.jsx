import React from 'react'
import './NavbarStyle.scss';
import { Link, NavLink } from 'react-router-dom';
export default function Navbar({ listItems, ...style }) {
  return (
    <div className='Navbar'>
      <nav className={`${Object.keys(style)}`}>
        {
            listItems.map((item, index) => {
              let Type = "li";
              if(item.type !== 'text'){
                Type = item.type === 'link' ? Link : NavLink;
              }
              return (
                  <Type 
                      to={item?.to} 
                      key={`item-${index}`} 
                      className='item d-flex justify-content-between gap-2 fs-5 text-secondary'
                      onClick={item.onClick ? item.onClick : ()=>{}}
                  >
                      <div className='d-flex align-items-center gap-2'>
                        {
                            item.icon && 
                            <div className='icon text-white d-flex align-items-center'>
                                {item.icon}
                            </div>
                        }
                          <div className='text fs-6'>
                              <p className='m-0'>{item.title}</p>
                          </div>
                      </div>
                  </Type>
              )

            })
        }
          
      </nav>
    </div>
  )
}
