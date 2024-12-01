const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc'); // Properly import swagger-jsdoc

const swaggerDocs = swaggerJsdoc({
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API for managing users, including JWT authentication.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Optional but useful
                },
            },
        },
        security: [
            {
                bearerAuth: [], // Apply bearerAuth globally
            },
        ],
    },
    apis: ['./routes/*.js'],
});

module.exports = { swaggerUi, swaggerDocs };