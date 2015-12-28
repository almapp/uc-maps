const express = require('express');
const mongoose = require('mongoose');

const Place = mongoose.model('Place');

const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    Place.find({}).lean()
      .then(places => res.send(places))
      .catch(next);
  });

router.route('/:campus')
  .get((req, res, next) => {
    const query = {
      campus: req.params.campus,
      identifier: req.params.campus,
    };
    Place.findPlace(query).lean()
      .then(places => res.send(places))
      .catch(next);
  });

router.route('/:campus/:identifier')
  .get((req, res, next) => {
    const query = {
      campus: req.params.campus,
      identifier: req.params.identifier,
    };
    Place.findPlaces(query).lean()
      .then(places => res.send(places))
      .catch(next);
  });

module.exports = router;
