import { Request,Response } from "express";

export class VideoController {

    constructor(){

    }

    upload(req:Request,res:Response){
        const file = req.file
        res.send()
    }
}