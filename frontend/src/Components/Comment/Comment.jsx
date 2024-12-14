import { useState } from 'react';
import './CommentStyle.scss';
import Avatar from '../Avatar';
import { AiOutlineLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createLike, deleteLike } from '../../API/LikeAPI';
import { changeLike, setComment } from '../../Redux/postSlice';

const Comment = ({children, userName, userId, message, avatar, likes, commentId, disableCommentButton}) => {
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const userLiked = (likes?.some(like => like.userId === user.id));
  const comment = useSelector(state => state.post.comment)

  const handleOpenComment = () => {
      dispatch(setComment({
        postId: comment.postId,
        commentId: commentId
      }));
  }

  const handleLike = async (commentId) => {
    let res;
    if (userLiked) {
      res = await deleteLike({ userId: user.id, commentId: commentId });
    } else {
      res = await createLike({ userId: user.id, commentId: commentId });
    }
    dispatch(changeLike());
  }
  return (
    <div className={`Comment mt-1 ps-3 ${showMore && 'border-start'}`} >
      <div className='d-flex gap-2'>
        <Link to={`/@${userId}`} className='d-flex justify-content-center align-items-center'>
          <Avatar normal link={avatar} />
        </Link>
        <div>
          <div>
            <p className='fw-medium fs-6'>{userName}</p>
          </div>
          <div className='fs-6'>
            <p>{message}</p>
          </div>
          <div className='d-flex gap-4'>
            <div 
              className={`d-flex align-items-center gap-1 ${userLiked ? "text-primary" : ""}`}
              onClick={() => handleLike(commentId)}
            >
              <AiOutlineLike/>
              <p>{likes?.length}</p>
            </div>
            {
              !disableCommentButton && 
              <div className='d-flex align-items-center' onClick={handleOpenComment}><GoComment /></div>
            }
            {
              children ? 
              <div className='fs-6' onClick={()=>setShowMore(!showMore)}>
                {
                  showMore ? (
                    <div className='d-flex align-items-center gap-1'>
                      <p>less</p>
                      <FaChevronUp/>
                    </div>
                  ):(
                    <div className='d-flex align-items-center gap-1'>
                      <p>more</p>
                      <FaChevronDown />
                    </div>
                  )
                }
              </div> : <div></div>
            }
          </div>
        </div>
      </div>
      <div className='ps-5 mt-3'>
        {
          showMore && children
        }
      </div>
    </div>
  )
}

export default Comment