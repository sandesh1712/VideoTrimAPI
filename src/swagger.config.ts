import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
    title: 'VideoVerse Assestment',
    version: '1.0.0',
    description:'',
    },
};

const options = {
    swaggerDefinition,
    apis: ['src/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);