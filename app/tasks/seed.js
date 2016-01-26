'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const request = require('request-promise');
const crypto = require('crypto');

const database = require('./../config/database');
const models = require('../models');

const Place = mongoose.model('Place');

const names = ['campuses', 'faculties', 'buildings', 'places']
const urls = names.map(s => `https://almapp.github.io/uc-maps-seeds/${s}.json`);

function hash(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function reverse(coordinate) {
  return [coordinate[1], coordinate[0]];
}

Promise.all(urls.map(url => {
  const options = {
    uri: url,
    json: true,
  };
  return request(options).then(jsons => {
    return Place.create(jsons.map(json => {
      json._id = json.identifier ? hash(json.identifier) : undefined;
      json.parent = json.parent ? hash(json.parent.identifier) : null;
      json.ancestors = (json.ancestors || []).map(j => hash(j.identifier));

      if (!json.location) return json;

      if (json.location.type === 'Point') {
        if (json.location.coordinates[0] === 0 && json.location.coordinates[1] === 0) {
          delete json.location;
        } else {
          json.location.coordinates = reverse(json.location.coordinates);
        }
      } else {
        const rings = json.location.coordinates;
        if (rings[0].length === 0) {
          delete json.location;
        } else {
          json.location.coordinates = json.location.coordinates.map(ring => {
            ring = ring.map(reverse);
            if (ring[0]) ring.push(ring[0]);
            return ring;
          });
        }
      }
      return json;
    }));
  });
})).then(_ => {
  return Place.ensureIndexes();
}).then(_ => {
  console.log('Seed complete');
}).catch(err => {
  console.error(err);
})
