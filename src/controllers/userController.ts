import { Request,Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
    userService:UserService
    
    constructor(){
        this.userService = new UserService();
    }

    async create(req:Request,res:Response){
        const body = req.body;
       
        try{
            const user = await this.userService.create(body);
            res.send(user);
        }catch(err){
            res.status(500).send(err);
        }
    }
}