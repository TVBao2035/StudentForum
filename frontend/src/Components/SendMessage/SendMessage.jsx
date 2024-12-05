import { useDispatch, useSelector } from 'react-redux';
import './SendMessageStyle.scss';
import { useEffect, useState } from 'react';
import { createComment, getComment } from '../../API/CommentAPI';
import { IoMdClose } from "react-icons/io";
import { resetComment, resetCommentId } from '../../Redux/postSlice';
import { IoSend } from "react-icons/io5";
const SendMessage = ({...style}) => {

    const dispatch = useDispatch();

    const user = useSelector(state => state.user);
    const comment = useSelector(state => state.post.comment);

    const [textComment, setTextComment] = useState("");
    const [askComment, setAskComment] = useState('');

    const handleChange = (e) => {
        setTextComment(e.target.value);
    }

    const handleCancleAsk = () => {
        dispatch(resetCommentId());
    }

    const handleSendComment = async () => {
        console.log({...comment, textComment, userId: user.id});
        let res = await createComment({
            userId: user.id,
            postId: comment.postId,
            commentId: comment.commentId,
            content: textComment
        });

        if(res.status === 200){
            dispatch(resetCommentId());
            setTextComment("");
            setAskComment("");
        }
    }
    const fetchApi = async (commentId) => {
        let res = await getComment(commentId);
        if(res.status === 200) {
            setAskComment(res.data);
            return;
        }
    }

    useEffect(() => {
        if (comment.commentId !== 0){
            fetchApi(comment.commentId);
        }
    }, [comment]);

  return (
    <div className={`SendMessage ${Object.keys(style).find(key => style[key]) }`}>
        {
            (comment.commentId !== 0 && comment.commentId !== null) &&
              <div className={`ask_comment p-2 rounded-3`}>
                <p>{askComment?.content}</p>
                <IoMdClose onClick={handleCancleAsk}/>
            </div>
        }
        <div className='d-flex px-2 gap-3'>
            <input 
                className={`form-control`}
                value={textComment}
                onChange={(e) => handleChange(e)}
            />
            <div className='d-flex  justify-content-center align-items-center'>
                <button onClick={handleSendComment} className='btn btn-primary'>
                    <IoSend/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default SendMessage