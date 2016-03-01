const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  _id: String,
  identifier: {
    $type: String,
    index: true,
    unique: true,
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
    social: [{
      type: String,
      url: String,
      id: String,
    }],
  },
  parent: {
    $type: String,
    ref: 'Place',
    index: true,
  },
  ancestors: {
    $type: [{
      $type: String,
      ref: 'Place',
    }],
    index: true,
  },
  categories: [{
    $type: String,
    index: true,
  }],
}, {
  autoIndex: true,
  typeKey: '$type',
});

// Add GeoJSON index
PlaceSchema.index({
  location: '2dsphere'
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
