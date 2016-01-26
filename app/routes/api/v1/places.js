const express = require('express');
const mongoose = require('mongoose');

const Place = mongoose.model('Place');

const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    const query = {};
    if (req.query.categories instanceof Array) query.categories = { $in: req.query.categories };
    if (req.query.near) query.location = req.query.near;

    Place.find(query).lean()
      .then(places => res.send(places))
      .catch(next);
  });

router.route('/categories')
  .get((req, res, next) => {
    Place.find().distinct("categories")
      .then(categories => res.send(categories))
      .catch(next);
  });

router.route('/:id')
  .get((req, res, next) => {
    Place.findOne({ _id: req.params.id }).lean()
      .then(places => res.send(places))
      .catch(next);
  });

router.route('/:id/childs')
  .get((req, res, next) => {
    const query = { ancestors: req.params.id };
    if (req.query.categories instanceof Array) query.categories = { $in: req.query.categories };
    if (req.query.near) query.location = req.query.near;

    Place.find(query).lean()
      .then(places => res.send(places))
      .catch(next);
  });

router.route('/:id/childs/categories')
  .get((req, res, next) => {
    const query = {
      ancestors: req.params.id,
    };
    Place.find(query).distinct("categories")
      .then(categories => res.send(categories))
      .catch(next);
  });

module.exports = router;
