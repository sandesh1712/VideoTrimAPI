import fs from "fs/promises";
import path from "path";
import { S3Helper } from "../helpers/awsHelper";
import { S3Client } from "@aws-sdk/client-s3";
import {
  AWS_REGION,
  S3_BUCKET,
} from "../../config/constants";
import { UploadedFile } from "../types/file.type";
import { Video } from "../entities/Video";
import { Repository } from "typeorm";
import { appDataSource } from "../dbSetup";
import { NotFoundError } from "../errors/NotFoundError";
import { VideoHelper } from "../helpers/videoHelper";

export class VideoService {
  private s3Helper: S3Helper;
  private videoRepo: Repository<Video>;
  private videoHelper: VideoHelper;

  constructor() {
    this.s3Helper = new S3Helper(
      new S3Client({ region: AWS_REGION }),
      S3_BUCKET
    );
    this.videoHelper = new VideoHelper();
    this.videoRepo = appDataSource.getRepository(Video);
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
      const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

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
    try {
      // Retrieve the video metadata using the provided id
      const video = await this.findOneBy(id);

      if (!video) {
        throw new Error(`Video with id ${id} not found.`);
      }

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
      // Proper error handling to capture any issues
      console.error("Error generating presigned URL:", err);
      throw new Error(
        `Error generating presigned URL for video id ${id}: ${err.message}`
      );
    }
  }

  async findOneBy(id) {
    const video = await this.videoRepo.findBy({ id }); //there is findOneBy command in typeorm ,but it actually has an bug

    if (video.length === 0) throw new NotFoundError("Video Not found!");

    return video[0];
  }
}
