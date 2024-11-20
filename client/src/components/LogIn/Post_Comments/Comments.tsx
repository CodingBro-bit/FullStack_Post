import { Comment} from "../../ProfileComponent";  // Rename imported Comment to CommentFromProfile
import { format } from 'date-fns';

interface CommentComp{
    comment : Comment;
}

export default function Comments({comment}:CommentComp) {
    const safeDate = new Date(comment.createdat);
    console.log('safe dateeee '+JSON.stringify(comment))
    if (isNaN(safeDate.getTime())) {
        console.error('Invalid date:', comment.createdat);
        return <p>Invalid date</p>;
    }
    return (
        <div>
            <p>No {comment.id}</p>
            <p>Content: {comment.content}</p>
            <p>Likes: {comment.likes}</p>
            <p>Date: {format(safeDate, 'yyyy-MM-dd HH:mm:ss')}</p>
            <div>
                <button>Delete</button>
                <button>Edit</button>
            </div>
        </div>
    );
}