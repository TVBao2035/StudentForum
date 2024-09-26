import React from 'react'
import { Avatar, Navbar } from '../../Components'
import { MdOutlineKeyboardArrowRight, MdBrightness6 } from "react-icons/md";
import { IoLogOutSharp, IoSettings } from "react-icons/io5";
import { BsBrightnessHigh, BsBrightnessHighFill } from "react-icons/bs";
import './SettingStyle.scss';
import { Link } from 'react-router-dom';
export default function Setting() {
  const list = [
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
      type: "link",
      to: '../login'
    },
  ]
  return (
    <div className='Setting'>
      <div className='container w-50'>
          <Link to={'../details'} className='d-flex justify-content-between align-items-center text-secondary text-decoration-none'>
            <div className='d-flex gap-2 align-items-center'>
              <Avatar 
                  link={"https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png"}
                  big
              />
              <p className='fw-bold'>User Name....</p>
            </div>
            <div className='fs-4'>
              <MdOutlineKeyboardArrowRight />
            </div>
          </Link>
          <hr />
          <Navbar list={list} />
      </div>
    </div>
  )
}
