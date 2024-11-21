import { DataSource, DataSourceOptions } from "typeorm";
import config from "../config/typerom";

// inital setup for typeorm to work
export const appDataSource = new DataSource(config as DataSourceOptions);

export async function dbConnect(){
    try{
     await appDataSource.initialize()
     console.log("Data Source has been initialized!")

    }catch(err){
        console.error("Error during Data Source initialization", err)
    }    
}