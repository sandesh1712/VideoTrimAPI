import { Router } from "express";
import { VideoController } from "../controllers/videoController";
import upload from "../helpers/uploadHelper";
import { VideoService } from "../services/videoService";
import { s3Helper } from "../helpers/awsHelper";
import { VideoHelper } from "../helpers/videoHelper";
import { videoRepo } from "../repositories/videoRepository";


const videoRouter = Router();


const videoHelper = new VideoHelper();

const videoService = new VideoService(s3Helper,videoHelper,videoRepo)
const videoController =  new VideoController(videoService);

//use multer to process file uploads over formdata
videoRouter.post("/upload",upload.single('clip'),(req,res)=>videoController.upload(req,res));

videoRouter.get('/publicurl/:id',(req,res)=>videoController.getPresignedUrl(req,res));

videoRouter.put('/trim/:id',(req,res)=>videoController.trim(req,res));

export default videoRouter;