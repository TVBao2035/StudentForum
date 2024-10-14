import React, { useEffect, useState } from 'react'
import { Avatar, Loading, Navbar } from '../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { getDetails } from '../../API/UserAPI';
import { setLoading, setLoadingOrther } from '../../Redux/loadingSlice';
import timeOut from '../../Helpers/timeOut';
import { Friend_Profile, Information_Profile, Post_Profile } from './Profile_Pages';
import './ProfileStyle.scss';
import { getFriendsByUserId } from '../../API/FriendAPI';
export default function Profile() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const loading = useSelector(state => state.loading);

  const [userDetails, setUserDetails] = useState(null);

  const id = location.pathname.split('/')[1].substring(1, location.pathname.split('/')[1].length);

  const getDetailsUser = async (userId) => {
    let res = await getDetails(userId);
    if (res.status === 200) {
      setUserDetails(res.data);
      await timeOut(800);
      dispatch(setLoadingOrther(false));
      return;
    }
    navigate('./');
  }

  const [listFriends, setListFriends] = useState([]);

  const getFriends = async (id) => {
    let res = await getFriendsByUserId(id);
    if (res.status === 200) {
      setListFriends(res.data);
      return;
    }

    if (res.status === 404) {
      alert(res.message);
      return;
    }
  }

  useEffect(() => {
    dispatch(setLoadingOrther(true));
    getDetailsUser(id);
    getFriends(id);
  }, [id]);
  
  useEffect(() => {
    getDetailsUser(id);
  }, [useSelector(state => state.post.like.changeLike)]);
  return (
    <div className='Profile px-5 mx-5 user-select-none'>
      {
        loading.isLoadingOrther ? (
          <Loading />
        ) : (
          <div className='container px-5 mx-5'>
            <div>
              <div className='d-flex justify-content-between align-items-center my-2'>
                <div className='d-flex align-items-center gap-3 fw-medium'>
                  <div>
                    <Avatar link={userDetails?.avatar} bigger />
                  </div>
                  <div>
                    <p className='fs-3 fw-bold'>{userDetails?.name ? userDetails?.name : "Loading..."}</p>
                      <p className='fs-6 '>{listFriends.length} người bạn</p>
                  </div>
                </div>
                <div>
                  {
                    user?.id == id &&
                    <div>
                      <button className='btn btn-secondary fw-medium d-flex align-items-center gap-1'>
                        <MdEdit />
                        <p>Chỉnh sửa</p>
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='col border-start border-top border-end p-3'>
                <Information_Profile 
                  email={userDetails?.email}
                  phone={userDetails?.phone} 
                />
                <hr />
                <Friend_Profile friends={listFriends} />
              </div>
              <div className='col-7 border-end border-top p-4 h-100'>
                  <Post_Profile listPost={userDetails?.Posts}/>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
