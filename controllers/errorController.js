const AppError = require('../utils/appError');
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return next(new AppError(message, 400));
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  // console.log(value);

  const message = `Duplicate field ${value}. Please use another value!`;

  return next(new AppError(message, 400));
};

const handleJWTError = () =>
  new AppError('Invalid token . Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('你的token已經過期,請重新登入驗證', 401);

const sendErrorDev = (err, req, res) => {
  // api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).send({
      name: err.name,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } // render webside
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // operational error:send error message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
      });

      // programming or other unknow eerror:don't leak error details
    }
    // 1.Log error
    console.error('Error!', err);
    // 2.send generic message
    return res.status(500).send({
      status: 'error',
      message: 'Something went very wrong',
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
      });
    }
    console.log('Error❌', err);

    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: 'Please try again',
    });
  }
};
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('production now');

    let error = JSON.parse(JSON.stringify(err));

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, res);
  }
};
