import React from 'react'
import { Profile } from '../../../Pages'
import { Outlet } from 'react-router-dom'

export default function ProfileLayout() {
  return (
    <div className='ProfileLayout'>
        <div>
            <Profile/>
        </div>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}
