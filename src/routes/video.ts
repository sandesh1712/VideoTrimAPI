import { Router } from "express";
import { VideoController } from "../controllers/videoController";
import upload from "../helpers/uploadHelper";

const videoRouter = Router();

const videoController =  new VideoController();

//use multer to process file uploads over formdata
videoRouter.post("/upload",upload.single('clip'),(req,res)=>videoController.upload(req,res));

videoRouter.get('/publicurl/:id',(req,res)=>videoController.getPresignedUrl(req,res));

export default videoRouter;