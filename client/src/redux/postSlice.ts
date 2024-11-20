import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import {  Post , UserData , Comment } from "../components/ProfileComponent";
import { toEdit } from "../components/ViewPost";


export const fetchPosts = createAsyncThunk('posts/fetchPosts' , async () =>{
    const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });
    if(!response.ok){
        throw new Error('error at response');
    }
    const data : UserData = await response.json();
    return data;
})
export const fetchComments = createAsyncThunk('comments/fetchComments' , async (postId:number) =>{
    const response = await fetch(`http://localhost:5000/api/profile/myposts/${postId}/comments`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });
    if(!response.ok){
        throw new Error('error at response');
    }
    const data  = await response.json();
   
    return data.comments as Comment[];
})


interface PostState {
    posts: Post[] , 
    user: {
        id: number;
        username: string;
    },
    message: string ,
    loading: boolean , 
    error: string | null , 
    comments : Comment [],
    loadingComm : boolean , 
    errorComm : string | null
}

const initialState: PostState = {
    posts: [],
    user: {
        id: 0,
        username: '',
    },
    message: '',
    loading: false,
    error: null, 
    comments : [] , 
    loadingComm: false,
    errorComm: null, 
};

const postSlice = createSlice({
    name : 'posts' , 
    initialState ,
    reducers:{
        deletePost: (state , action:PayloadAction<number>) =>{
            state.posts = state.posts.filter(item => item.id != action.payload)
        } , 
        addPost : (state , action:PayloadAction<Post>) => {
            state.posts = [...state.posts , action.payload]//or string?
        },
        editPost : (state , action:PayloadAction<toEdit>) => {
            const postId = action.payload.post_id;
            const content = action.payload.content;

            state.posts = state.posts.map(item => {
                if(item.id === postId){
                    return{
                        ...item , content
                    }
                }else{
                    return item;
                }
            });
            console.log(state.posts)
        }
    },
    extraReducers: builder => {
        builder.
        addCase(fetchPosts.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchPosts.fulfilled, (state, action: PayloadAction<UserData>) => {
            state.loading = false;
            state.posts = action.payload.posts;
            state.user = action.payload.user;
            state.message = action.payload.message;
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch posts';
        })
        //comments
        .addCase(fetchComments.pending , (state) => {
            state.loadingComm = true;
            state.errorComm = null 
        })
        .addCase(fetchComments.fulfilled , (state  , action : PayloadAction<Comment[]>) => {
            state.loadingComm = false;
            state.errorComm = null;
            state.comments = action.payload;
        })
        .addCase(fetchComments.rejected , (state , action) =>{
            state.loadingComm = false ;
            state.errorComm = action.error.message || 'Failed to fetch comments';
        })
    }
})

export const {deletePost , addPost , editPost} = postSlice.actions;
export default postSlice.reducer;


