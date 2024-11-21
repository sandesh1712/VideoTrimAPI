import  express  from "express";
import "dotenv/config"
import { PORT } from "../config/constants";
import bodyParser from "body-parser";
import { dbConnect } from "./dbSetup";
import userRouter from "./routes/user";

const app = express();

app.use(bodyParser.json());

//connect to db 
dbConnect();


//register routes
app.use('/auth',userRouter);

app.listen(PORT,()=>{
   console.log(`Server started on port ${PORT}`)  
})