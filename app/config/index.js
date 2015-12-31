const nconf = require('nconf');

const settings = {
  'PRODUCTION': 'app/config/env/production.json',
  'DEVELOPMENT': 'app/config/env/development.json',
  'TEST': 'app/config/env/test.json',
  'CI': 'app/config/env/ci.json', // To use with Travis-CI
}

const env = process.env.NODE_ENV || 'DEVELOPMENT';
const file = settings[env.toUpperCase()];

module.exports = nconf.env().argv().file(file).defaults({
  'port': 3000,
  'mongo': {
    'uri': 'mongodb://localhost:27017/ucmaps',
    'debug': true,
  },
});
