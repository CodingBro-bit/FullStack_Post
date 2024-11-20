import { Request, Response,NextFunction , CookieOptions } from "express";
import connection from "../models/myconnection";
import { insert_to_comments, insert_to_database, insert_to_posts, search_byId_database, search_database, search_database_forId, search_posts, search_posts_byId } from "../models/queries";
import bcrypt, { compare } from 'bcrypt'
import jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
import { Posts } from "../models/posts";
import { UserManager } from "../ClassManager/user_manager";
import { Comments } from "../models/comments";
import { PostsManager } from "../ClassManager/post_manager";
import { wss } from "..";

dotenv.config();

//sign up function
export async function signUp(req: Request , res:Response , next:NextFunction):Promise<void> {
    const {username , password}  = req.body;
    try {
        if(!username || username.trim()===''){
            res.status(400).json({ message: 'Username content cannot be empty' });
            return;
        }
        if(!password || password.trim()===''){
            res.status(400).json({ message: 'Password content cannot be empty' });
            return;
        }
        const retrieve = await connection.getPool().query(search_database , [username])
        
        if(retrieve.rows.length>0){
            res.status(401).json({
                message : 'already exists'
            })
            return;
        } 
        const hpassword = await bcrypt.hash(password , 10)
      

        const result = await connection.getPool().query(insert_to_database , [username , hpassword]);
    
        res.status(200).json({
            message : 'user created' , 
            data : result.rows[0]
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message : 'Internal error' , 
           
        })
    }
}
//login function
export async function loGin(req :Request , res:Response , next:NextFunction): Promise<void> {
    const {username , password}  = req.body;
    try {
        if(!username || username.trim()===''){
            res.status(400).json({ message: 'Username content cannot be empty' });
            return;
        }
        if(!password || password.trim()===''){
            res.status(400).json({ message: 'Password content cannot be empty' });
            return;
        }
        const retrieve = await connection.getPool().query(search_database , [username])
        if(retrieve.rows.length === 0){
            res.status(404).json({
                message : 'user not found'
            })
        }
        await PostsManager.loadPosts();
        await UserManager.loadAllusers();
        
        PostsManager.consolePosts();
        //after login load all users from db
        UserManager.LoadUserPosts();
 
        //get the logged user for initializing a token
        const loged_user = UserManager.returnUsers(retrieve.rows[0].id)
        if(!loged_user){
            res.status(404).json({
                message : 'user not found'
            })
            return;
        }
        const posts = PostsManager.retrieveAllpost(loged_user.getId())
        if(!posts){
            res.status(404).json({
                message : 'no posts for this user'
            })
            return;
        }
        for(let post of posts){
            await PostsManager.loadPostComments(post.getId() , loged_user.getId())
        }
        console.log('loged one: '+JSON.stringify(loged_user))
        console.log(loged_user?.retrievePosts())
        

        if(!retrieve){
            res.status(404).json({
                message : 'username does not exists'
            })
            return;
        }
        const match = await compare(password , retrieve.rows[0].password);
        if(!match){
            res.status(401).json({
                message : 'passwords does not match'
            })
            return;
        }
        const secret = process.env.SECRET;
        if (!secret) {
            throw new Error("Secret key is not defined in environment variables.");
        }
        
        const token = jwt.sign({userId:loged_user.getId()} , secret ,  {expiresIn:'50s'});
        
        const options: CookieOptions = {
            maxAge: 20 * 60 * 1000, // expires in 20 minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true, // Set this to true if using HTTPS
            sameSite: "none", // Use the string literal for sameSite correctly
        };
        res.cookie('token' , token , options);
        
        res.status(200).json({
            message: 'Login successful',
            token, 
        });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

export async function loGout(req:Request , res:Response , next:NextFunction){
    
    if(!req.user){
        res.status(401).json({
            message : 'Unauthorized'
        });
        return;
    }
    
    res.clearCookie('token')
    res.status(200).json({
        message : 'cookie deleted',
        redirect : '/login'
    })
}
    
export async function createPosts(req : Request , res: Response , next : NextFunction):Promise<void>{
    //create Post
    const {content} = req.body;
    console.log(req.user)
    //get and the content from body and  if the loged user exists proceed
        if(!req.user){
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        try {

            if(!content || content.trim()===''){
                res.status(400).json({ message: 'Content cannot be empty' });
                return;
            }
            
            //retrieve userinfo from db
            const userInfo = await connection.getPool().query(search_byId_database, [req.user.getId()])
            console.log(userInfo.rows)
            if(userInfo.rows.length === 0){
                res.status(401).json({
                    message : "unauthorized"
                })
                return;
            }
            //get the id
            const userId = userInfo.rows[0].id;
            //get from those who are already saved
            const authorized = UserManager.returnUsers(userId);
            //create new post
            const post = new Posts(content , userId);
            authorized?.addPosts(post)
            //add posts
            console.log(authorized?.retrievePosts())
            console.log(UserManager.returnUsers(req.user.getId()))
            //insert to db
            const result = await connection.getPool().query(insert_to_posts , [content , userId]);
            if(result.rows.length>0){
                res.status(200).json({
                    message : 'post created' , 
                    user : {
                        id : req.user.getId() , 
                        username : req.user.getUsername()
                    } ,
                    posts : req.user.retrievePosts(),
                    redirect : '/api/profile'
                })
            // wss.clients.forEach(
            //     client => {
            //         if(client.readyState === client.OPEN){
            //             client.send(
            //                 JSON.stringify(
            //                     {
            //                         id:result.rows[0] , 

            //                     }
            //                 )
            //             )
            //         }
            //     }
            // );
            }else {
                res.status(500).json({ message: "Failed to create post" });
                return;
            }
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
   
}

export async function createComments(req:Request , res:Response , next:NextFunction):Promise<void>{
   
    //get the content and the /:id from the url
    const {comment} = req.body;
    if(!comment || comment.trim()===''){
        res.status(400).json({ message: 'Comment cannot be empty' });
        return;
    } 

    const {post_id} = req.params;
    if (!post_id || isNaN(parseInt(post_id))) {
        res.status(400).json({ message: 'Invalid post ID' });
        return;
    }
    console.log('number of post: '+post_id)
    //if the loged user exists proceed
    if(!req.user){
        res.status(401).json({
            message : 'unauthorized'
        })
        return;
    }

    try {
          
        //get the userpost_id
        const userId = req.user.getId();
        console.log('users id '+userId)
        const retrieve_post = await connection.getPool().query(search_posts,[post_id])
        //see if the post exists, with the user_id
        if(retrieve_post.rows.length === 0){
            res.status(404).json({
                message : 'not found post'
            })
            return;
        }
        //create new comment instance
        const new_comment = new Comments(comment , userId , retrieve_post.rows[0].id);
        PostsManager.addPostManager(parseInt(post_id) , new_comment)
      
        //insert to db
        const result = await connection.getPool().query(insert_to_comments,[comment , userId , retrieve_post.rows[0].id])
        
        if (result.rows.length > 0) {
            
            res.status(200).json({
                message: 'Comment created',
                //allaksa content se comments
                comment: { id: result.rows[0].id, comment , postId: post_id, userId },
                
            });
        }else {
            res.status(500).json({ message: "Failed to create post" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });        
    }

}