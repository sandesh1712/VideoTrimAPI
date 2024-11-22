import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { userRepo } from "../repositories/userRepository";

const userRouter = Router();

const userService = new UserService(userRepo);
const userController = new UserController(userService);

userRouter.post('/sign_up',(req,res)=>userController.create(req,res));
userRouter.post('/sign_in',(req,res)=>userController.signIn(req,res));


export default userRouter;