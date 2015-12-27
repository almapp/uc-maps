// Node imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Local imports
const config = require('./config');
const database = require('./config/database');
const models = require('./models');

// Webapp
const app = express();
app.use(cors());
app.enable('trust proxy');
app.set('json spaces', 4);

// Logs
app.use(morgan('dev'));

// Index
app.get("/", (req, res) => {
    res.send({
      status: 'on',
      versions: {
        v1: {
          url: `${req.protocol}://${req.headers.host}/api/v1`,
        },
      }
    });
});

// REST API Routes
app.use('/api', require('./routes/api'));

module.exports.server = app;
module.exports.config = config;
module.exports.database = database;
