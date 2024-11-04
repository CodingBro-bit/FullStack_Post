import { useState } from "react";

interface FormData {
    username : string , 
    password : string
}

export default function Signupp():JSX.Element{

    const [data , setData] = useState<FormData>({
        username : '' ,
        password : ''
    })
    const [error , setError] = useState<string | null>(null);

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        console.log(data)
        if(!data.username || !data.password){
            setError('u need to fill both inputs')
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/signup' , 
                {
                    method : 'POST' , 
                    headers : {'Content-Type': 'application/json'} , 
                    body: JSON.stringify(data)
                }

            );
            if(!response){
                throw new Error('error on fetching');
            }
            const result = await response.json();
            console.log('user succesfully signed'+result)
        } catch (error) {
           
            console.error("Error:", error);
            setError("An error occurred while signing up. Please try again.");
            
        }
        setData({
            username:'' , 
            password:''
        });
        setError(null);
    }

    return(
        <div className="signup_form" >
            <h1>Sign-Up form</h1>
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
                <button type="submit">Sign in</button>
            </form>
            {error && <p>{error}</p>}
            <p>Already an account?<a href="/login">Log-in</a></p>
        </div>
    );
}