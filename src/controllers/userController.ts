import { Request,Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
    constructor(private userService:UserService){}

    async create(req:Request,res:Response){
        const body = req.body;       
        try{
            const user = await this.userService.create(body);
            res.send(user);
        }catch(err){
            res.status(500).send(err);
        }
    }

    async signIn(req:Request,res:Response){
        const body = req.body;
       
        try{
            const result = await this.userService.signIn(body);
            res.send(result);
        }catch(err){
            res.status(500).send(err);
        }
    }
}