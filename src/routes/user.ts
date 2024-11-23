import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { userRepo } from "../repositories/userRepository";

const userRouter = Router();

const userService = new UserService(userRepo);
const userController = new UserController(userService);

/**
 * @swagger
 * /auth/sign_up:
 *   post:
 *     tags:
 *         - Auth
 *     summary: Register a new user
 *     description: Creates a new user account with the provided information (first name, last name, email, and password).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Hopkins
 *               password:
 *                 type: string
 *                 example: test@123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: abcdefgh@xyz.com
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *               - email
 *     responses:
 *        200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Hopkins
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: abcdefgh@xyz.com
 *        500:
 *         description: Email already exists
 */
userRouter.post("/sign_up", (req, res) => userController.create(req, res));

/**
 * @swagger
 * /auth/sign_in:
 *   post:
 *     tags:
 *         - Auth
 *     summary: Sign In
 *     description: Sign in using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: test@123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: abcdefgh@xyz.com
 *             required:
 *               - password
 *               - email
 *     responses:
 *        200:
 *         description: Successfully signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE3MzIzMzkzODAsImV4cCI6MTczMjQyNTc4MH0.PPTDIPrLMyYQmLiuMvKsWkUVSNOLdwFf73wuZfXTXKQ
 */
userRouter.post("/sign_in", (req, res) => userController.signIn(req, res));

export default userRouter;
