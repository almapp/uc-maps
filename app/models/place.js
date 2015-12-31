const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  _id: String,
  identifier: {
    $type: String,
    index: true,
    required: true,
    uppercase: true,
  },
  campus: {
    $type: String,
    index: true,
    required: true,
    uppercase: true,
  },
  name: String,
  shortName: String,
  address: String,
  information: String,
  location: {
    /* ----------------------------------
    Point:
      'coordinates' must be single coordinate: [longitude, latitude, altitude?]
      Example:
        'coordinates': [-33.500898, -70.615262]

    Polygon:
      'coordinates' must be an array of [[longitude, latitude, altitude?]]
      Example:
        'coordinates': [
          [[-33.496568, -70.616281], [-33.496246, -70.616206]]
        ]
    ------------------------------------ */
    type: {
      $type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point',
    },
    coordinates: {
      $type: [],  // Array of mixed
      default: [0, 0],
    },
    floor: String,
    zoom: {
      $type: Number,
      min: 0,
      max: 20,
    },
    angle: {
      $type: Number,
      min: 0,
      max: 45,
    },
    tilt: {
      $type: Number,
      min: 0,
      max: 45,
    },
  },
  contact: {
    phones: [String],
    emails: [String],
    urls: [String],
    social: {},
  },
  parent: {
    $type: String,
    ref: 'Place'
  },
  ancestors: {
    $type: [{
      $type: String,
      ref: 'Place'
    }],
    index: true
  },
  categories: [{
    $type: String,
    index: true
  }],
}, {
  autoIndex: true,
  typeKey: '$type',
});

// Add GeoJSON index
PlaceSchema.index({
  location: '2dsphere'
});

function getID(place) {
  const campus = place.campus;
  const identifier = place.identifier ||  campus;
  return crypto.createHash('md5').update(`${campus}-${identifier}`).digest('hex');
}

function processPlace(place) {
  place._id = getID(place);
  if (place.parent) place.parent = getID(place.parent);
  if (place.ancestors) place.ancestors = place.ancestors.map(getID);
  return place;
}

PlaceSchema.statics.getID = getID;

PlaceSchema.statics.createPlace = function(place) {
  return this.model('Place').create(processPlace(place));
}

PlaceSchema.statics.createPlaces = function(places) {
  return this.model('Place').create(places.map(processPlace));
}

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
