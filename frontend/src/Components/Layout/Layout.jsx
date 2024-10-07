import React from 'react'
import Home from '../../Pages/Home'
import Footer from '../Footer'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

export default function Layout() {
  return (
    <div className='Layout'>
        <Header/>
          <div className='my-2'>
            <Outlet/>
          </div>
        <Footer/>
    </div>
  )
}
