import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
}

