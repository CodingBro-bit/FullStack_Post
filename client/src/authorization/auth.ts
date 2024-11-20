




export default async function Auth(){
    
    try {
        const response = await fetch('http://localhost:5000/api/auth' , 
            {
                method:"GET" , 
                headers : {'Content-Type': 'application/json'} ,
                credentials: 'include'
            }
        );
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        console.log(response)
    } catch (error) {
        console.log(error)
    }
   
}