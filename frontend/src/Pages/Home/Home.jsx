import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Post } from '../../Components'
import { getAllPost } from '../../API/PostAPI'

export default function Home() {
  const [listPost, setListPost] = useState([]);
  const fetchApi = async () => {
    let res = await getAllPost();
    if(res.status === 200){
      setListPost(res.data);
    }
  }

  useEffect(()=> {
    fetchApi();
  }, [])
  return (
    <div className='Home mb-5 pb-5'>
      <div className='container px-5 mx-5'>
        {
          listPost.map(post => (
            <Post 
              key={`post-${post?.id}`} 
              small
              name={post?.User.name}
              avatar={post?.User.avatar}
              userId={post?.User.id}
              content={post?.content}
              image={post?.image}
              createdAt={post?.createdAt}
            />
          ))
        }
      </div>
    </div>
  )
}
