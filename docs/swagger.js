'use strict';

const swagger = (app) => require('express-swagger-generator')(app);

const options = {
  swaggerDefinition: {
    info: {
      description:
        'This is a simple express server that implements user authentication',
      title: 'Express Authentication Server',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: ['application/json', 'text/html'],
    schemes: ['http'],
  },
  basedir: __dirname, //app absolute path
  files: ['../lib/server.js', '../lib/routes/*.js'], //Path to the API handle folder
};

module.exports = { swagger, options };
