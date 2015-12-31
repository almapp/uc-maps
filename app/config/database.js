const mongoose = require('mongoose');
const bluebird = require("bluebird");

const config = require('./index');

// Database connection and setup
mongoose.Promise = bluebird;

// Debugging options
mongoose.set('debug', config.get('mongo:debug'));

module.exports = mongoose.connect(config.get('mongo:uri'));
