import { get } from "http";
import { Comments } from "../models/comments";
import connection from "../models/myconnection";
import { Posts } from "../models/posts";
import { get_comments_for_post, get_posts } from "../models/queries";
import { UserManager } from "./user_manager";

export class PostsManager{
    private static posts : Map<number , Posts> = new Map();

    //load posts
    static async loadPosts(){

        const retrieve = await connection.getPool().query(get_posts);
        console.log('retrieved posts from db(PostManager): '+JSON.stringify(retrieve.rows))
        if(retrieve.rows.length === 0){
            throw new Error('no posts db')
        }
        for(let post of retrieve.rows){
            const postId = post.id;
            const content = post.content;
            const user = post.user_id;

            if(!PostsManager.posts.has(postId)){
                const obj = new Posts(content , user);
                PostsManager.posts.set(postId , obj);
            }
        }
       
    }

    static consolePosts(){
        PostsManager.posts.forEach(
            item => console.log(item)
        )
    }

    static retrievePost_byPostId(postId:number):Posts|undefined{
        const post = PostsManager.posts.get(postId);
        
        return post;
    }

    static retrieveAllpost(userId:number): Posts[]|undefined{

            const user_posts : Posts[]= []

            PostsManager.posts.forEach(item => {
                if(item.getAuthor() === userId){
                    user_posts.push(item)
                }
            })
            return user_posts;
    }
    static async loadPostComments(postId:number , userId:number):Promise<void>{
        const result = await connection.getPool().query(get_comments_for_post , [postId]);
        console.log('coments for a post: '+result.rows)
        if(result.rows.length === 0){
            return;
        }
        PostsManager.posts.forEach(
            post => {
                // if(post.getAuthor() === userId){
                //     const user = UserManager.returnUsers(userId);
                //     if(!user){
                //         return;
                //     }
                //     post.addUsersInPost(user)
                // }
                if(post.getId() === postId){
                    for(let data of result.rows){
                        post.addCommentPost(data)
                    }
                }
            }
        )
    }
    static async addPostManager(postId:number , comment:Comments){
        PostsManager.posts.forEach(item => {
            if(item.getId() === postId){
                item.addCommentPost(comment);
            }
        })
    }
    static deletePost(postId : number):void{
            if(!PostsManager.posts.has(postId)){
                return;
            }
            PostsManager.posts.delete(postId);
            UserManager.LoadUserPosts();

    }
    static EditPosts(postId: number, content: string) {
        // Retrieve the post by postId
        const post = PostsManager.posts.get(postId);
    
        if (!post) {
            return;  // Post not found, exit the function
        }
    
        post.setContent(content);
    }
    

}