'use strict';

const app = require('./lib/server');
const db = require('./data/mongoose');

app.start(process.env.PORT, db);
