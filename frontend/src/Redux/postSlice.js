import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    like: {
        changeLike: 0
    },
    comment: {
        postId: null,
        commentId: 0,
        changeComment: 0
    }
}

export const postSlice = createSlice({
    name: 'post',
    initialState: initialState,
    reducers: {
        changeLike: (state, action) => {
            state.like.changeLike += 1;
        },
        setComment: (state, action) => {
            state.comment.postId = action.payload.postId;
            state.comment.commentId = action.payload.commentId;
        },
        resetCommentId: (state, action) => {
            state.comment.commentId = 0;
            state.comment.changeComment += 1;
        },
        resetComment: (state, action) => {
            state.comment.postId = null;
            state.comment.commentId = 0;
        }
    }
});

export const { changeLike, setComment, resetComment, resetCommentId } = postSlice.actions;

export default postSlice.reducer;