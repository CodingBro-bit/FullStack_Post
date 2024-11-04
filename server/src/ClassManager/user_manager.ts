import { User } from "../models/user";
import connection from "../models/myconnection";
import { PostsManager } from "./post_manager";
 

//singletton class for updating User

export class UserManager{
    private static users:Map<number , User> = new Map();

    static ManageUsers(id:number , username:string , password:string ){
        if(!UserManager.users.has(id)){
            const user = new User(username)
            user.setPassword(password)
            UserManager.users.set(id , user);

        }
        return UserManager.users.get(id);
    }
    static consoleUsers():void{
        UserManager.users.forEach(
            item => console.log(item.getId())
        )
    }
    static returnUsers(id:number):User|undefined{
        return UserManager.users.get(id);
    }
    static async  loadAllusers():Promise<UserManager|undefined>{
        const retrieve = await connection.getPool().query(`SELECT * FROM myuser`);
        console.log('retrieved users from db(USerManager): '+JSON.stringify(retrieve.rows))

        retrieve.rows.forEach(
            (item)=> UserManager.ManageUsers(
                item.id , item.username , item.password
            )
        )
        return UserManager.users;
    }
    static LoadUserPosts():void{
        UserManager.users.forEach( item => {
            const id = item.getId();
            const posts = PostsManager.retrieveAllpost(id)
            console.log('posts for loading: '+posts)
            if(!posts){
                return item;
            }
            for(let post of posts){
                item.addPosts(post)
            }
        })
    }
    
}