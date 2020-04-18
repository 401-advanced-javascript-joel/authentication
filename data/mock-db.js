'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

const connectMock = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  await mongoose.connect(uri, mongooseOpts);
};

const closeMock = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

module.exports = {
  connectMock,
  closeMock,
};
