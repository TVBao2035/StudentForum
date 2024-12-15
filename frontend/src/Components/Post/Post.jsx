import './PostStyle.scss';
import Avatar from '../Avatar';
import { Fragment, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import timeFormat from '../../Helpers/timeFormat';
import ContaierComment from '../Comment/ContainerComment';
import { changeLike, resetComment, setComment } from '../../Redux/postSlice';
import SendMessage from '../SendMessage';
import { createLike, deleteLike } from '../../API/LikeAPI';
import handleColorApp from '../../Helpers/handleColorApp';

export default function Post(
    { id, userId, name, createdAt, content, avatar, image, category, like,...style}
) {
    const user = useSelector(state => state.user);
    const dispath = useDispatch();

    const [isOpenComment, setIsOpenComment] = useState(false);

    const userLiked = (like?.some(e => e.userId === user.id));

    const handleLike = async(postId) => {
        let res;
        if (userLiked){
            res = await deleteLike({userId: user.id, postId});
        }else{
            res = await createLike({userId: user.id, postId});
        }
        dispath(changeLike());   
    }

    const handleOpenComment = () => {
        if(isOpenComment){
            dispath(resetComment());
        }else{
            dispath(setComment({
                postId: id,
                commentId: 0
            }));
        }
        setIsOpenComment(!isOpenComment);
    }
  return (
    <div className='Post d-flex flex-column align-items-center'>
        <div className={` overflow-hidden block_main border p-2 pb-0 rounded-3 ${Object.keys(style)}`}>
            <header className='d-flex justify-content-between'>
                <div className='d-flex gap-1 align-items-center'>
                    <div className="d-block">
                        <Link to={`/@${userId}`}>
                              <Avatar normal link={avatar}/>
                        </Link>
                    </div>
                    <div>
                        <Link 
                            to={`/@${userId}`} 
                            className='fw-medium text-decoration-none'
                        >{name}</Link>
                        <p className='block_time'>{timeFormat(createdAt)}</p>
                    </div>
                </div>
                {
                    user.id == userId &&
                    <Link className='d-flex align-items-center justify-content-center block_edit' to={`/post/edit?postId=${id}`}>
                        <BsThreeDotsVertical/>
                    </Link>
                }
            </header>
            <main className='my-2'>
                {/* <div className='block_content'>{content}</div> */}
                <div className='block_content' dangerouslySetInnerHTML={{ __html: content }}></div>
                <div className='block_category'>#{category?.name}</div>
                {
                    image && 
                    <div className='block_image my-2'>
                        <img src={image} alt="" />
                    </div>
                }
            </main>
            <footer className='row border-top user-select-none'>
                <div 
                    className={`col btn_active p-1 d-flex align-items-center gap-1 justify-content-center 
                                ${userLiked ? "text-primary": ""}`
                            }
                    onClick={()=> handleLike(id)}
                >
                    <AiOutlineLike/>
                    <div className='d-flex '>
                        <p>{like?.length}</p>
                    </div>
                </div>
                <div onClick={handleOpenComment} className="col d-flex justify-content-center align-items-center btn_active p-1">
                    <FaRegComment/>
                </div>
            </footer>
        </div>
            {
              isOpenComment && 
                <Fragment>
                    <ContaierComment 
                        small={Object.keys(style).includes('small')} 
                        big={Object.keys(style).includes("big")} 
                        postId={id}
                    />
                    <SendMessage 
                        small={Object.keys(style).includes('small')}
                        big={Object.keys(style).includes("big")} 
                    />
                    <div className='text-primary' onClick={handleOpenComment}>
                        <FaChevronUp/>
                    </div>
                </Fragment>
            }
       
    </div>
  )
}
