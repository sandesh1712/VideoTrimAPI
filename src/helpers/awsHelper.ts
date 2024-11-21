import { PutObjectCommand, S3Client , GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
}

