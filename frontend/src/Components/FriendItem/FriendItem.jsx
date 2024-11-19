import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../Avatar'
import './FriendItemStyle.scss'

const FriendItem = ({id, avatar, name, icon, onClick}) => {
  return (
    <div 
    key={`friend-${id}`} 
  
    className=" d-flex col-3 mb-3 FriendItem justify-content-center">
      <div className='col'>
        <Link className='d-flex justify-content-center' to={`/@${id}`} >
              <Avatar link={avatar} big />
        </Link>
          <div className='d-flex justify-content-center fw-medium text_name'>
              <p>{name}</p>
          </div>
      </div>
      {
        icon && 
        <div onClick={onClick}>
            {icon}
        </div>
      }
    </div>
  )
}

export default FriendItem