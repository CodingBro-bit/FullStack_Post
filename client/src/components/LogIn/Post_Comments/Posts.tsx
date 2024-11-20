import { Post} from "../../ProfileComponent";  // Rename imported Post to PostFromProfile
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../../redux/postSlice";
import { useAppDispatch } from "../../../redux/hooks";

//for every post , post component
interface PostComp{
    post : Post;
}

export default function Posts({post}:PostComp) {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    console.log(`TYPEOF :${post.date}`)
    console.log(JSON.stringify(post.date));
    const safeDate = new Date(post.date);

    if (isNaN(safeDate.getTime())) {
        console.error('Invalid date:', post.date);
        return <p>Invalid date</p>;
    }
    const handleClick = () => {
        navigate(`/myprofile/${post.id}`);
    }
    const handleDelete = async(postId:number) => {
        //need to fix it
        const response = await fetch("http://localhost:5000/api/profile/myposts" , {
            method : 'DElETE'  , 
            credentials : 'include' , 
            headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
            throw new Error('Failed to delete the post');
        }
        dispatch(deletePost(postId));
        console.log(`Post ${postId} deleted successfully`);
    }
    return (
        <div>
            <p>Content: {post.content}</p>
            <p>Likes: {post.likes}</p>
            <p>Date: {format(safeDate, 'yyyy-MM-dd HH:mm:ss')}</p>
            {/* <p>Date: {post.date}</p> */}
            <div>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
                <button>Edit</button>
                <button onClick={handleClick}>View post</button>
            </div>
        </div>
    );
}