import { Repository } from "typeorm";
import { Video } from "../../src/entities/Video";
import { VideoService } from "../../src/services/videoService";
import { S3Helper } from "../../src/helpers/awsHelper";
import { VideoHelper } from "../../src/helpers/videoHelper";
import { NotFoundError } from "../../src/errors/NotFoundError";

const mockFindBy = jest.fn();

const mockRepo:Partial<Repository<Video>> = {
  findBy: mockFindBy
}

const mockS3Helper:Partial<S3Helper> = {}

const mockVideoHelper:Partial<VideoHelper> = {}

describe('Video Service', ()=>{
  const videoService = new VideoService(
    mockS3Helper as S3Helper,
    mockVideoHelper as VideoHelper,
    mockRepo as Repository<Video>
  );
  
  describe('find One by',()=>{
     it("should return matching result", async () => {
        const tempData = {
          id:1,
          title: 'lorem ipsum',
          description: 'lorem ipsum'
        };

        mockFindBy.mockImplementationOnce(() => [tempData]);
  
        const result = await videoService.findOneBy(1);
        expect(result).toStrictEqual(tempData);
      });
    
      it("should throw error if result not found", async () => {
        mockFindBy.mockImplementationOnce(() => []);
        
        try{
        const result = await videoService.findOneBy(1);
        }catch(err){
         expect(err instanceof NotFoundError).toStrictEqual(true);
        }
      });  
  })
});