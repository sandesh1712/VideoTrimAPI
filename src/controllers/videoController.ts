import { Request,Response } from "express";
import { VideoService } from "../services/videoService";
import { UploadedFile } from "../types/file.type";
export class VideoController {
    videoService:VideoService
    
    constructor(){
       this.videoService = new VideoService;
    }

    async upload(req:Request,res:Response){
        const file:UploadedFile = req.file
        
        const data = req.body
        
        try{
            const result = await this.videoService.createAndUpload(data,file);
            res.send(result)
        }catch(err){
            res.send(err);
        }        
    }

    async getPresignedUrl(req:Request,res:Response){
        try{
          const { id } = req.params; 
          const result = await this.videoService.getPresignedUrl(+id);
          res.send({url:result})  
        }catch(err){
            res.status(500).send(err.message);
        }
    }
}