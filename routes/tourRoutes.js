const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const Router = express.Router();
Router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);

Router.get(
  '/top-5/cheap',
  tourController.aliasTopTours,
  tourController.getAllTours,
);
Router.get('/tour-stats', tourController.getTourStats);
Router.get(
  '/monthly-plan/:year',
  tourController.getMothlyPlan,
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
);

Router.get('/', tourController.getAllTours);
Router.post(
  '/',
  tourController.createTour,
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
);
Router.get('/:id', tourController.getTour);
Router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  tourController.updateTour,
);

Router.delete('/:id', authController.protect);
Router.delete('/:id', authController.restrictTo('admin', 'lead-guide'));
Router.delete('/:id', tourController.deleteTour);

Router.get(
  '/tours-within/:distance/center/:latlng/unit/:unit',
  tourController.getToursWithin,
);
// /tours-within?distance=233&center=-40,45&unit=mi
//distance=距離範圍 center=-40緯度.45經度  unit距離單位 哩
// /tours-within/233/center/-40,45/unit/mi

Router.get('/distances/:latlng/unit/:unit', tourController.getDistances);
module.exports = Router;
