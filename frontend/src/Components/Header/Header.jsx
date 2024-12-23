import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoCreate } from 'react-icons/io5';
import { FaFacebookMessenger } from "react-icons/fa";
import logoIcon from '../../resources/img/logo.png';
import './HeaderStyle.scss';
import Avatar from '../Avatar';
import { ModalCreatePost } from '../Modal';

import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getAll, logOut } from '../../API/UserAPI';
import { initialState, setDataMain } from '../../Redux/userSlice';
import { useDebounce } from '../../Hooks';
import swalApp from '../../Helpers/swalApp';

export default function Header() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [listUsers, setListUsers] = useState([]);
  const debounce = useDebounce(searchValue, 600);

  const handleShow = () => setShowPostModal(true);
  const handleClose = () => setShowPostModal(false);
  const themesRedux = useSelector(state => state.themes);
  const user = useSelector((state) => state.user);
  const inputRef = useRef(null);
  const fetchApiSearch = async (value)=>{
    let res = await getAll(value, 5);
    if(res.status !== 200){
      swalApp("error", res.message);
      setListUsers([]);
      return;
    }
    setListUsers(res.data);
  }
  const handleClick =() => {
    setListUsers([]);
    setSearchValue("");
    inputRef.current?.focus();

  }
  useEffect(()=>{
    if(debounce.trim().length === 0) {
      setListUsers([]);
      return;
    }

    fetchApiSearch(debounce);
  }, [debounce]);
console.log(listUsers);

  return (
    <header className={`Header position-fixed top-0 w-100 ${themesRedux.isChangeThemes ? "themesDark" : "themesBright"}`}>
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
              ref={inputRef}
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
            <div className='position-relative'>
              <div className='position-absolute w-100 rounded-4 overflow-hidden pt-1'>
                {
                  listUsers.map(userItem => 
                  <Link to={`/@${userItem.id}`} onClick={handleClick} key={userItem.id} className='d-flex gap-2 align-items-center py-1 px-3 bg-white'>
                    <div>
                      <Avatar link={userItem.avatar} small />
                    </div>
                    <div>
                      <p className='text-dark'>{userItem.name}</p>
                    </div>
                  </Link>

                  )
                }
              </div>
            </div>
          </div>
        </div>

        <div className="right-section d-flex align-items-center">
          <span className="user-greeting d-none d-md-block me-3 ">Xin chào <strong>{user.name}</strong></span>

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
