const express = require('express');
const Router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('./../controllers/authController');

Router.get(
  '/tour/:slug',
  authController.isLoggedIn,
  authController.protect,
  viewController.getTour,
);
Router.get('/', authController.isLoggedIn, viewController.getOverview);

Router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
Router.get('/me', authController.protect, viewController.getAccount);

Router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);

module.exports = Router;
