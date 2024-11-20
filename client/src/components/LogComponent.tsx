import { useState } from "react";
import { useAuth } from "../Context/Auth_context";
import {  useNavigate } from "react-router-dom";

interface FormData {
    username : string , 
    password : string
}

export default function LoginPage(){
    
    const [data , setData] = useState<FormData>({
        username : '' ,
        password : ''
    })
    const [error , setError] = useState<string | null>(null);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        
        if (!data.username || !data.password) {
            setError('You need to fill both inputs');
            return;
        }
    
        try {
            // Fetch the login endpoint
            const loginResponse = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'  // Important for sending cookies
            });
    
            // Check if the login was successful
            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                setError(errorData.message || 'Login failed');
                return;
            }
    
            const result = await loginResponse.json();
            console.log('User successfully logged in:', result);
            
            if (loginResponse.ok) {
                login();
                navigate('/myprofile'); // Redirect after successful login
            }
    
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while signing in. Please try again.");
        }
    
        // Reset form data and error state
        setData({ username: '', password: '' });
        setError(null);
    }
    

    return(
        <div className="login_form" >
            <h1>Login form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                className="username" 
                name="username" 
                type="text"
                value={data.username}
                onChange={ (e:React.ChangeEvent<HTMLInputElement>) => setData({...data , username:e.target.value})}
                />
                <label htmlFor="password">Password</label>
                <input 
                className="password" 
                name="password" 
                type="password"
                value={data.password}
                onChange={ (e:React.ChangeEvent<HTMLInputElement>) => setData({...data , password:e.target.value})}
                />
                <button type="submit">Log in</button>
            </form>
            {error && <p>{error}</p>}
            <p>Already an account?<a href="/login">Sign-Up</a></p>
        </div>
    );
}