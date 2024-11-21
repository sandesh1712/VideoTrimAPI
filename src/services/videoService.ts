import fs from 'fs/promises';
import path from 'path';
import { S3Helper } from '../helpers/awsHelper';
import { S3Client } from '@aws-sdk/client-s3';
import { AWS_REGION, S3_BUCKET } from '../../config/constants';
import { UploadedFile } from '../types/file.type';
import { Video } from '../entities/Video';
import { Repository } from 'typeorm';
import { appDataSource } from '../dbSetup';

export class VideoService{
   s3Helper:S3Helper
   videoRepo :Repository<Video>
   
   constructor(){
    this.s3Helper = new S3Helper(new S3Client({region:AWS_REGION}),S3_BUCKET);
    this.videoRepo = appDataSource.getRepository(Video);
   }

   async createAndUpload(data:Partial<Video>,file:UploadedFile){
     if(!file){
        throw new Error("Error Occurred during file upload");
     }
    
    // get path to temp file from disk
    const filePath = path.join(__dirname,'..','..',file.path)
    
    // readfile from disk
    const diskFile = await fs.readFile(filePath);
    // key for s3
    const key = `videos/${file.filename}.${file.originalname.split('.').at(-1)}`
    
    // upload to s3 bucket
    const result = await this.s3Helper.uploadVideo(key,diskFile);
    
    const  s3Url = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    const video = this.videoRepo.create(data);
    
    video.s3Url = s3Url;
    
    video.size = file.size;
    
    video.originalName = file.originalname;
    
    //cleanup
    fs.unlink(filePath);

    return await this.videoRepo.save(video);
    }
}