'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const request = require('request-promise');
const crypto = require('crypto');

const database = require('./../config/database');
const models = require('../models');

const Place = mongoose.model('Place');
const url = 'https://almapp.github.io/uc-maps-seeds';

function files() {
  return request({ uri: `${url}/index.json`, json: true })
    .then(json => json.files.map(path => `${url}/${path}`))
    .then(paths => paths.map(path => request({ uri: path, json: true })))
    .then(Promise.all)
    .then(jsons => jsons.reduce((array, json) => array.concat(json), []))
}

function hash(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function reverse(coordinate) {
  return [coordinate[1], coordinate[0]];
}

function exec() {
  return Place.remove({})
    .then(() => files())
    .then(jsons => jsons.map(prepare))
    .then(places => Place.create(places))
    .then(places => console.log(`Created ${places.length} places.`))
    .then(() => Place.ensureIndexes())
}

function prepare(json) {
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
}

// Run this script
exec().then(() => process.exit())
