
interface myComments{
    getId():number;
    getContent():string;
    getCreatedAt():Date;
    getCommentAuthor():number;
    getLikes():number;
    getLiked():boolean;
    getPostId():number;
}

export class Comments implements myComments{
    private id : number;
    private static nextId=1;
    private content : string;
    private createdAt : Date;
    private comment_author : number;//one to one with user
    private likes:number;
    private liked:boolean;
    private post_id : number;
    //post
    constructor(content:string , userId:number , postId:number){

        this.id = Comments.nextId++;
        this.content = content;
        this.createdAt = new Date();
        this.comment_author = userId;
        this.likes = 0;
        this.liked = false;
        this.post_id = postId;
    }
    public getPostId(): number {
        return this.post_id
    }
    public getLikes(): number {
        return this.likes;
    }
    public setLiked():void{
        this.likes++;
    }
    public getLiked(): boolean {
        return this.liked;
    }
    public getId(): number {
        return this.id;
    }
    public getContent(): string {
        return this.content;
    }
    public setContent(content:string):void{
        this.content = content;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public getCommentAuthor(): number {
        return this.comment_author;
    }
}