import  express  from "express";
import "dotenv/config"
import { PORT } from "../config/constants";
import bodyParser from "body-parser";
import { dbConnect } from "./dbSetup";
import userRouter from "./routes/user";
import videoRouter from "./routes/video";
import { authMiddleware } from "./helpers/authHelper";
import * as swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./swagger.config";

const app = express();

app.use(bodyParser.json());

// swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/',authMiddleware);

//register routes
app.use('/auth',userRouter);
app.use('/video',videoRouter);

app.listen(PORT,async()=>{
   await dbConnect();
   console.log(`Server started on port ${PORT}`)  
})