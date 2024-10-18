import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar } from '../../../../Components';
import './Friend_Profile_Style.scss';
import { Link } from 'react-router-dom';
export default function Friend_Profile({friends}) {
  
  return (
    <div className='Friend_Profile row border-bottom'>
      {
        friends?.map(friend => (
        <Link to={`/@${friend.User.id}`} key={`friend-${friend.id}`} className="col-3 mb-3">
          <div className='d-flex justify-content-center'>
            <Avatar link={friend.User.avatar} big/>
          </div>
          <div className='d-flex justify-content-center fw-medium text_name'>
            <p>{friend.User.name}</p>
          </div>
        </Link>
        ))
      }
    </div>
  )
}
