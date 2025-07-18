VideoEditAPI

# Prerequisite
 1. make sure nodejs is installed on your system
 2. install ffmpeg in your system , [more info](https://www.ffmpeg.org/)

# Instructions to run 
1. clone the repo
2. install dependencies ```npm install```
3. create .env file
4. add following environment variable to .end 
  ```
   PORT=<port nmber for server>
   DB_TYPE=<db type ,like sqlite,mysql,etc>
   S3_BUCKET=<s3 bucket name , required>
   URL_EXPIRY_IN_HOURS=<presigned url expiry time>
   ALLOWED_MIN_LIMIT=<min allowed video length in seconds>
   ALLOWED_MAX_LIMIT=<max allowed video length in seconds>
   ALLOWED_MAX_SIZE_LIMIT=<min allowed video size in bytes>
   ALLOWED_MIN_SIZE_LIMIT=<max allowed video size in bytes>
   JWT_SECRET= <jwt secret>
   AWS_ACCESS_KEY_ID=<aws key id>
   AWS_SECRET_ACCESS_KEY=<aws access key>
  ```
 5. start server ```npm run start``` 

# Supported functionality
1. user sign_up
2. user sign_in
3. video upload
4. video trim
5. generate public url for video
6. TODO => merge videos

# Useful Docs
1. aws -> https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
2. typeorm ->  https://typeorm.io/
3. ffmpeg integration -> https://www.npmjs.com/package/fluent-ffmpeg

# Swagger Docs
1. run server and visit '/api-docs/' in browser

# Tests
1. to run tests -> ```npm run test```
2. TODO => generating coverage

