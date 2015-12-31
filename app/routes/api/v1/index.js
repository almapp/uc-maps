const express = require('express');
const mongoose = require('mongoose');

const router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
  const near = req.query.near;
  if (near && near.lat && near.lon) {
    req.query.near = {
      $near: {
        $geometry: {
          type : "Point" ,
          coordinates : [Number(near.lon), Number(near.lat)],
        },
        $maxDistance : Number(near.distance) || 20000,
      },
    };
  }
  next();
});

router.use('/campuses', require('./campuses'));
router.use('/places', require('./places'));

router.use((err, req, res, next) => {
  if (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'PRODUCTION') {
    delete err.stack;
  }
  res.status(err.statusCode || 500).json(err);
});

module.exports = router;
