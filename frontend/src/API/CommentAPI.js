import axios from '../Configs/axios';

export const getAllCommentByPostId = async(postId)=>{
    return await axios.get(`/comment/post/${postId}`);
}

export const getComment = async (commentId) => {
    return await axios.get(`/comment/${commentId}`);
}