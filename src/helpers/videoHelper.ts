import ffmpeg from "fluent-ffmpeg";
import {promisify} from 'util';
import { allowedMaxLimit, allowedMaxSizeLimit, allowedMinLimit, allowedMinSizeLimit } from "../../config/constants";
import { suffix } from "./uploadHelper";
import { TrimFrom, TrimParams, TrimTimeLimit } from "../types/video.type";

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

    async trimVideo(inputPath:string,outputPath:string,trimParams:TrimParams,totalDuration:number){
       const trimTimes = this.calculateTime(trimParams,totalDuration);
       
       return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .setStartTime(trimTimes.start)   // Start time (in seconds) for trimming
          .setDuration(trimTimes.duration) // Duration (in seconds) of the trim
          .output(outputPath)        // Path where the trimmed video will be saved
          .on('end', () => {
            resolve(outputPath); // Return the output path once done
          })
          .on('error', (err) => {            
            reject(new Error('Error occurred while trimming video.'));
          })
          .run()});
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

       if(size < +allowedMinSizeLimit){
        throw new Error('Video size is too less!');
       }
      if(size > +allowedMaxSizeLimit){
         throw new Error('Video size is too big');
       }
    }
   
    private calculateTime(trimParams: TrimParams, videoDuration: number): TrimTimeLimit{
        let start= trimParams.from === TrimFrom.START ? trimParams.trimLength:0;
        let duration= videoDuration - trimParams.trimLength;
        return { start, duration };
    }

    getNewName(oldName:string){
       const [prefix,_,lastPart] = oldName.split('-');
       const extention = lastPart.split('.')[1];
       const _suffix = suffix()
       return `${prefix}-${_suffix}.${extention}`;
    }
}