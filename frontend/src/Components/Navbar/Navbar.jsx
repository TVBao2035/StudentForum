import React from 'react'
import './NavbarStyle.scss';
import { Link } from 'react-router-dom';
export default function Navbar(props) {
    const {list} = props;
  return (
      <nav className='Navbar'>
        {
            list.map(item => {
                const Type = item.type === 'link' ? Link : "li";
                return (
                    <Type to={item?.to} key={`item-${item.title}`} className='item d-flex justify-content-between gap-2 fs-5 py-3 text-secondary'>
                        <div className='d-flex align-items-center gap-2'>
                            <div className='icon bg-secondary text-white d-flex align-items-center'>
                                {item.icon}
                            </div>
                            <div className='text fs-6'>
                                <p className='m-0'>{item.title}</p>
                            </div>
                        </div>
                    </Type>
                )

            })
        }
          
      </nav>
  )
}
