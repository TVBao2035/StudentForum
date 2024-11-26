import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar } from '../../Components';
import './FriendListPageStyle.scss';
import { Link } from 'react-router-dom';
export default function FriendListPage({ children }) {

  return (
    <div className='FriendListPage row border-bottom'>
      {children}
    </div>
  )
}
