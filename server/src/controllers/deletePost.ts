import { Request , Response } from "express"
import { PostsManager } from "../ClassManager/post_manager";
import { search_posts , delete_post_byId } from "../models/queries";
import connection from "../models/myconnection";


// export function deletePost(req:Request , res:Response): Promise<void>{
    
//     if(!req.user){
//         res.status(401).json({
//             message:'Unauthorized'
//         });
//     }
//     const id = req.user.getId();

//     try {
//         const post = req.user.retrievePosts();
        
//     } catch (error) {
        
//     }
// }

export async function deletePost_api(req:Request , res:Response): Promise<void>{
    if(!req.user){
        res.status(401).json({
            message:'Unauthorized'
        });
    }
    const {post_id} = req.params;
    try {
        const current_post = PostsManager.retrievePost_byPostId(parseInt(post_id));
        console.log(current_post?.getId())
        if(!current_post){
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        PostsManager.deletePost(parseInt(post_id));

        const result = await connection.getPool().query(search_posts , [parseInt(post_id)]);

        if(result.rowCount === 0){
            res.status(404).json({ message: 'Post not found or already deleted' });
            return;
        }

        await connection.getPool().query(delete_post_byId , [parseInt(post_id)]);
        
        res.status(200).json({
            message : 'deleted'
        })

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }


}
