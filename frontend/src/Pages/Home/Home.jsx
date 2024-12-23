import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Loading, Post } from '../../Components'
import { getAllPost } from '../../API/PostAPI'
import './HomeStyle.scss';
import Swal from 'sweetalert2';

import timeOut from '../../Helpers/timeOut';
export default function Home() {
  const [listPost, setListPost] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApi = async () => {
    let res = await getAllPost();

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
    setListPost(res.data);
    await timeOut(300);
    setLoading();
    return;
  }

  useEffect(()=> {
    fetchApi();
  }, [useSelector(state => state.post.like.changeLike)]);
  console.log(loading);
  if(!!loading) return <Loading/>;
  return (
    <div className='Home mb-5 pb-5'>
      <div className='container px-5 mx-5'>
        {
          listPost.map(post => (
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
