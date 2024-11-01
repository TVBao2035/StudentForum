import React from 'react'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'
import './GroupItemStyle.scss';
import { useSelector } from 'react-redux';
 const GroupItem = ({group, isJoin}) => {
    const user = useSelector(state => state.user);
  return (
      <div className='GroupItem d-flex flex-column col-3 gap-3  p-3'>
          <div className='d-flex gap-2 '>
              <div className='d-flex align-items-center'>
                  <Avatar big link={"https://th.bing.com/th?q=Meme+M%c3%a8o+Mlem&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.1&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247"} />
              </div>
              <div className='d-flex gap-2 flex-column'>
                  <h5 className='m-0 group_name'>{group.name}</h5>
                  <p className='group_description'>{group.description}</p>
                  {/* <p>{`Thành viên: ${group.Users.length}`}</p> */}
              </div>
          </div>
          <div className='col'>
              {
                    isJoin ? (
                      <Link to={`../G@${group.id}`} className='btn btn-primary w-100'>
                          <p>Xem Nhóm</p>
                      </Link>
                  ) : (
                      <div className='btn btn-secondary w-100'>
                          <p>Tham gia</p>
                      </div>
                  )
              }
          </div>
      </div>
  )
}

export default GroupItem;
