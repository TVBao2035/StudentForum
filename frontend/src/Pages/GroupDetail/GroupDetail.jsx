import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getDetailGroup } from '../../API/GroupAPI';
import { Avatar, Post } from '../../Components';
import { ListGroup } from 'react-bootstrap';

const GroupDetail = () => {
  const location = useLocation();
  const groupId = location.pathname.split("@")[1];

  const [inforGroup, setInforGroup] = useState();

  const getGroup = async (groupId) => {
    let res = await getDetailGroup(groupId);
   setInforGroup(res.data);
  }

  useEffect(()=> {
    getGroup(groupId);
  }, [groupId])
  return (
    <div className='GroupDetail'>
      <header className='d-flex gap-2 align-items-center'>
          <div>
            <Avatar bigger link={inforGroup?.image} />
          </div>
          <div className='d-flex flex-column gap-1'>
            <div>
              <h5>{inforGroup?.name}</h5>
              <p>{inforGroup?.description}</p>
              <p>{`${inforGroup?.members.length} thành viên + ${inforGroup?.Posts.length} bài đăng trên nhóm`}</p>
            </div>
            <div className='d-flex gap-1 align-items-center'>
              {
                inforGroup?.members.map((member, index) => {
                  if(index == 2){
                    return <p className='pb-1 text-dark'>{`+${parseInt(inforGroup?.members?.length - 2)}`}</p>
                  }else if(index < 2){
                    return <Link to={`/@${member?.id}`}><Avatar key={`${member.avatar}-${index}`} small link={member.avatar} /></Link> 
                  }
                })
              }
            </div>
          </div>
      </header>
      <body>
        {
          inforGroup?.Posts.map(post => <Post
                                          small
                                          key={`post-${post?.id}`}
                                          id={post?.id}
                                          name={post?.User.name}
                                          avatar={post?.User.avatar}
                                          userId={post?.User.id}
                                          content={post?.content}
                                          image={post?.image}
                                          createdAt={post?.createdAt}
                                          like={post?.Likes}
                                          category={post?.Category}
                                         />)
        }
      </body>
      <footer className='mb-4'></footer>
    </div>
  )
}

export default GroupDetail