import React from 'react'
import Header from '../../Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../Footer'
import './MainLayoutStyle.scss';
export default function MainLayout() {
  return (
      <div className='MainLayout'>
          <Header />
          <div className='Main my-5 py-5'>
              <Outlet  />
          </div>
          <Footer />
      </div>
  )
}
