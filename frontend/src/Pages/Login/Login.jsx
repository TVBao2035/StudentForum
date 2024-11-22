import React, { useEffect, useState } from 'react'

import { signIn } from '../../API/UserAPI';
import './LoginStyle.scss';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Input } from '../../Components';
import { useDispatch } from 'react-redux';
import { setDataMain } from '../../Redux/userSlice';

export default function Login() {
  const initInfor = {
    email: "bao@gmail.com",
    password: "12345"

  }

  const initMessage = {
    email: "",
    password: ""
  }

  const [infor, setInfor] = useState(initInfor);
  const [message, setMessage] = useState(initMessage);
  const naigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInfor({
      ...infor,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    console.log(infor);
    let checkNotError = Object.values(message).every(e => e.length === 0);
    if (checkNotError) {
      let res = await signIn(infor);

      if (res.status === 404) {
        setMessage({
          ...message,
          [res.data]: res.message
        });
        return;
      }

      if (res.status === 200) {
        const userData = res.data;
        dispatch(setDataMain({
          id: userData.id,
          token: userData.accessToken,
          name: userData.name,
          avatar: userData.avatar,
          isAdmin: userData.isAdmin,
        }));
        Swal.fire({
          title: res.message,
          icon: 'success',
          toast: true,
          position: 'top-end',
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 5000,
        });
        localStorage.setItem(process.env.REACT_APP_LOGIN_LOCAL_STORAGE, true);
        naigate('/');

        return;
      }
    }
  }
  useEffect(()=> {
    localStorage.clear(process.env.REACT_APP_LOGIN_LOCAL_STORAGE);
  }, []);
  
  return (
    <div className='Login container px-5 py-5 w-50 border user-select-none rounded-4 border-primary'>
      <div className=''>
        <div className='container gap-4 fs-3 '>
          <p className='title'>Đăng Nhập</p>
        </div>

        <div className='container d-flex flex-column gap-4'>
          <Input
            label={"email"}
            type='email'
            name='email'
            message={message.email}
            setMessage={setMessage}
            handleChange={handleChange}
            value={infor.email}
          />

          <Input
            label='Mật Khẩu'
            type='password'
            name='password'
            message={message.password}
            setMessage={setMessage}
            handleChange={handleChange}
            value={infor.password}
          />

          <div className='d-flex justify-content-center flex-column  align-items-center gap-1'>
            <button
              className={`btn btn-primary`}
              onClick={handleSubmit}
            >Đăng Nhập</button>
            <Link to={'/register'}>Đăng Ký</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
