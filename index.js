'use strict';

const app = require('./app/app');
const server = app.server;
const config = app.config;

// Start server
server.listen(config.get('port'), () => {
  console.log('App listening at:', config.get('port'));
});
