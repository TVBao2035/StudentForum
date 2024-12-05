import React, { useEffect, useState } from 'react'
import { GroupItem } from '../../Components';
import { getAllGroupJoin } from '../../API/GroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { MdOutlineGroupAdd } from "react-icons/md";
import { openModalCreateGroup } from '../../Redux/modalGroupSlice';
const GroupJoin = () => {
  const [listGroups, setListGroups] = useState([]);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
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
  }, [useSelector(state => state.modal.modalGroup)])
  return (
    
    <div className='GroupJoin'>
      <div className='d-flex justify-content-end'>
        <button 
        onClick={()=> dispatch(openModalCreateGroup())}
        className='btn btn-primary d-flex align-items-center gap-2'>
          <MdOutlineGroupAdd/>
          <p>Tạo nhóm</p>
        </button>
      </div>
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