import { appDataSource } from "../dbSetup";
import { Video } from "../entities/Video";

export const videoRepo = appDataSource.getRepository(Video); 