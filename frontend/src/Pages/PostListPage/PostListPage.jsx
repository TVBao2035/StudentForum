import React from 'react'
import { Post } from '../../Components'
import './PostListPageStyle.scss';
export default function PostListPage({ listPost }) {
  return (
    <div className='PostListPage'>
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
