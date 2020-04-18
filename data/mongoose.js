'use strict';

const mongoose = require('mongoose');

const start = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  // Log Error
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'connection error:'),
  );

  // Log Success
  mongoose.connection.once('open', function callback() {
    console.log('Connected to DB!');
  });
};

const stop = () => {
  mongoose.disconnect();
};

module.exports = { start, stop };
