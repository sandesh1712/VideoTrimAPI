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

/**
 * @openapi
 * /video/upload:
 *   post:
 *     description: Uploads a video file along with a title and description.
 *     summary: Uploads a video file with metadata (title and description).
 *     operationId: uploadVideo
 *     tags:
 *       - Video
 *     parameters:
 *       - name: clip
 *         in: formData
 *         description: The video file to upload (e.g., .mp4, .avi).
 *         required: true
 *         type: file
 *       - name: title
 *         in: formData
 *         description: The title of the video.
 *         required: true
 *         type: string
 *       - name: description
 *         in: formData
 *         description: A description of the video content.
 *         required: true
 *         type: string
 *       - name: Authorization
 *         in: header
 *         description: Bearer token for authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE3MzIzMzkzODAsImV4cCI6MTczMjQyNTc4MH0.PPTDIPrLMyYQmLiuMvKsWkUVSNOLdwFf73wuZfXTXKQ"
 *     responses:
 *       200:
 *         description: Video successfully uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 title:
 *                   type: string
 *                   example: "four_by_virat"
 *                 description:
 *                   type: string
 *                   example: "virat kohli hit a four to mid off"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                 s3Url:
 *                   type: string
 *                   format: uri
 *                   example: "https://json-lambda-test.s3.us-east-1.amazonaws.com/videos/clip-1732341698139-429270249.mp4"
 *                 s3Key:
 *                   type: string
 *                   example: "videos/clip-1732341698139-429270249.mp4"
 *                 size:
 *                   type: integer
 *                   example: 650167
 *                 originalName:
 *                   type: string
 *                   example: "5538262-sd_426_240_25fps.mp4"
 *                 duration:
 *                   type: number
 *                   format: float
 *                   example: 15.32
 *       401:
 *         description: Unauthorized – Invalid or missing token.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               clip:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 */
videoRouter.post("/upload",upload.single('clip'),(req,res)=>videoController.upload(req,res));

/**
 * @swagger
 * /video/publicurl/{id}:
 *   get:
 *     summary: Get public URL for a video
 *     description: Retrieves the public URL for a video based on its ID. Requires authentication via Bearer token.
 *     tags:
 *       - Video
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the video to retrieve the public URL for.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *       - name: Authorization
 *         in: header
 *         description: Bearer token for authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE3MzIzMzkzODAsImV4cCI6MTczMjQyNTc4MH0.PPTDIPrLMyYQmLiuMvKsWkUVSNOLdwFf73wuZfXTXKQ"
 *     responses:
 *       '200':
 *         description: Public URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://your-domain.com/video/2"
 *       '401':
 *         description: Unauthorized. Invalid or missing Bearer token.
 *       '404':
 *         description: Video not found!
 *       '500':
 *         description: Internal server error
 */
videoRouter.get('/publicurl/:id',(req,res)=>videoController.getPresignedUrl(req,res));

/**
 * @swagger
 * /video/trim/{id}:
 *   put:
 *     summary: Trim a video
 *     tags:
 *       - Video
 *     description: Trims a video by starting from a specified position and trimming the given length. Requires authentication via Bearer token.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the video to trim.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: Authorization
 *         in: header
 *         description: Bearer token for authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE3MzIzMzkzODAsImV4cCI6MTczMjQyNTc4MH0.PPTDIPrLMyYQmLiuMvKsWkUVSNOLdwFf73wuZfXTXKQ"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *                 description: The starting point for the trim (e.g., "start" or "end").
 *                 example: "end"
 *               trimLength:
 *                 type: integer
 *                 description: The length of the video to trim.
 *                 example: 4
 *             required:
 *               - from
 *               - trimLength
 *     responses:
 *       '200':
 *         description: Video trimmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video trimmed successfully."
 *       '401':
 *         description: Unauthorized. Invalid or missing Bearer token.
 *       '404':
 *         description: Video Not found!
 *       '500':
 *         description: Internal server error.
 */
videoRouter.put('/trim/:id',(req,res)=>videoController.trim(req,res));

export default videoRouter;