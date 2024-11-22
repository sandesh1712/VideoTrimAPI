import { PutObjectCommand, S3Client , GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs';
import { Readable } from "stream";
export class S3Helper {
    client:S3Client
    bucketName: string
    
    constructor(client,bucketName){
        this.bucketName = bucketName;
        this.client = client;
    }
    
    async uploadVideo(key:string,fileStream){
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: fileStream
        });

        try {
            const response = await this.client.send(command);
            return response;
        } catch (caught) {
            throw new Error("S3 Upload failed");
        }
    }
    
    async getPublicUrl(key:string,expiresIn:number){
          const command = new GetObjectCommand({
            Key: key,
            Bucket: this.bucketName,
          });

          try{
            const preSignedUrl = await getSignedUrl(this.client,command,{expiresIn});
            return preSignedUrl;
          }catch(err){
            throw new Error('Error Occured while getting a presigned url');
          } 
    }

    async downloadVideo(key: string, localPath: string):Promise<boolean>{
      const command = new GetObjectCommand({
        Key: key,
        Bucket: this.bucketName,
      });
      try{
      const { Body } = await this.client.send(command);
      if (Body instanceof Readable) {
        const writeStream = fs.createWriteStream(localPath);
        
        // Pipe the S3 Body (stream) to a local file
        Body.pipe(writeStream);

        // Return a promise to resolve when the writing is complete
        return new Promise<boolean>((resolve, reject) => {
          writeStream.on('finish', () => resolve(true));  // Resolve when write is complete
          writeStream.on('error', (err) => {
            console.error('Error writing file:', err);
            reject(new Error('Error occurred while writing file to disk.'));
          });
        });
      } else {
          throw new Error('S3 Body is not a stream.');
      }  
      }catch(err){
         throw new Error("Error occured while downloading file!!")
      }
    }

    async deleteVideo(key){
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      try{
       const response = await this.client.send(command)
       return response;
      }catch(err){
        throw new Error("Failed to delete video from s3!");
      }
    }
}

