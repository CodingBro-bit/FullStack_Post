
import { Posts } from "./posts";

interface myUser{
    getUsername() : string;
    getPassword() : string;
    getId():number;
}

export class User implements myUser{
    private id : number;
    private static nextId = 1;
    private username : string;
    private password : string;
    private posts : Posts[];//one to many with posts
   

    constructor(username:string){
        this.id = User.nextId++;
        this.username = username;
        this.password = ''
        this.posts = [];
    }
    public getId(): number {
        return this.id;
    }
    public getUsername():string{
        return this.username;
    }
    public setUsername(username:string):void{
        this.username= username;
    }
    public getPassword():string{
        return this.password;
    }
    public setPassword(password:string):void{
        this.password = password;
    }
    public addPosts(post:Posts):void{
        this.posts.push(post);
    }
    public deletePost(postId:number):void{
        this.posts = this.posts.filter(item => item.getId() !== postId);
    }
    public findPost(postId:number):Posts{

        const find = this.posts.find(item => item.getId() === postId);
        if(!find){
            throw new Error('wrong id post')
        }
        return find;
    }
    public retrievePosts():Posts[]{
        return this.posts;
    }
}