import { Request, Response } from "express";
import { PostsManager } from "../ClassManager/post_manager";
import connection from "../models/myconnection";
import { update_post } from "../models/queries";



export default async function EditPosts(req:Request , res:Response) {
    if(!req.user){

        res.status(401).json({
            message:'Unauthorized'
        });
    } 
    const {post_id} = req.params;
    const {content} = req.body;
    if (!content) {
        res.status(400).json({
            message: 'Content is required',
        });
        return ;
    }

    try {
        PostsManager.EditPosts(parseInt(post_id) , content);
        console.log(`executing query with ${content} ${parseInt(post_id)}`)
        const result = await connection.getPool().query(update_post , [content , parseInt(post_id)]);
        console.log('Query result:', result.rowCount);
        if(result.rowCount === 0){
            res.status(404).json({
                message: 'Post not found',
            });
            return;
        }
        res.status(200).json({
            message : 'updated' , 
            post : result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message : 'Internal Error'
        });
        return;
    }
}