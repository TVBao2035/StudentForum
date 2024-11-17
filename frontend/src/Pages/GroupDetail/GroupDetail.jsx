import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getDetailGroup } from '../../API/GroupAPI';
import { Avatar, Post } from '../../Components';
import { ListGroup } from 'react-bootstrap';
import { getAllPostByGroupId } from '../../API/PostAPI';
import { useSelector } from 'react-redux';
import GroupInvitation from '../GroupInvitation';

const GroupDetail = () => {
  const location = useLocation();
  const groupId = location.pathname.split("@")[1];

  const user = useSelector(state => state.user);
  const [inforGroup, setInforGroup] = useState();
  const [groupPosts, setGroupPosts] = useState([]);
  const [pageInvitation, setPageInvitation] = useState(false);

  const getGroup = async (groupId) => {
    let res = await getDetailGroup(groupId);
   setInforGroup(res.data);
  }

  const getGroupPosts = async(groupId) => {
    let res = await getAllPostByGroupId(groupId);
    setGroupPosts(res.data);
  }

  useEffect(()=> {
    getGroup(groupId);
    getGroupPosts(groupId);
  }, [groupId, useSelector(state => state.post.like.changeLike)])
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
                      if(index == 2){
                        return <p className='pb-1 text-dark'>{`+${parseInt(inforGroup?.groupuser?.length - 2)}`}</p>
                      }else if(index < 2){
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
            <div>
              <button 
                onClick={() => setPageInvitation(!pageInvitation)} 
                className='btn btn-primary'
              >
                {
                  pageInvitation ? `Xem bài đăng` : 'Xác nhận thành viên'
                }
              </button>
            </div>
          }
      </header>
      <body className='mt-3'>
        {
          pageInvitation ? 
            <GroupInvitation groupId={groupId}/> :
            <div>
              {
                groupPosts?.map(post => 
                  <Post
                        small key={`post-${post?.id}`} id={post?.id}
                        name={post?.User.name} avatar={post?.User.avatar}
                        userId={post?.User.id} content={post?.content}
                        image={post?.image} createdAt={post?.createdAt}
                        like={post?.Likes} category={post?.Category}
                  />)
              }
            </div>
        }
      </body>
      <footer className='mb-4'></footer>
    </div>
  )
}

export default GroupDetail