import { DATABASE, DB_TYPE } from "./constants";

const config = {
    type: DB_TYPE,
    database: DATABASE,
    entities:['src/entities/*.ts'],
    logging: true,
    synchronize: true //this option updates db schema as we update entity , migrations should be used for prod environment
 }

export default config;