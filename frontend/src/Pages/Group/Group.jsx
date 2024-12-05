import React, { useEffect, useState } from 'react'
import { createGroupInvitation, deleteGroupInvitation, getAllGroup } from '../../API/GroupAPI';

import './GroupStyle.scss';
import { GroupItem } from '../../Components';
import { useSelector } from 'react-redux';

export default function Group() {
  const user = useSelector(state => state.user);
  const [listGroups, setListGroups] = useState([]);

  const fechApi = async() => {
    let res = await getAllGroup();
    if(res.status === 404) {
      alert(res.message);
      return;
    }

    setListGroups(res.data);
  }
  
  const fetchCreateInvitation = async ({ groupId, userId }) => {
    let res = await createGroupInvitation({ groupId, userId });

    if (res?.status !== 200) {
      alert("error");
      return;
    }
    fechApi();
  }

  const fetchDeleteInvitation = async (invitationId) => {
    let res = await deleteGroupInvitation(invitationId);
    if(res.status !== 200) {
      alert("Error");
      return;
    }
    fechApi();
  }

  useEffect(() => {
    fechApi();
  }, []);
  return (
    <div className='Group'>
        <div className='container d-flex flex-wrap'>
          {
            listGroups.map((group, index) => (
              <GroupItem 
                fetchDelete={fetchDeleteInvitation}
                fetchCreate={fetchCreateInvitation}
                key={`${group.image} - ${index}`}
                image={group.image}
                isJoin={group.groupuser.some(userGroup => userGroup.invitation.id === user.id && userGroup.isAccept===true)}
                group={group} />
            ))
          }
        </div>
    </div>
  )
}
