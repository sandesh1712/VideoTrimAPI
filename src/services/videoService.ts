import fs from "fs/promises";
import path from "path";
import { S3Helper } from "../helpers/awsHelper";
import {
  AWS_REGION,
  S3_BUCKET,
} from "../../config/constants";
import { UploadedFile } from "../types/file.type";
import { Video } from "../entities/Video";
import { Repository } from "typeorm";
import { NotFoundError } from "../errors/NotFoundError";
import { VideoHelper } from "../helpers/videoHelper";
import { TrimParams } from "../types/video.type";

export class VideoService {
  constructor(private s3Helper:S3Helper , private videoHelper: VideoHelper,private videoRepo:Repository<Video>) {
  }

  async createAndUpload(data: Partial<Video>, file: UploadedFile) {
    if (!file) {
      throw new Error("Error Occurred during file upload");
    }

    const filePath = path.resolve(__dirname, "..", "..", file.path); // resolve for absolute path

    let videoMetadata;
    try {
      // Get actual video metadata by reading through ffmpeg
      videoMetadata = await this.videoHelper.getInfo(filePath);

      // Check if the duration and file size are within the limits
      this.videoHelper.checkLimits(videoMetadata.duration, file.size);

      // Read the file from disk
      const diskFile = await fs.readFile(filePath);

      // Key for S3
      const key = `videos/${file.filename}.${file.originalname
        .split(".")
        .at(-1)}`;

      // Upload to S3
      await this.s3Helper.uploadVideo(key, diskFile);
      const s3Url = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

      // Create a video entity in DB with details
      const video = this.videoRepo.create(data);
      video.s3Url = s3Url;
      video.s3Key = key;
      video.size = file.size;
      video.originalName = file.originalname;
      video.duration = videoMetadata.duration;

      const savedVideo = await this.videoRepo.save(video);
      return savedVideo;
    } catch (err) {
      console.error("Error during video upload and processing:", err);
      throw new Error(
        err.message || "Error during video upload and processing"
      );
    } finally {
      // Cleanup - delete the temporary file from disk
      try {
        await fs.unlink(filePath); // Ensure file is deleted
      } catch (cleanupError) {
        console.error("Failed to delete temporary file:", cleanupError);
      }
    }
  }

  async getPresignedUrl(id: number) {
    const video = await this.findOneBy(id);

    try {
      // Extract the s3Key from the video object
      const { s3Key } = video;

      // Ensure URL_EXPIRY_IN_HOURS is defined in the environment, with a fallback value
      const expiryInHours = process.env.URL_EXPIRY_IN_HOURS || "1"; // Default to 1 hour if not set
      const expiryInSeconds = +expiryInHours * 60 * 60; // Convert hours to seconds

      // Generate and return the presigned URL using the helper function
      const presignedUrl = await this.s3Helper.getPublicUrl(
        s3Key,
        expiryInSeconds
      );
      return presignedUrl;
    } catch (err) {
      throw new Error(
        `Error generating presigned URL for video id ${id}: ${err.message}`
      );
    }
  }

  async trim(id:number,trimParams:TrimParams){
     // retrive video obj
     const video = await this.findOneBy(id);

     //check parameters are valid
      if(!trimParams || !trimParams.from || !trimParams.trimLength || trimParams.trimLength < 1){
       throw new Error("Missing trim parameters");
      }
      
      if(trimParams.trimLength >= video.duration){
         throw new Error(`Trim length of ${trimParams.trimLength} seconds exceeds video duration of ${video.duration} seconds.`);
      }

     //get object and store in disk
      const downLoadPath = `tmp/${video.s3Key.split('/')[1]}`
      const isDownloaded = await this.s3Helper.downloadVideo(video.s3Key,downLoadPath);

      if (!isDownloaded) {
         throw new Error("Error downloading the video from S3.");
     }
 
     // Trim the video using FFmpeg
     const newName = this.videoHelper.getNewName(video.s3Key.split('/')[1]);
     const outputPath = `tmp/${newName}`;
 
     try {
         // Call the trim method that will return the output path of the trimmed video
         const trimmedVideoPath = await this.videoHelper.trimVideo(downLoadPath, outputPath, trimParams, video.duration);
         const trimmedVideoMetadata = await this.videoHelper.getInfo(trimmedVideoPath);
         // Now upload the trimmed video back to S3
         const key = `videos/${newName}`;
         const diskFile = await fs.readFile(trimmedVideoPath as string);

         const isUploaded = await this.s3Helper.uploadVideo(key,diskFile);
 
         if (!isUploaded) {
             throw new Error("Failed to upload the trimmed video to S3.");
         }
 
         // Update the database with the new S3 URL and other details
         const s3Url = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
         const oldKey = video.s3Key;
         video.s3Key = key;
         video.s3Url = s3Url;
         video.duration = trimmedVideoMetadata.duration
         video.size = trimmedVideoMetadata.size

         await this.videoRepo.save(video); // Assuming you have a repository to update the video entry in DB
         
         // delete old Video
         await this.s3Helper.deleteVideo(oldKey);
        
         console.log('Video trimming and upload completed successfully.');
         return video;
      }catch(err){

      }finally{
         // Cleanup local files (optional)
         await fs.unlink(downLoadPath);
         await fs.unlink(outputPath);
      }
  }

  async findOneBy(id) {
    const video = await this.videoRepo.findBy({ id }); //there is findOneBy command in typeorm ,but it actually has an bug

    if (video.length === 0) throw new NotFoundError("Video Not found!");

    return video[0];
  }
}
