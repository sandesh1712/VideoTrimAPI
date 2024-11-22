import { Repository } from "typeorm";
import jwt from 'jsonwebtoken';
import { User } from "../entities/User"
import { PasswordHelper } from "../helpers/passwordHelper";
import { AlreadyExistsError } from "../errors/AlreadyExists";
import { SignInOption } from "../types/user.type";
import { NotFoundError } from "../errors/NotFoundError";
import { JWT_SECRET } from "../../config/constants";
export class UserService {
   
    constructor(private userRepo:Repository<User>){
    }

    async create(data:Partial<User>){
      const existingUser = await this.findOneBy({email:data.email});
      
       if(existingUser)
         throw new AlreadyExistsError("email already exists")
      
      const user = this.userRepo.create(data);
      //hash password
      user.password = await PasswordHelper.hashPassword(user.password);

      return await this.userRepo.save(user);
    }

    async findOneBy(query:Partial<User>){
       const result = await this.userRepo.findBy(query);
       return result[0];
    }

    async signIn(signInoption:SignInOption){
       const user = await this.userRepo.createQueryBuilder('user')
        .select(['user.email','user.password'])
        .where('user.email = :email',{email: signInoption.email})
        .getOne();

       if(!user)
         throw new NotFoundError("User Not Found");
       
       const isPasswordMatch = await PasswordHelper.comparePassword(user.password,signInoption.password);
       
       if(!isPasswordMatch){
         throw new Error("Wrong Password!");
       }

       const token = jwt.sign({user_id: user.id},JWT_SECRET,{expiresIn: 24*60*60});
       return {token}
    }
}