import {  useState } from "react";
import { addPost } from "../../redux/postSlice";
import { useAppDispatch} from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
// import { UserData } from "../ProfileComponent";

export default function NewPost(){
    
    const [content , setContent] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/profile/myposts' , {
                method:'POST' , 
                credentials : 'include' , 
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({content}) 
            }); 
            
            if(!response.ok){
                throw new Error('Error on post')
            }
           
            const data  = await response.json();
            const posts_array = data.posts;
            const newpost = posts_array[posts_array.length-1];
            console.log(data)
            if(data.redirect){
                navigate('/myprofile');
            }
            console.log('content send to backend')
            dispatch(addPost(newpost))
                   
        
        } catch (error) {
            console.log(error)
        }     
    }
    return(
            <div className="create_post">
                <h1>Create Post Form</h1>
                <form method="POST" onSubmit={handleSubmit}>
                    <label htmlFor="conent">Post your thoughts</label>
                    <input 
                    className="content"
                    name="content" 
                    type="text"
                    value={content}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                    />
                    <button type="submit">Create</button>
                </form>
            </div>
    );
}