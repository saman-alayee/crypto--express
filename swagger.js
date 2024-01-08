const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Update this URL based on your application's base URL
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Update the path based on your project structure
};

const specs = swaggerJsdoc(options);

module.exports = {
  serveSwaggerUI: swaggerUi.serve,
  setupSwaggerUI: swaggerUi.setup(specs),
};
