import express , { Express, NextFunction, Request, Response } from "express";
import router from "./logic";
import Auth from "../middlewares/authorize";
import connection from "../models/myconnection";
import { join_posts_comments, search_posts_byId } from "../models/queries";
import { PostsManager } from "../ClassManager/post_manager";
import { loGout } from "../controllers/controller";

const myapp : Express = express();


myapp.get("/api/signup", (req: Request, res: Response) => {
    res.json({message : "sign up page"});
});
myapp.get("/api/login", (req: Request, res: Response) => {
    res.json({message : "login page"});
});
myapp.get("/api/auth" , Auth , (req : Request , res:Response) => {
    
    if(!req.user){
        res.status(401).json({
            message : 'unauthorized'
        })
        return;
    }

    res.status(200).json({
            message : 'authorized' , 
            user : req.user
    })
});
myapp.get("/api/profile" , Auth ,async (req:Request , res:Response) => {
    //if there is a user-object- logged then extract some information from it 
        if (!req.user) { 
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }   
        console.log(req.user.getUsername())
        try {
            const username = req.user.getUsername();
            const userInfo = await connection.getPool().query(`
SELECT myuser.username, 
posts.id, 
posts.content, 
posts.likes, 
posts.liked, 
posts.createdAt
FROM myuser 
INNER JOIN posts 
ON posts.user_id = myuser.id
WHERE myuser.username=$1` , [username])
    
            if(!userInfo){
                res.status(401).json({
                    message : 'unauthorized'
                })
            }
            const posts = userInfo.rows.map(
                item => ({
                    id:item.id ,
                    content: item.content ,
                    likes : item.likes , 
                    liked : item.liked ,
                    date : item.createdat
                }));
            console.log(posts)
            console.log(`retrieved userinfo: ${JSON.stringify(userInfo.rows)}`)
            console.log(`retrieved from postsmanage ${JSON.stringify(PostsManager.retrieveAllpost(req.user.getId()))}`);
            //load all posts for a specific user
            res.json({
                user : {
                    id : req.user.getId() ,
                    username : username,
                } , 
                message: `Welcome ${username}`,
                posts
            });
        } catch (error) {
            console.log(error)
        }

    });
myapp.get("/api/profile/myposts/:post_id", Auth , async(req:Request , res:Response , next:NextFunction):Promise<void> => {
    if(!req.user){
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    //extract post_id and retrieve the current post from Post Manager
    const {post_id} = req.params;
    // await PostsManager.loadPostComments(parseInt(post_id) , req.user.getId());

    const current_post = PostsManager.retrievePost_byPostId(parseInt(post_id));
    const mypost = await connection.getPool().query(search_posts_byId , [parseInt(post_id)])
    if (!current_post) {
         res.status(404).json({ message: 'No such post' });
         return;
        }
        //edw sunexizw
    if (mypost.rowCount===0) {
        res.status(404).json({ message: 'No such post' });
        return;
        }
    
    res.status(200).json({
        post : mypost.rows[0] , 
        
    })
});
myapp.get("/api/profile/myposts/:post_id/comments", Auth , async(req:Request , res:Response , next:NextFunction):Promise<void> => {
    if(!req.user){
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    //extract post_id and retrieve the current post from Post Manager
    const {post_id} = req.params;
    // await PostsManager.loadPostComments(parseInt(post_id) , req.user.getId());

    const current_post = PostsManager.retrievePost_byPostId(parseInt(post_id));
    
    if (!current_post) {
         res.status(404).json({ message: 'No such post' });
         return;
    }
    const result = await connection.getPool().query(join_posts_comments , [parseInt(post_id)]);
    if (result.rowCount === 0) {
        console.log('No comments found for this post');
        res.status(200).json({
            comments: [], // Return an empty array if no comments exist
        });
        return;
    }
    console.log('post comments'+result.rows)
    res.status(200).json({
    
        comments : result.rows
        
    })
});
myapp.get("/api/profile/logout", Auth, loGout);
myapp.use(router)

export default myapp;