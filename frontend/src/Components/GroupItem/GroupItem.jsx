import React from 'react'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'
import './GroupItemStyle.scss';
import { useSelector } from 'react-redux';

 const GroupItem = ({group, isJoin, image, fetchCreate, fetchDelete}) => {
    
    const user = useSelector(state => state.user);
    

  return (
      <div className='GroupItem d-flex col-xl-3 col-md-6 col-12 flex-column gap-3  p-3'>
          <div className='d-flex gap-2 '>
              <div className='d-flex align-items-center'>
                  <Avatar big link={image} />
              </div>
              <div className='d-flex gap-2 flex-column'>
                  <h5 className='m-0 group_name fs-5 fw-medium'>{group.name}</h5>
                  <p className='group_description'>{group.description}</p>
              </div>
          </div>
          <div className='col'>
              {
                    isJoin ? (
                      <Link to={`../G@${group.id}`} className='btn btn-primary w-100'>
                          <p>Xem Nhóm</p>
                      </Link>
                  ) : (
                    group.groupuser.some(userGroup => userGroup.invitation.id === user.id) ?
                        <div 
                        onClick={() => fetchDelete(group.groupuser.find(groupuser => groupuser.userId == user.id)?.id)}
                        className='btn btn-outline-primary btn-outline w-100'>
                            <p>Đã Gửi Yêu Cầu</p>
                        </div> :
                        <div 
                        onClick={() => fetchCreate({groupId:group.id, userId: user.id })}
                        className='btn btn-secondary w-100'>
                            <p>Tham gia</p>
                        </div>
                  )
              }
          </div>
      </div>
  )
}

export default GroupItem;
