import React from 'react'
import Header from '../../Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../Footer'

export default function MainLayout() {
  return (
      <div className='Layout'>
          <Header />
          <div className='my-2'>
              <Outlet />
          </div>
          <Footer />
      </div>
  )
}
