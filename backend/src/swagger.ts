import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Haspaka Project',
        description: 'Simple project for inventory management, made with ExpressJs and Typescript, PostgreSQL with PG-node for DB'
    },
    tags:[
        {
            name: 'Users',
            description: "User based routes"
        },
        {
            name: 'Commands',
            description: "Commands based routes, also substitutes as permissions for users"
        },
        {
            name: 'Units',
            description: "All the divisions beneath the commands"
        },
    ],
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'dev environment'
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            }
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);