import { useEffect, useState } from 'react';
import { getAllCommentByPostId } from '../../API/CommentAPI';
import Comment from './Comment';
import './CommentStyle.scss';
import { useSelector } from 'react-redux';
const  ContaierComment = ({postId, ...style}) => {

  const [comments, setComments] = useState([]);

  const fetchApi = async () => {
    let res = await getAllCommentByPostId(postId);
    if(res.status === 200){
      setComments(res.data);
      return;
    }
    alert(res.message);
  }

  const commentRedux = useSelector(state => state.post.comment);
  console.log(commentRedux);
  useEffect(() => {
    fetchApi();
  }, [useSelector(state => state.post.like.changeLike), useSelector(state => state.post.comment)]);

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
        comments.map(comment => renderComments(comment, level))
      }
    </div>
  )
}

export default ContaierComment