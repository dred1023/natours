const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const Router = express.Router({ mergeParams: true });

Router.use(authController.protect);

Router.get('/', reviewController.getAllReviews);
Router.post(
  '/',
  authController.protect,
  authController.restrictTo('user'),
  reviewController.setTourUserId,
  reviewController.createReview
);

Router.get('/:id', reviewController.getReview);
Router.delete('/:id', reviewController.deleteReview);
Router.patch(
  '/:id',
  authController.restrictTo('user', 'admin'),
  reviewController.updateReview
);

module.exports = Router;
