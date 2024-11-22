import ffmpeg from "fluent-ffmpeg";
import {promisify} from 'util';
import { allowedMaxLimit, allowedMaxSizeLimit, allowedMinLimit, allowedMinSizeLimit } from "../../config/constants";

const ffprobe = promisify(ffmpeg.ffprobe);

export class VideoHelper {
  
    async getInfo(path){
        const videoFile = await ffprobe(path);
        
        const metadata =  videoFile['format'];
        
        if(!metadata){
            throw new Error('failed to gather metadata ,file is unsupported!');
        }

        return metadata;
    }

    checkLimits(duration:number,size:number){
        if(!duration|| !size)
            throw new Error("Unsupported Video limit!");
        if(duration < +allowedMinLimit){
            throw new Error('Video is too short!');
       }
       if(duration > +allowedMaxLimit){
         throw new Error('Video is too long!');
       }

       if(duration < +allowedMinSizeLimit){
        throw new Error('Video is too short!');
       }
      if(duration > +allowedMaxSizeLimit){
         throw new Error('Video is too long!');
       }
    }
}