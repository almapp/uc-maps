const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IDSchema = new Schema({
  campus: {
    type: String,
    index: true,
    required: true,
    uppercase: true,
  },
  identifier: {
    type: String,
    index: true,
    required: true,
    uppercase: true,
  },
}, {
  _id: false,
});

const PlaceSchema = new Schema({
  _id: IDSchema, // Custom ID type
  name: String,
  shortName: String,
  address: String,
  information: String,
  location: {
    // 'Point' or 'Polygon'
    type: String,
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
    coordinates: [], // Array of mixed
  },
  contact: {
    phones: [String],
    emails: [String],
    urls: [String],
    social: {},
  },
  ancestors: [IDSchema],
  parent: IDSchema,
}, {
  typeKey: '$type',
});

function processPlace(place) {
  const campus = place.campus;
  const identifier = place.identifier;
  delete place.campus;
  delete place.identifier;
  place._id = {
    campus: campus,
    identifier: identifier,
  };
  return place;
}

PlaceSchema.statics.createPlace = function(place) {
  return this.model('Place').create(processPlace(place));
}

PlaceSchema.statics.createPlaces = function(places) {
  return this.model('Place').create(places.map(processPlace));
}

PlaceSchema.statics.findPlace = function(params) {
  // Object keys order matter
  return this.model('Place').findOne({ _id: {
    campus: params.campus,
    identifier: params.identifier,
  }});
}

PlaceSchema.statics.findPlaces = function(params) {
  // Object keys order matter
  return this.model('Place').find({ _id: {
    campus: params.campus,
    identifier: params.identifier,
  }});
}

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
