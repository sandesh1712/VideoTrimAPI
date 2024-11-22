import { appDataSource } from "../dbSetup";
import { User } from "../entities/User";

export const userRepo = appDataSource.getRepository(User); 