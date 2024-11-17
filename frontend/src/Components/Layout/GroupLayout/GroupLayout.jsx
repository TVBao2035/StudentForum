import React from 'react'
import Header from '../../Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../Footer'
import Navbar from '../../Navbar'
import { TiGroup } from "react-icons/ti";
import { FaCompass } from "react-icons/fa";
const items = [
    {
        icon: <FaCompass/>,
        title: `Khám phá`,
        type: `NavLink`,
        to:  `discover`
    },
    {
        icon: <TiGroup/>,
        title: `Nhóm của bạn`,
        type: `NavLink`,
        to: `join`
    },
]
const GroupLayout = () => {
  return (
    <div>
        <div>
            <Header />
        </div>
        <div className='d-flex my-2 row'> 
            <div className='col-2 mt-1'>
                <Navbar listItems={items} />
            </div>
            <div className='col-9'>
                <Outlet />
            </div>
        </div>
        <div>
            <Footer />
        </div>
    </div>
  )
}

export default GroupLayout