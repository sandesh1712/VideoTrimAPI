import  express  from "express";
import "dotenv/config"
import { PORT } from "../config/constants";
import bodyParser from "body-parser";
import { dbConnect } from "./dbSetup";

const app = express();

app.use(bodyParser.json());

//connect to db 
dbConnect();

app.listen(PORT,()=>{
   console.log(`Server started on port ${PORT}`)  
})