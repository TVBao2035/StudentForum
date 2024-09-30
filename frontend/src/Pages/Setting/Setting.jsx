import React from 'react'
import { Avatar, Navbar } from '../../Components'
import { MdOutlineKeyboardArrowRight, MdBrightness6 } from "react-icons/md";
import { IoLogOutSharp, IoSettings } from "react-icons/io5";
import { BsBrightnessHigh, BsBrightnessHighFill } from "react-icons/bs";
import './SettingStyle.scss';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../../API/UserAPI';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../Assets/images/defaultAvatar';
export default function Setting() {
  const navigation = useNavigate();
  const user = useSelector(state => state.user);

  const handleLogout = async() => {
    const { isConfirmed } = await Swal.fire({
      title: "Thông Báo :v",
      text: "Bạn Có Muốn Đăng Xuất Không?",
      icon: "question",
      showCloseButton: true,
      showCancelButton: true,
      buttonsStyling: "blue",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#dc3545",
      grow: 'row'
    });
    
    if (!isConfirmed){
        return;
    }

    let response = await logOut();
    if(response.status === 200){
      Swal.fire({
        title: response.message,
        icon: 'success',
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 8000,
      });
      localStorage.clear(process.env.REACT_APP_LOGIN_LOCAL_STORAGE);
      navigation('/login');
      return;

    }else{
      Swal.fire({
        title: response.message,
        icon: 'error',
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 8000,
      });
      }

  }


  const listItems = [
    {
      icon: <IoSettings/>,
      title: "Cài Đặt",
      type: 'text'
    },
    {
      icon: <MdBrightness6 />,
      title: "Hình Nền",
      type: 'text',
    },
    {
      icon: <IoLogOutSharp />,
      title: "Đăng Xuất",
      type: "text",
      onClick: handleLogout
      
    },
  ]

  return (
    <div className='Setting'>
      <div className='container w-50'>
          <Link to={'../details'} className='d-flex justify-content-between align-items-center text-secondary text-decoration-none'>
            <div className='d-flex gap-2 align-items-center'>
              <Avatar 
                  link={
                    user && user.avatar ? user.avatar : defaultAvatar
                  }
                  big
              />
              <p className='fw-bold m-0'>
              {
                user && user.name ? user.name : 'Loading....'
              }
              </p>
            </div>
            <div className='fs-4'>
              <MdOutlineKeyboardArrowRight />
            </div>
          </Link>
          <hr />
        <Navbar listItems={listItems} />
      </div>
    </div>
  )
}
