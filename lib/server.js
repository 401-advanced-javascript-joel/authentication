'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const f404 = require('./middleware/404');
const errorHandler = require('./middleware/error-handler');
const { swagger, options } = require('../docs/swagger');
const { userModel } = require('./models/model');
const authRouter = require('./routes/auth-routes');

const app = express();

const expressSwagger = swagger(app);
expressSwagger(options);

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use(authRouter);

/**
 * This route loads the homepage
 * @route GET /
 * @group default
 * @returns {object} 200 - Homepage
 */
app.get('/', (req, res, next) => {
  res.send('<h2>Homepage</h2>');
});

/**
 * This route loads a list of users
 * @route GET /users
 * @group user
 * @returns {object} 200 - a list of users
 */
app.get('/users', async (req, res, next) => {
  const result = await userModel.read();
  res.send(result);
});

app.use('*', f404);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port, db) => {
    app.listen(port, () => {
      console.log('Server up and running on ' + port);
    });
    db.start();
  },
};
