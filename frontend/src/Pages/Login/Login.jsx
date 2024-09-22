import React, { useState } from 'react'
import Input from '../../Components/Input';
import { signIn } from '../../API/UserAPI';
import './LoginStyle.scss';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
export default function Login() {
  const initInfor = {
<<<<<<< HEAD
    email: "bao@gmail.com",
    password: "12345"
=======
    email: "mingzi03@gmail.com",
    password: "mingziabc@123"
>>>>>>> 5574a7128f62c5498622dbed08f6ad78dee09afa
  }

  const initMessage = {
    email: "",
    password: ""
  }
  const [infor, setInfor] = useState(initInfor);
  const [message, setMessage] = useState(initMessage);
  const naigate = useNavigate();
  const handleChange = (e) => {
    setInfor({
      ...infor,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async () => {
    let checkNotError = Object.values(message).every(e => e.length ===0);
    if (checkNotError){
      let res = await signIn(infor);
      console.log(res);
      if(res.status === 404){
        setMessage({
          ...message,
          [res.data]: res.message
        })
        return;
      }

      if(res.status === 200){
        Swal.fire({
          title: res.message,
          icon: 'success',
          toast: true,
          position: 'top-end',
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 8000,
        });
        naigate('/');
      }
    }
  }
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
