'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  email: { type: 'String' },
  role: {
    type: 'String',
    required: true,
    default: 'user',
    enum: ['admin', 'editor', 'user'],
  },
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.static('comparePassword', async function (user, password) {
  const match = bcrypt.compare(password, user.password);
  return match;
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
