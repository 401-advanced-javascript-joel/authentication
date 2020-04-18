'use strict';

const errorHandler = (error, req, res, next) => {
  res
    .status(error.status)
    .send('<h2>Error ' + error.status + ':</h2><p>' + error.message + '</p>');
};

module.exports = errorHandler;
