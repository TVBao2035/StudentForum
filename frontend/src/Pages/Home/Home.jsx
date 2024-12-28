import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Loading, Post } from '../../Components'
import { getAllPost } from '../../API/PostAPI'
import './HomeStyle.scss';

import timeOut from '../../Helpers/timeOut';
export default function Home() {
  const [listPost, setListPost] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApi = async () => {
    let res = await getAllPost();

    setListPost(res.data);
    await timeOut(300);
    setLoading();
    return;
  }

  useEffect(()=> {
    fetchApi();
  }, [useSelector(state => state.post.like.changeLike)]);

  if(!!loading) return <Loading/>;
  return (
    <div className='Home mb-5 pb-5'>
      <div className='container px-5 mx-5'>
        {
          listPost?.map(post => (
            <Post 
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
            />
          ))
        }
      </div>
    </div>
  )
}
