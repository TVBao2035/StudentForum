import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import { deleteGroup, deleteGroupInvitation, getDetailGroup, updateStateGroupInvitation } from '../../API/GroupAPI';
import { Avatar, FriendItem, Navbar, Post } from '../../Components';
import { getAllPostByGroupId } from '../../API/PostAPI';
import { useDispatch, useSelector } from 'react-redux';
import {FriendListPage, GroupInvitation, PostListPage} from '../../Pages';
import { AiOutlineUserDelete } from 'react-icons/ai'
import { openModalUpdateGroup } from '../../Redux/modalGroupSlice';

const GroupDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location.pathname.split("/")[2].split("@")[1];
  const user = useSelector(state => state.user);
  const [inforGroup, setInforGroup] = useState();
  const [groupPosts, setGroupPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const getGroup = async (groupId) => {
    let res = await getDetailGroup(groupId);
    setInforGroup(res.data);
  }

  const getGroupPosts = async(groupId) => {
    let res = await getAllPostByGroupId(groupId);
    setGroupPosts(res.data);
  }

  const handleAcceptInvitation = async (invitationId, callBack) => {
    let res = await updateStateGroupInvitation(invitationId);
    if (res.status !== 200) {
      alert("Error");
      return;
    }
    getGroup(groupId);
    callBack(groupId)
  }

  const handleDeleteInvitation = async (invitationId, callBack) => {
    let res = await deleteGroupInvitation(invitationId);
    if (res.status !== 200) {
      alert("Error");
      return;
    }
    getGroup(groupId);
    callBack(groupId)
  }

  const handleDeleteMember = async (invitationId) => {
    let res = await deleteGroupInvitation(invitationId);
    if (res.status !== 200) {
      alert("Error");
      return;
    }
    getGroup(groupId);
  }

  const changePage = (number) => {
    setPageNumber(number)
  }

  const handleSelect = async (e) => {
    console.log(e.target.value);
    if(Number(e.target.value) === 1){
      dispatch(openModalUpdateGroup({
        id: inforGroup.id,
        name: inforGroup.name,
        image: inforGroup.image,
        description: inforGroup.description,
      }))
      e.target.value = 0;
    }else if(Number(e.target.value) === 2){
      let res = await deleteGroup(inforGroup.id);
      if(res.status !== 200){
        alert("Error");
        e.target.value = 0;
        return ;
      }

      navigate("/group/discover")
    }
  }

  const listItems = [
    {
      id: 1,
      title: 'Bài đăng của nhóm',
      type: `text`,
      onClick:() => changePage(1)
    },
    {
      id: 2,
      title: 'Duyệt thành viên',
      type: `text`,
      onClick: () => changePage(2)
    },
    {
      id: 3,
      title: "Thành Viên",
      type: 'text',
      onClick: () => changePage(3)
    }
  ]

  useEffect(()=> {
    getGroup(groupId);
    getGroupPosts(groupId);
  }, [
    groupId, 
    useSelector(state => state.post.like.changeLike),
    useSelector(state => state.modal.modalGroup),
  ])
  return (
    <div className='GroupDetail'>
      <header className='d-flex gap-2 align-items-center justify-content-between'>
          <div className='d-flex  gap-2 align-items-center'>
            <div>
              <Avatar bigger link={inforGroup?.image} />
            </div>
            <div className='d-flex flex-column gap-1'>
              <div>
                <h5>{inforGroup?.name}</h5>
                <p>{inforGroup?.description}</p>
                <p>{`${inforGroup?.groupuser.length} thành viên + ${groupPosts?.length} bài đăng trên nhóm`}</p>
              </div>
              <div className='d-flex gap-1 align-items-center'>
                {
                  inforGroup?.groupuser.map((member, index) => {
                    let displayMaxUser = 3;
                    if (index === displayMaxUser){
                      return <p className='pb-1 text-dark'>{`+${parseInt(inforGroup?.groupuser?.length - displayMaxUser)}`}</p>
                    } else if (index < displayMaxUser){
                        return <Link 
                                  key={`${member.invitation.avatar}-${index}`} 
                                  to={`/@${member?.invitation.id}`}
                                >
                                  <Avatar 
                                    small link={member.invitation.avatar} 
                                  />
                                </Link> 
                      }
                  })
                }
              </div>
            </div>
          </div>
          {
            inforGroup?.captain.id === user?.id &&
            <select onChange={(e)=> handleSelect(e)}>
              <option value={0}>
                <p>Cài đặt</p>
              </option>
              <option value={1}>
                  <p>Chỉnh sửa thông tin</p>
              </option>
              <option value={2}>
                  <p>Xoá nhóm</p>
              </option>
            </select>
          }
      </header>
      <body className='mt-3'>
        <div className='mb-3'>
          <Navbar active={pageNumber} listItems={listItems} horizontal /> 
        </div>
        <div >
          {
            pageNumber === 2 && inforGroup?.captain.id === user?.id ?
              <GroupInvitation 
                handleAcceptInvitation={handleAcceptInvitation}
                handleDeleteInvitation={handleDeleteInvitation}
                groupId={groupId}/> :
              pageNumber === 2 &&
              <div>Bạn không phải là trưởng nhóm </div>
             
          }

          {
            pageNumber === 1 &&
            <div className='px-5 mx-5'>
              <PostListPage listPost={groupPosts} />
            </div>
          }

          {
            pageNumber === 3 &&
            <FriendListPage>
              {
                inforGroup.groupuser.map(member =>  
                <FriendItem
                  icon={
                    inforGroup?.captain.id === user?.id
                    && inforGroup?.captain.id !== member.invitation.id
                    && <AiOutlineUserDelete />}
                  avatar={member.invitation.avatar}
                  name={member.invitation.name}
                  id={member.invitation.id}
                  onClick={inforGroup?.captain.id !== member.invitation.id
                    && inforGroup?.captain.id === user?.id ?
                    () => handleDeleteMember(member.invitation.id) : () => { }}
                />)
              }
            </FriendListPage>
          }

        </div>
      </body>
      <footer className='mb-4'></footer>
    </div>
  )
}

export default GroupDetail