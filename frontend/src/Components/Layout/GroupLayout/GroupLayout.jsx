import React from 'react'
import Header from '../../Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../Footer'

const GroupLayout = () => {
  return (
    <div>
        <div>
            <Header />
        </div>
        <div className='d-flex my-2 row'> 
            <div className='col-2'>
                Menu
            </div>
            <div className='col'>
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