import { Comments } from "./comments";


interface myPosts{
    getContent():string;
    getCreatedAt():Date;
    getId():number;
    getLikes():number;
    getLiked():boolean;
    getAuthor():number;
    getComments_of_post():Comments[];
}

export class Posts implements myPosts{
    private id:number;
    private static nextId = 1;
    private content : string;
    private createdAt : Date;
    private likes : number;
    private liked : boolean;
    private author : number;
    private comments_in_post : Comments[];//one to many post-comments

    constructor(content:string , userId:number){
        this.id = Posts.nextId++;
        this.content = content;
        this.createdAt = new Date();
        this.likes = 0;
        this.liked = false;
        this.author = userId;
        this.comments_in_post = [];
    }
    public getId(): number {
        return this.id;
    }
    public getContent(): string {
        return this.content;
    }
    public setContent(content:string){
        this.content = content;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public getLikes(): number {
        return this.likes;
    }
    public setLikes():void{
        this.likes++;
    }
    public getLiked(): boolean {
        return this.liked;
    }
    public setLiked():void{
        this.liked = !this.liked;
    }
    public getAuthor(): number {
        return this.author;
    }
    public addCommentPost(comment:Comments):void{
        this.comments_in_post.push(comment)
    }
    public getComment(commentId:number):Comments {
        const find = this.comments_in_post.find(item => item.getId() === commentId)
        if(!find){
            throw new Error('wrong comment id')
        }
        return find;
    }
    public getComments_of_post():Comments[]{
        return this.comments_in_post;
    }
}