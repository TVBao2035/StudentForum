import React from 'react'
import { Post } from '../../../../Components'

export default function Post_Profile({listPost}) {
  return (
    <div className='Post_Profile'>
      {
        listPost?.map(post => (
          <Post 
            big
            userId={post?.User.id}
            name={post?.User.name}
            avatar={post?.User.avatar}
            createdAt={post?.createdAt}
            image={post?.image}
            content={post?.content}
          />
        ))
      }
    </div>
  )
}
