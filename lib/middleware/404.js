'use strict';

const f404 = (req, res, next) => {
  res.status(404).send('<h2>Error 404: Page Not Found</h2>');
};

module.exports = f404;
