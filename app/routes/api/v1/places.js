const express = require('express');
const mongoose = require('mongoose');

const Place = mongoose.model('Place');

const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    const restrictions = [];
    if (req.query.categories instanceof Array) req.query.categories.forEach(cat => restrictions.push({ categories: cat }));
    if (req.query.near) restrictions.push({ location: req.query.near });

    const query = (restrictions.length) ? { $and: restrictions } : {};

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
    const restrictions = [
      { ancestors: req.params.id },
    ];
    if (req.query.categories instanceof Array) req.query.categories.forEach(cat => restrictions.push({ categories: cat }));
    if (req.query.near) restrictions.push({ location: req.query.near });

    const query = { $and: restrictions };
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
