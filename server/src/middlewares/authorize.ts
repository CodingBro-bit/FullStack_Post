import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserManager } from "../ClassManager/user_manager";




export default async function Auth(req:Request, res:Response , next:NextFunction):Promise<void>{

   try {
        const cookie = req.headers.cookie?.split('=');
        if(cookie){
            const token = cookie[1];
            const secret = process.env.SECRET;

            if (!secret) {
                throw new Error("Secret key is not defined in environment variables.");
            }
            
            const decoded = jwt.verify(token ,secret) as JwtPayload
            console.log("decoded token: "+JSON.stringify(decoded))
            const {userId} = decoded;
            const authorized = UserManager.returnUsers(userId);
            if(authorized === undefined){
                throw new Error('user does not exists')
            }
            req.user = authorized
            next();
        }
       
   } catch (error) {
        console.log(error)
   }
}