import React, { useEffect, useState } from 'react'
import { GroupItem } from '../../Components';
import { getAllGroupJoin } from '../../API/GroupAPI';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const GroupJoin = () => {
  const [listGroups, setListGroups] = useState([]);
  const user = useSelector(state => state.user);
  const fetchApi = async () => {
    let res = await getAllGroupJoin(user.id);
    if(res.status === 404){
      Swal.fire({
        title: res.message,
        icon: 'error',
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }
    setListGroups(res.data);
  }

  useEffect(() => {
    fetchApi();
  }, [])
  return (
    <div className='GroupJoin'>
      <div className='container row'>
        {
          listGroups.map((group, index) => <GroupItem 
                                    image={group.image} 
                                    isJoin
                                    key={`${group.image}-${index}`} 
                                    group={group} />)
        }
      </div>
    </div>
  )
}

export default GroupJoin