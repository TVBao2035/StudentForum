import React from 'react'
import { Post } from '../../../../Components'
import './Post_Profile_Style.scss';
export default function Post_Profile({listPost}) {
  return (
    <div className='Post_Profile'>
      {
        listPost?.map(post => (
          <Post 
            key={`post-${post?.id}`}
            big
            id={post?.id}
            userId={post?.User.id}
            name={post?.User.name}
            avatar={post?.User.avatar}
            createdAt={post?.createdAt}
            image={post?.image}
            content={post?.content}
            like={post?.Likes}
            category={post?.Category}
          />
        ))
      }
    </div>
  )
}
