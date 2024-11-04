import express , { Express, NextFunction, Request, Response } from "express";
import router from "./logic";
import Auth from "../middlewares/authorize";
import connection from "../models/myconnection";
import { search_database } from "../models/queries";
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
            const userInfo = await connection.getPool().query(search_database , [username])
    
            if(!userInfo){
                res.status(401).json({
                    message : 'unauthorized'
                })
            }

            
            //load all posts for a specific user
            res.json({
                user: username,
                message: `Welcome ${username}`,
                posts: PostsManager.retrieveAllpost(req.user.getId())
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
    
    if (!current_post) {
         res.status(404).json({ message: 'No such post' });
         return;
        }
    
    if(!current_post){
        throw new Error('no such post')
    }
    res.status(200).json({
        post : current_post , 
        
    })
});
myapp.get("/api/profile/logout", Auth, loGout);
myapp.use(router)

export default myapp;