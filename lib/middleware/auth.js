'use strict';

const { userModel } = require('../models/model');

const auth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ');
    if (token.length === 2 && token[0] === 'Basic') {
      const data = Buffer.from(token[1], 'base64').toString().split(':');
      const user = await userModel.readOne({
        username: data[0],
      });
      if (user) {
        const match = await userModel.schema.comparePassword(user, data[1]);
        if (match) {
          return next();
        }
      }
    }
  }
  next({ status: 401, message: 'Unauthorized access' });
};

module.exports = auth;
