import React, { useEffect, useState } from 'react'
import { getAllGroup } from '../../API/GroupAPI';

import './GroupStyle.scss';
import { GroupItem } from '../../Components';
import { useSelector } from 'react-redux';
export default function Group() {
  const user = useSelector(state => state.user)
  const [listGroups, setListGroups] = useState([]);
  const fechApi = async() => {
    let res = await getAllGroup();
    if(res.status === 404) {
      alert(res.message);
      return;
    }

    setListGroups(res.data);
  }

  useEffect(() => {
    fechApi();
  }, []);
  return (
    <div className='Group'>
        <div className='container row'>
          {
            listGroups.map(group => (
              <GroupItem 
                isJoin={group.Users.some(userGroup => userGroup.id === user.id)}
                group={group} />
            ))
          }
        </div>
    </div>
  )
}
