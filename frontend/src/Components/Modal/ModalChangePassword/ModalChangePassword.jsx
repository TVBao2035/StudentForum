import './ModalChangePasswordStyle.scss';
import { IoCloseSharp } from "react-icons/io5";
import {Input} from '../../../Components';
import { useDispatch } from 'react-redux';
import { closeModalChangePassword } from '../../../Redux/modalChangePassword';
import { useState } from 'react';
import { changePassword } from '../../../API/UserAPI';
import swalApp from '../../../Helpers/swalApp';
import { useNavigate } from 'react-router-dom';

const initPassword = {
  currentPassword: "",
  newPassword: ""
}
const initMessage = {
  currentPassword: "",
  newPassword: ""
}
const ModalChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState(initMessage);
  const [password, setPassword] = useState(initPassword);
  const handleCloseModal = (e) => {
    if(e.target === e.currentTarget)
    dispatch(closeModalChangePassword());
  }

  const handleChange = (e) =>{  
    setPassword({...password, [e.target.name]: e.target.value});
  }

  const handleChangePassword = async  () => {
    if(message.currentPassword 
      && message.newPassword 
      || (password.currentPassword.trim().length === 0 
      || password.newPassword.trim().length === 0) ) return;
    


      let res = await changePassword(password.currentPassword, password.newPassword);
      if(res.status !== 200){
        swalApp("error", res.message);
        return;
      }

      swalApp("success", res.message);
      dispatch(closeModalChangePassword());
  }
  return (
    <div className='ModalChangePassword position-fixed w-100 h-100 top-0 ' onClick={handleCloseModal}>
      <div className='modal_container p-4 text-dark rounded-4'>
        <header className='d-flex align-items-center justify-content-between fs-5'>
          <div className='fw-medium'><h3>Thay Đổi Mật Khẩu</h3></div>
          <div onClick={() => dispatch(closeModalChangePassword())}>
            <IoCloseSharp/>
          </div>
        </header>
        <main className='mt-4 d-flex flex-column gap-3'>
          <Input 
          type='password'
          label='Mât khẩu hiện tại:' 
          name={'currentPassword'} 
          setMessage={setMessage} 
          message={message.currentPassword}
          handleChange={handleChange}
          value={password.currentPassword}/>
          <Input 
          type='password'
          label='Mật khẩu mới: ' 
          name={'newPassword'} 
          setMessage={setMessage} 
          message={message.newPassword}
          handleChange={handleChange}
          value={password.newPassword}/>
        </main>
        <footer className='mt-4'>
          <div className='d-flex justify-content-center'>
            <button className='btn btn-primary' onClick={handleChangePassword}>Thay đổi</button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ModalChangePassword