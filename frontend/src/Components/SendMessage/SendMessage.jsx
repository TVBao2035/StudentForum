import { useDispatch, useSelector } from 'react-redux';
import './SendMessageStyle.scss';
import { useEffect, useState } from 'react';
import { getComment } from '../../API/CommentAPI';
import { IoMdClose } from "react-icons/io";
import { resetCommentId } from '../../Redux/postSlice';
import { IoSend } from "react-icons/io5";
const SendMessage = ({...style}) => {
    const comment = useSelector(state => state.post.comment);
    const [askComment, setAskComment] = useState('');
    const dispatch = useDispatch();
    const handleCancleAsk = () => {
        dispatch(resetCommentId());
    }

    const fetchApi = async (commentId) => {
        let res = await getComment(commentId);
        if(res.status === 200) {
            setAskComment(res.data);
            return;
        }
    }
    useEffect(() => {
        if (comment.commentId !== 0 || comment.commentId !== null){
            fetchApi(comment.commentId);
        }
    }, [comment]);
  return (
    <div className={`SendMessage ${Object.keys(style).find(key => style[key]) }`}>
        {
            (comment.commentId !== 0 && comment.commentId !== null) &&
            <div className={`ask_comment  p-2`}>
                <p>{askComment?.content}</p>
                <IoMdClose onClick={handleCancleAsk}/>
            </div>
        }
        <div className='d-flex px-3 gap-3'>
            <input className={`form-control`} />
            <div className=' text-center'>
                <button className='btn btn-primary'>
                    <IoSend/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default SendMessage