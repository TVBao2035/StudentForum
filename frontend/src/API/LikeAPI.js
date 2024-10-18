import axios from '../Configs/axios';

export const createLike = async({userId, postId=null, commentId=null})=> {
    return await axios.post('/like', {userId, postId, commentId});
}

export const deleteLike = async ({ userId, postId = null, commentId = null })=>{
    return await axios.delete(`/like?userId=${userId}&postId=${postId}&commentId=${commentId}`);
}