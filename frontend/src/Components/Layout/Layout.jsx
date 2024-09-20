import React from 'react'
import Home from '../../Pages/Home'
import Footer from '../Footer'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

export default function Layout() {
  return (
    <div className='Layout'>
        <Header/>
            <Outlet/>
        <Footer/>
    </div>
  )
}
