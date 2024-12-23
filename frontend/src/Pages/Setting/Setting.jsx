import React, { useEffect, useState } from 'react'
import { Avatar, Loading, Navbar } from '../../Components'
import { MdOutlineKeyboardArrowRight, MdBrightness6, MdPassword } from "react-icons/md";
import { IoLogOutSharp, IoSettings } from "react-icons/io5";
import './SettingStyle.scss';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../../API/UserAPI';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '../../Assets/images/defaultAvatar';
import handleColorApp from '../../Helpers/handleColorApp';
import { RiAdminFill } from "react-icons/ri";
import { ModalChangePassword } from '../../Components/Modal';
import { setChangeThemes } from '../../Redux/themesSlice';
import swalApp from '../../Helpers/swalApp';
import { openModalChangePassword } from '../../Redux/modalChangePassword';
import { setLoading } from '../../Redux/loadingSlice';


export default function Setting() {
  const navigation = useNavigate();
  const user = useSelector(state => state.user);
  const [changeColor, setChangeColor] = useState(false);
  const modal = useSelector(state => state.modal.modalChangePassword)
  const dispatch = useDispatch();


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
      swalApp('success', response.message);
      localStorage.removeItem(process.env.REACT_APP_LOGIN_LOCAL_STORAGE);
      navigation('/login');
      dispatch(setLoading(true));
      return;

    }
    if (response.status === 404) {
      swalApp('error', response.message);
    }

  }

  const handleThemesColor = () => {
    const themes = JSON.parse(localStorage.getItem("themesApp"));
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
   
    dispatch(setChangeThemes(!themes?.themesDark));
    setChangeColor(!changeColor);
    localStorage.setItem("themesApp", JSON.stringify(backgroupDark));
  }

  const handleModal = ()=>{

    dispatch(openModalChangePassword());
  }

  const listItems = [

    {
      icon: <IoSettings />,
      title: "Chỉnh sửa thông tin cá nhân",
      type: 'Link',
      to: '/account'
    },
    {
      icon: <MdPassword />,
      title: "Thay đổi mật khẩu",
      type: 'text',
      onClick: handleModal
    },
    {
      icon: <MdBrightness6 />,
      title: "Đổi Sáng Tối",
      type: 'text',
      onClick: handleThemesColor
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
    <>
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
      {
        modal.isOpen && <ModalChangePassword />
      }

    </>
  )
}
