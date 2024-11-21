import { Repository } from "typeorm";
import { appDataSource } from "../dbSetup"
import { User } from "../entities/User"
import { PasswordHelper } from "../helpers/passwordHelper";
import { AlreadyExistsError } from "../errors/AlreadyExists";

export class UserService {
    userRepo: Repository<User>
   
    constructor(){
        this.userRepo = appDataSource.getRepository(User);
    }

    async create(data:Partial<User>){
      const existingUser = await this.findOneBy({email: data.email})[0];
      
      if(existingUser)
         throw new AlreadyExistsError("email already exists")
      
      const user = this.userRepo.create(data);
      //hash password
      user.password = await PasswordHelper.hashPassword(user.password);

      return await this.userRepo.save(user);
    }

    async findOneBy(query:Partial<User>){
       return await this.userRepo.findOneBy(query);
    }
}