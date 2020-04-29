'use strict';

const express = require('express');

const auth = require('../middleware/auth');
const { userModel } = require('../models/model');

const router = new express.Router();

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
    next({ status: 400, message: 'User already exists!' });
    return;
  }
  const token = await user.generateToken(3600); // 60 minutes expiration
  res.send({ user, token });
});

/**
 * This route signs in the user or rejects invalid credentials
 * @route get /signin
 * @group user
 * @returns {object} 200 - Account Signed In
 */
router.post('/signin', auth, async (req, res, next) => {
  const user = await userModel.readOne({ _id: req.user.id });
  const token = await user.generateToken(3600); // 60 minutes expiration
  res.send({ user, token });
});

/**
 * This route loads a user from the db
 * @route GET /user
 * @group user
 * @returns {object} 200 - the user
 */
router.get('/user', auth, async (req, res, next) => {
  const user = await userModel.readOne({ _id: req.user.id });
  res.send(user);
});

module.exports = router;
