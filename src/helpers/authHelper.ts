import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/constants";
import { NextFunction, Request, Response } from "express";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const excludedPath = ['/api/docs','/auth/sign_in','/auth/sign_up']

    if(excludedPath.includes(req.url)){
        next();
        return
    }

    const token = req.header('Authorization');
  
    if (!token || !token.startsWith('Bearer')) {
       res.status(401).json({ message: 'Invalid Token!' });
       return;
    }
     
    try{
        const data = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req['userId'] = data['user_id'] 
        next();
    }catch(err){
        res.status(401).json({ message: 'Unauthorised'});
    }
};
