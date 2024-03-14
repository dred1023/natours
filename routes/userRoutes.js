const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'public/img/users' }); //調用muler拿到圖片路徑

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser,
);

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAllUsers,
);
router.post('/', userController.createUser, authController.protect);

router
  .route('/:id')
  .get(userController.getUser, authController.protect)
  .patch(
    userController.updateUser,
    authController.protect,
    authController.restrictTo('admin'),
  )
  .delete(
    userController.deleteUser,
    authController.protect,
    authController.restrictTo('admin'),
  );

module.exports = router;
