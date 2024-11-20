import { useState } from "react";

export default function CommentsInput({setMakeComm}): JSX.Element{
    
    const [content , setContent] = useState<string>('');
    
    return(
        <div>
            <label htmlFor="comment">Type your comment</label>
            <input 
            value={content}
            
            name="comment" 
            type="text"
            />
            <button >Save</button>
        </div>
    );
}