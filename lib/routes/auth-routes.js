'use strict';

const express = require('express');

const auth = require('../middleware/auth');
const { userModel } = require('../models/model');

const router = new express.Router();

/**
 * This route signs in the user or rejects invalid credentials
 * @route get /signin
 * @group user
 * @returns {object} 200 - Account Signed In
 */
router.get('/signin', auth, (req, res, next) => {
  res.send('Signed In!');
});

/**
 * This route creates a new user or rejects invalid inputs
 * @route POST /signup
 * @group user
 * @param {string} username.body.required - the username in the db for the account
 * @param {string} password.body.required - the password in the db for the account
 * @param {string} email.body - the password in the db for the account
 * @param {string} role.body.required - role of account (admin, editor or user) defaults to user
 * @returns {object} 200 - account created
 */
router.post('/signup', async (req, res, next) => {
  const user = await userModel.create(req.body);
  if (user.error) {
    next({ status: 400, message: user.error.message });
    return;
  }
  res.send(user);
});

module.exports = router;
