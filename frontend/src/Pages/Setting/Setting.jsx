import React, { useEffect, useState } from 'react'
import { Avatar, Navbar } from '../../Components'
import { MdOutlineKeyboardArrowRight, MdBrightness6 } from "react-icons/md";
import { IoLogOutSharp, IoSettings } from "react-icons/io5";
import './SettingStyle.scss';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../../API/UserAPI';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../Assets/images/defaultAvatar';
import handleColorApp from '../../Helpers/handleColorApp';
import { RiAdminFill } from "react-icons/ri";
export default function Setting() {
  const navigation = useNavigate();
  const user = useSelector(state => state.user);
  const [changeColor, setChangeColor] = useState(false);

  const handleLogout = async () => {
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

    if (!isConfirmed) {
      return;
    }

    let response = await logOut();
    if (response.status === 200) {
      Swal.fire({
        title: response.message,
        icon: 'success',
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 5000,
      });
      localStorage.removeItem(process.env.REACT_APP_LOGIN_LOCAL_STORAGE);
      navigation('/login');
      return;

    }
    if (response.status === 404) {
      Swal.fire({
        title: response.message,
        icon: 'error',
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 5000,
      });
    }

  }

  const handleBackgroupColor = () => {
    const themes = JSON.parse(localStorage.getItem("backgroupApp"));
    var backgroupDark = {};
    if(!themes?.themesDark){
        backgroupDark = {
          backgroupColor: "#333333",
          color: "white",
          themesDark: true
        }
    }else{
      backgroupDark = {
        backgroupColor: "white",
        color: "#333333",
        themesDark: false
      }
    }
    setChangeColor(!changeColor);
    localStorage.setItem("backgroupApp", JSON.stringify(backgroupDark));



  }

  const listItems = [

    {
      icon: <IoSettings />,
      title: "Chỉnh sửa thông tin cá nhân",
      type: 'Link',
      to: '/account'
    },
    {
      icon: <MdBrightness6 />,
      title: "Đổi Sáng Tối",
      type: 'text',
      onClick: handleBackgroupColor
    },
    {
      icon: <IoLogOutSharp />,
      title: "Đăng Xuất",
      type: "text",
      onClick: handleLogout

    },
  ]

  if (user?.isAdmin) {
    listItems.unshift({
      icon: <RiAdminFill />,
      title: "AdminPage",
      type: 'Link',
      to: '/admin'
    });
  }

  useEffect(() => {
    handleColorApp();
  }, [changeColor])

  return (
    <div className='Setting'>
      <div className='container w-50'>
        <Link
          to={`../@${user.id}`}
          className='d-flex justify-content-between align-items-center'

        >
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
        <hr className='my-2' />
        <Navbar listItems={listItems} />
      </div>
    </div>
  )
}
