import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoCreate } from 'react-icons/io5';
import { FaFacebookMessenger } from "react-icons/fa";
import logoIcon from '../../resources/img/logo.png';
import './HeaderStyle.scss';
import Avatar from '../Avatar';
import { ModalCreatePost } from '../Modal';

import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { logOut } from '../../API/UserAPI';
import { initialState, setDataMain } from '../../Redux/userSlice';

export default function Header() {
  const [showPostModal, setShowPostModal] = useState(false);
  const handleShow = () => setShowPostModal(true);
  const handleClose = () => setShowPostModal(false);

  const user = useSelector((state) => state.user);
  //console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user.token;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, đăng xuất!',
      cancelButtonText: 'Không, quay lại'
    });

    if (result.isConfirmed) {
      try {
        await logOut();
        dispatch(setDataMain(initialState));
        Swal.fire('Đã đăng xuất!', '', 'success');
        navigate('/login');
      } catch (error) {
        Swal.fire('Có lỗi xảy ra!', 'Vui lòng thử lại sau.', 'error');
      }
    }
  };

  // useEffect(() => {
  //   if (!token) {
  //     dispatch(setDataMain(initialState));
  //     navigate('/login');
  //   }
  // }, [token, dispatch, navigate]);

  return (
    <header className="Header">
      <div className='container d-flex justify-content-between align-items-center p-3 '>
        <div className="left-section d-flex align-items-center">
          <Link to="/" className="navbar-brand">
            <img src={logoIcon} alt="Forum Logo" className="logo-img" style={{ width: '50px' }} />
          </Link>
          <div className="search-bar ms-3">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Tìm kiếm trên diễn đàn..."
              style={{ width: '300px' }}
            />
          </div>
        </div>

        <div className="right-section d-flex align-items-center">
          <span className="user-greeting d-none d-md-block me-3 text-dark">Xin chào <strong>{user.name}</strong></span>

          <div className="nav-link me-3" onClick={handleShow} style={{ cursor: 'pointer' }}>
            <IoCreate className="icon-size" size={24} />
          </div>

          <Link to="/message" className="nav-link me-3">
            <FaFacebookMessenger className="icon-size" size={24} />
          </Link>

          <Link to={`/@${user.id}`}>
            <Avatar link={user.avatar} normal />
          </Link>

        </div>
      </div>

      <ModalCreatePost show={showPostModal} handleClose={handleClose} />
    </header>
  )
}
