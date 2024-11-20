import { useEffect } from "react";
import { useAuth } from "../Context/Auth_context";
import Posts from "./LogIn/Post_Comments/Posts";
// import Comments from "./LogIn/Post_Comments/Comments";
import { fetchPosts } from "../redux/postSlice";
import { RootState } from "../redux/shop";
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useNavigate } from "react-router-dom";


export interface Post {
    id: number,
    content: string,
    likes: number,
    liked: boolean,
    date: string | Date,
    // author: number,
    // comments_in_post: []
}
export interface Comment {
    id: number,
    content: string,
    comment_author: number,
    likes: number;
    createdat: string | Date
}
export interface User {
    id: number,
    username: string
}
export interface UserData {
    user: User,
    message: string,
    posts: Post[];
}

export default function Profile() {

    const dispatch = useAppDispatch();
    const { posts, error, user, loading } = useAppSelector((state: RootState) => state.posts);
    const navigate = useNavigate();
    const { logout } = useAuth();


    useEffect(() => {
        dispatch(fetchPosts())
    }, [dispatch]);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/profile/logout', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response) {
                throw new Error('error on fetching');
            }
            const data = await response.json();
            logout();
            console.log(data.message)
        } catch (error) {
            console.log(error)
        }
    }
    console.log('posts ' + JSON.stringify(posts))
    console.log('uuser ' + user)
    if (error) return <h1>{error.toString()}</h1>

    const handleClick = () => {
        navigate('/myprofile/create');
    }
    return (
        <div>
            <h1>Profile Page</h1>
            <button onClick={handleClick}>Create post</button>
            {posts ? (
                <div key={crypto.randomUUID()}>
                    <p><strong>User:</strong> {user.username || "Username not available"}</p>
                    <p><strong>Posts:</strong></p>
                    {posts && posts.length > 0 ?
                        posts.map(
                            (post: Post) => 
                            {
                            console.log('date: '+post.date)
                            return(
                                <div>                                
                                <p key={crypto.randomUUID()}>No{post.id}</p>
                                <Posts key={post.id} post={post} />
                                                            
                                </div>
                            )}
                                                        
                       
                        )

                        :
                        <div>
                            No posts yet
                        </div>
                    }
                </div>
            ) : (
                loading && <p>Loading...</p>
            )}
            <button onClick={handleSubmit}>logout</button>
        </div>
    );
}
