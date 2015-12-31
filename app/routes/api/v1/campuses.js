const express = require('express');
const mongoose = require('mongoose');

const Place = mongoose.model('Place');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get((req, res, next) => {
    const query = {
      categories: 'campus'
    };
    Place.find(query).lean(query)
      .then(places => res.send(places))
      .catch(next);
  });

router.use('/:id', (req, res, next) => {
  req.params.id = req.params.id.toUpperCase();
  req.campus = Place.getID({ campus: req.params.id });
  next();
});

router.route('/:id')
  .get((req, res, next) => {
    Place.findOne({ _id: req.campus }).lean()
      .then(place => res.send(place))
      .catch(next);
  });

router.route('/:id/faculties')
  .get((req, res, next) => {
    const query = {
      ancestors: req.campus,
      categories: 'faculty',
    };
    Place.find(query).lean()
      .then(places => res.send(places))
      .catch(next);
  });

router.route('/:id/places')
  .get((req, res, next) => {
    const query = {
      ancestors: req.campus,
    };
    if (req.query.categories) query.categories = { $in: [req.query.categories] };
    if (req.query.near) query.location = req.query.near;

    Place.find(query).lean()
      .then(places => res.send(places))
      .catch(next);
  });

router.route('/:id/places/:place_id')
  .get((req, res, next) => {
    const query = {
      ancestors: req.campus,
      identifier: req.params.place_id,
    };
    Place.findOne(query).lean()
      .then(place => res.send(place))
      .catch(next);
  });

module.exports = router;
