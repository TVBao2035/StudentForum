import React from 'react'
import Avatar from '../Avatar'
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import './PostStyle.scss';
import { Link } from 'react-router-dom';
import timeFormat from '../../Helpers/timeFormat';
export default function Post(
    { userId, name, createdAt, content, avatar, image,...style}
) {

  return (
    <div className='Post'>
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
                            className='fw-medium text-decoration-none text-dark'
                        >{name}</Link>
                        <p className='block_time text-secondary'>{timeFormat(createdAt)}</p>
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-center block_edit'>
                    <BsThreeDotsVertical/>
                </div>
            </header>
            <main className='my-2'>
                <div className='block_content'>{content}</div>
                {
                    image && 
                    <div className='block_image my-2'>
                        <img src={image} alt="" />
                    </div>
                }
            </main>
            <footer className='row border-top'>
                <div className="col text-center btn_active p-1">
                    <AiOutlineLike/>
                </div>
                <div className="col text-center btn_active p-1">
                    <FaRegComment/>
                </div>
            </footer>
        </div>
    </div>
  )
}
