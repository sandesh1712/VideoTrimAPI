import { VideoHelper } from "../../src/helpers/videoHelper"
import path from "path";

describe('Video Helper',() => {
   const videoHelper = new VideoHelper();

  describe('Get Info',()=>{
     it('Get video info',async ()=>{
        const tempData = {
            format : {
               duration: 20,
               size: 445000 
            }
        }
         
        const expected ={
            start_time: 0,
            duration: 15.32,
            size: 650167,
        }

        const result = await videoHelper.getInfo(path.join(__dirname,'../../test/_mocks/clip_mock'));    
        expect(result.duration).toBe(expected.duration);
        expect(result.start_time).toBe(expected.start_time);
        expect(result.size).toBe(expected.size);
     })
  })
})