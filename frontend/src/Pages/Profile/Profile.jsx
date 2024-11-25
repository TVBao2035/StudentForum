import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit } from "react-icons/md";
import Swal from 'sweetalert2';

import { FriendListPage, PostListPage } from '../../Pages';
import { Avatar, FriendItem, InformationUserBar, Loading } from '../../Components'
import { getDetails } from '../../API/UserAPI';
import { setLoadingOrther } from '../../Redux/loadingSlice';
import timeOut from '../../Helpers/timeOut';
import { createInvitation, deleteFriend, deleteInvitation, getFriendsByUserId } from '../../API/FriendAPI';
import { getAllPostByUserId } from '../../API/PostAPI';
import './ProfileStyle.scss';
import { BsFillPersonPlusFill, BsFillPersonXFill, BsPersonCheckFill, BsPersonFillUp } from 'react-icons/bs';

export default function Profile() {
  
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const loading = useSelector(state => state.loading);

  const [userDetails, setUserDetails] = useState(null);
  const [listFriends, setListFriends] = useState([]);
  const [listPosts, setListPosts] = useState([]);

  const id = location.pathname.split('/')[1].substring(1, location.pathname.split('/')[1].length);


  const handleCallAPI = async (callBack, userId, friendId) => {
    let res = await callBack(userId, friendId);
    if(res.status !== 200){
      Swal.fire({
        title: "Thông Báo :v",
        text: res.message,
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        buttonsStyling: "blue",
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#dc3545",
        grow: 'row'
      });
      return;
    }
    handleGetData(getFriendsByUserId, id, setListFriends);
    getDetailsUser(id);
  }

  const handleGetData = async (callAPI, paramId, setState ) => {
    let res = await callAPI(paramId);

    if(res.status !== 200){
      Swal.fire({
        title: "Thông Báo :v",
        text: res.message,
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        buttonsStyling: "blue",
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#dc3545",
        grow: 'row'
      });
      return;
    }

    setState(res.data);
    return;
  }

  const getDetailsUser = async (userId) => {
    let res = await getDetails(userId);
    if (res.status === 200) {
      setUserDetails(res.data);
      await timeOut(800);
      dispatch(setLoadingOrther(false));
      return;
    }

    if(res.status === 404){
      Swal.fire({
        title: "Thông Báo :v",
        text: res.message,
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        buttonsStyling: "blue",
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#dc3545",
        grow: 'row'
      });
      return;
    }
  }


  useEffect(() => {
    dispatch(setLoadingOrther(true));
    getDetailsUser(id);
    handleGetData(getFriendsByUserId, id, setListFriends);
    handleGetData(getAllPostByUserId, id, setListPosts);
  }, [id]);
  
  useEffect(() => {
    handleGetData(getAllPostByUserId, id, setListPosts);
  }, [useSelector(state => state.post.like.changeLike), useSelector(state => state.post.comment)]);

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
                    userDetails?.isOwner ?
                      <div>
                        <Link to="../account" className='btn btn-outline-info fw-medium d-flex align-items-center gap-1'>
                          <MdEdit />
                          <p>Chỉnh sửa</p>
                        </Link>
                      </div>
                    :
                    userDetails?.isFriend ? 
                      <div className='d-flex gap-2'>
                        <button 
                        className='btn btn-outline-primary fw-medium d-flex align-items-center gap-1'
                        >
                          <BsPersonCheckFill/>
                          <p>Đã là bạn bè</p>
                        </button>

                        <button
                          className='btn btn-outline-danger fw-medium d-flex align-items-center gap-1'
                          onClick={() => handleCallAPI(deleteFriend, user.id, id)}
                        >
                          <BsFillPersonXFill />
                          <p>Xóa bạn bè</p>
                        </button>
                      </div> 
                    :
                    userDetails?.isSending ?
                      <div>
                        <button 
                        className='btn btn-outline-warning fw-medium d-flex align-items-center gap-1'
                        onClick={() => handleCallAPI(deleteInvitation, user.id, id)}
                        >
                          <BsPersonFillUp />
                          <p>Hủy yêu cầu</p>
                        </button>
                      </div>
                    :
                    userDetails?.isWaitAccept ?
                      <div className='d-flex gap-2'>
                        <button 
                        className='btn btn-outline-success fw-medium d-flex align-items-center gap-1'
                        onClick={() => console.log("Waiting merge git")}
                        >
                          <BsPersonCheckFill />
                          <p>Chấp nhận</p>
                        </button>

                        <button
                          className='btn btn-outline-warning fw-medium d-flex align-items-center gap-1'
                          onClick={() => handleCallAPI(deleteInvitation, id, user.id)}
                        >
                          <BsFillPersonXFill />
                          <p>Không chấp nhận</p>
                        </button>
                      </div>
                    :
                      <div>
                        <button 
                        className='btn btn-outline-success fw-medium d-flex align-items-center gap-1'
                        onClick={() => handleCallAPI(createInvitation, user.id, id)}
                        >
                          <BsFillPersonPlusFill />
                          <p>Thêm bạn bè</p>
                        </button>
                      </div>
                  }
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='col border-start border-top border-end p-3'>
                  <InformationUserBar
                  email={userDetails?.email}
                  phone={userDetails?.phone} 
                />
                <hr />
                <FriendListPage>
                  {
                    listFriends.map(friend => <FriendItem 
                                              id={friend.yourFriend.id} 
                                              name={friend.yourFriend.name}
                                              avatar={friend.yourFriend.avatar} />)
                  }
                </FriendListPage>
              </div>
              <div className='col-7 border-end border-top p-4 h-100'>
                <PostListPage listPost={listPosts}/>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}



