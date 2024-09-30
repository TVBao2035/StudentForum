import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { IoHomeSharp, IoCreate,  } from 'react-icons/io5';
import { FaFacebookMessenger } from "react-icons/fa";
import logoIcon from '../../resources/img/logo.png';
import './HeaderStyle.scss';
import Avatar from '../Avatar';
import { ModalCreatePost } from '../Modal';

export default function Header() {
  const [showPostModal, setShowPostModal] = useState(false);
  const handleShow = () => setShowPostModal(true);
  const handleClose = () => setShowPostModal(false);

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

        {/* <div className="middle-section d-none d-md-flex">
        <nav className="nav">
          <NavLink to="/" className="nav-link d-flex align-items-center">
            <IoHomeSharp className="nav-icon me-2" size={24} />
            Trang chủ
          </NavLink>
          <NavLink to="/categories" className="nav-link d-flex align-items-center">
            <IoIosListBox className="nav-icon me-2" size={24} />
            Danh mục
          </NavLink>
        </nav>
      </div> */}

        <div className="right-section d-flex align-items-center">
          <span className="user-greeting d-none d-md-block me-3">Xin chào <strong>Tên Người Dùng</strong></span>

          <div className="nav-link me-3" onClick={handleShow} style={{ cursor: 'pointer' }}>
            <IoCreate className="icon-size" size={24} />
          </div>

          <Link to="/message" className="nav-link me-3">
            <FaFacebookMessenger className="icon-size" size={24} />
          </Link>

          <Link to={"profile"}>
            <Avatar small />
          </Link>

          {/* <Dropdown className="ms-3">
              <Dropdown.Toggle id="dropdown-basic">
                <IoPersonCircle
                  className="avatar rounded-circle"
                  style={{ width: '40px' }}
                  size={40}
                />
              </Dropdown.Toggle> */}

          {/* <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Tài khoản</Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings">Cài đặt</Dropdown.Item>
                <Dropdown.Item as={Link} to="/donggop-ykien">Đóng góp ý kiến</Dropdown.Item>
                <Dropdown.Item as={Link} to="/chinhsach-baomat">Chính sách bảo mật</Dropdown.Item>
                <Dropdown.Item as={Link} to="/login">Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
        </div>
      </div>

      <ModalCreatePost show={showPostModal} handleClose={handleClose} />
    </header>


  );
};
