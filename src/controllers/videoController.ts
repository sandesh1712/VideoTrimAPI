import { Request,Response } from "express";
import { VideoService } from "../services/videoService";
import { UploadedFile } from "../types/file.type";
import { NotFoundError } from "../errors/NotFoundError";
export class VideoController {
    
    constructor(private videoService:VideoService){
    }

    async upload(req:Request,res:Response){
        const file:UploadedFile = req.file

        const data = req.body
        data.user =  { id: req['userId']};
        
        try{
            const result = await this.videoService.createAndUpload(data,file);
            res.send(result)
        }catch(err){
            let status = 500;
            res.status(status).send(err.message);
        }        
    }

    async getPresignedUrl(req:Request,res:Response){
        try{
          const { id } = req.params; 
          const result = await this.videoService.getPresignedUrl(+id);
          res.send({url:result})  
        }catch(err){
            let status = 500;
                        
            if( err instanceof NotFoundError){
                status = 404
            }

            res.status(status).send(err.message);
        }
    }

    async trim(req:Request,res:Response){
        try{
            const { id } = req.params; 
            const trimParams = req.body;
            const result = await this.videoService.trim(+id,trimParams);
            res.send(result)
        }catch(err){
            let status = 500;
                        
            if( err instanceof NotFoundError){
                status = 404
            }
            
            res.status(status).send(err.message);
        }
    }
}