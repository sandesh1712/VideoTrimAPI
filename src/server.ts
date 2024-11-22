import  express  from "express";
import "dotenv/config"
import { PORT } from "../config/constants";
import bodyParser from "body-parser";
import { dbConnect } from "./dbSetup";
import userRouter from "./routes/user";
import videoRouter from "./routes/video";
import { authMiddleware } from "./helpers/authHelper";

const app = express();

app.use(bodyParser.json());

app.use('/**',authMiddleware);

//register routes
app.use('/auth',userRouter);
app.use('/video',videoRouter);

app.listen(PORT,async()=>{
   await dbConnect();
   console.log(`Server started on port ${PORT}`)  
})