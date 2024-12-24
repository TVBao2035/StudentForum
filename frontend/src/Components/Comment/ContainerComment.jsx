import { useEffect, useState } from 'react';
import { getAllCommentByPostId } from '../../API/CommentAPI';
import Comment from './Comment';
import './CommentStyle.scss';
import { useSelector } from 'react-redux';
import swalApp from '../../Helpers/swalApp';
const  ContaierComment = ({postId, ...style}) => {

  const [comments, setComments] = useState([]);

  const fetchApi = async (postId) => {
    
    let res = await getAllCommentByPostId(postId);
    if(res.status === 200){
      setComments(res.data);
      return;
    }
   swalApp("error", res.message);
  }

  const commentRedux = useSelector(state => state.post.comment);

  useEffect(() => {
    if(postId)
    fetchApi(postId);
  }, [useSelector(state => state.post.like.changeLike), commentRedux]);

  useEffect(() => {
    if(postId)
    fetchApi(postId);
  }, [postId])
  let level = 5;
  const renderComments = (comment, level) => {
    level--;
    return <Comment
      key={`comment-${comment.id}`}
      userName={comment.User.name}
      userId={comment.User.id}
      avatar={comment.User.avatar}
      message={comment.content}
      likes={comment.Likes}
      commentId={comment.id}
      disableCommentButton={level === 0}
    >
      {
        comment.children.length && comment.children.map(e => renderComments(e, level))
      }
    </Comment>
  }
  return (
    <div className={`ContainerComment ${Object.keys(style).find(key => style[key]) }`}>
      {
        comments?.map(comment => renderComments(comment, level))
      }
    </div>
  )
}

export default ContaierComment