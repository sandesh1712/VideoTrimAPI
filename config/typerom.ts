import { DATABASE, DB_TYPE } from "./constants";

const config = {
    type: DB_TYPE,
    database: DATABASE,
    entities:['./entities/*.ts'],
    logging: true
}

export default config;