import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRouter = Router();

const userController = new UserController();

userRouter.post('/sign_up',(req,res)=>userController.create(req,res));
userRouter.post('/sign_in',(req,res)=>userController.signIn(req,res));


export default userRouter;