import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from 'date-fns';
import { Post } from "./ProfileComponent";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deletePost , editPost, fetchComments} from "../redux/postSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/shop";


export interface toEdit {
    content : string , 
    post_id : number , 
}

export default function ViewPost(){
    const {post_id} = useParams<{ post_id: string }>();
    const [loading , setLoading] = useState<boolean>(true);  
    const [post , setPost] = useState<Post | null>(null);
    const [isClicked , setIsClicked] = useState<boolean>(false);
    const [content , setContent] = useState<string>('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [makeComm , setMakeComm] = useState<boolean>(false);
    const { comments , loadingComm , errorComm} = useAppSelector( (state : RootState) => state.posts);
    const [comm , setComm] = useState<string>('');
    if(!post_id){
        throw new Error('not such id');
    }

    useEffect(
        () => {
            dispatch(fetchComments(parseInt(post_id)));
            async function Fetch(){
                try {
                    const response = await fetch(`http://localhost:5000/api/profile/myposts/${post_id}` , {
                       method : 'GET' , 
                       credentials : 'include' , 
                       headers : {'Content-Type': 'application/json' }
                    });
                    console.log(response)
                    if(!response){
                        throw new Error('error on fetching');
                    }
                    const data = await response.json();
                    console.log('mypost '+JSON.stringify(data.post))
                    setPost(data.post)
                } catch (error) {
                    console.log(error)
                }finally{
                    setLoading(false);
                }   
            }
            
            Fetch();
        } , [post_id]
    );
    const handleDelete = async (postId : number) => {
       
        const response = await fetch(`http://localhost:5000/api/profile/myposts/${post_id}` , {
            method : 'DElETE'  , 
            credentials : 'include' , 
            headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
            throw new Error('Failed to delete the post');
        }
        navigate('/profile');
        dispatch(deletePost(postId))
        console.log(`Post ${postId} deleted successfully`);
        
    }
    
    const handleSave = async (postId:number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/profile/myposts/${post_id}` , {
                method : 'PUT' , 
                credentials : 'include' , 
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({content})
            });
            if(!response.ok){
                throw new Error('error on response');
            }
            const edit: toEdit = {
                content : content , 
                post_id : postId
            }
            setIsClicked(!isClicked);
            dispatch(editPost(edit));
            
        } catch (error) {
            console.log(error);
        }
    }
    const handleSaveComments = async(postId:number) => {
        const response = await fetch(`http://localhost:5000/api/profile/myposts/${postId}/comments` , {
            method : 'POST' , 
            credentials : 'include' , 
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({comm})
        });
        if(!response.ok){
            throw new Error('error on post request for comments')
        }
        setMakeComm(true);
    }
    if(loading){
        return <h1>Loading post...</h1>;

    }
    if (!post) {
        return <h1>No post found</h1>;
    }

    const safeDate = new Date(post.date);
    return(
        <div>
        {
            isClicked === false ?
            <div>
                <p>Content: {post.content}</p>
                <p>Likes: {post.likes}</p>
                <p>Date: {format(safeDate, 'yyyy-MM-dd HH:mm:ss')}</p>
                <div>
                    <button onClick={() => handleDelete(parseInt(post_id))}>Delete</button>
                    <button onClick={() => setIsClicked(true)}>Edit</button>
                </div>
                <div>
                    <p>You can add your comments here</p>
                    <button onClick={() => setMakeComm(true)}>Create Comment</button>
                </div>
                {makeComm === true &&
                //form submitting new comment
                <div>
                    <label htmlFor="comment">Type your comment</label>
                    <input 
                    value={content}
                    onChange={ (e : React.ChangeEvent<HTMLInputElement>) => setComm(e.target.value)}
                    name="comment" 
                    type="text"
                    />
                    <button onClick={() => handleSaveComments(parseInt(post_id))}>Save</button>
                    <button onClick={() => setMakeComm(false)}>Exit</button>
                </div>}
                {comments.length === 0 ?
                <p>No comments yet</p>
                :
                comments.map(
                    item => <p>{item.content}</p>
                )}
            </div>
            :
            <div>
                <label htmlFor="content">Edit your post</label>
                <input className="content" name="content" type="text" onChange={ (e:React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}/>
                <button onClick={ () => handleSave(parseInt(post_id))}>Save</button>
                <button onClick={() => setIsClicked(false)}>Exit</button>

            </div>
        }
        </div>
    );
}