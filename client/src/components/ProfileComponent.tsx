import { useEffect, useState } from "react";
import { useAuth } from "../Context/Auth_context";

interface Post {
    id : number , 
    content : string , 
    createdAt : Date , 
    likes : number , 
    liked : boolean , 
    author : number , 
    comments_in_post : []
}

interface UserData {
    user: string;
    posts: Post[];
}

export default function Profile() {
    const [mydata, setMydata] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {logout} = useAuth();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data: UserData = await response.json();
                setMydata(data);
                console.log('Fetched profile data:', data);
                console.log(typeof data.posts)
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user profile.");
            }
        };

        fetchUser();
    }, []);
    const handleSubmit = async()=>{
        try {
            const response = await fetch('http://localhost:5000/api/profile/logout', {
                method : 'GET' ,
                credentials : 'include' , 
                headers: { 'Content-Type': 'application/json' },
            });
            if(!response){
                throw new Error('error on fetching');
            }
            const data = await response.json();
            logout();
            console.log(data.message)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <h1>Profile Page</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {mydata ? (
                <div>
                    <p><strong>User:</strong> {mydata.user}</p>
                    <p><strong>Posts:</strong> {JSON.stringify(mydata.posts)}</p>
                    <button>View Item</button>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            ) : (
                <p>Loading profile data...</p>
            )}
            <button onClick={handleSubmit}>logout</button>
        </div>
    );
}
