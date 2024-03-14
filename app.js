const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const path = require('path');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

require('dotenv').config();
// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  hpp({
    whiteList: [
      'ratingAverage',
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  }),
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extened: true, limit: '10kb' }));

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('api/v1/booking', bookingRouter);

app.all('*', (req, res) => {
  next(new AppError(`can not find ${req.originalUrl} on the sever`, 404));
});
app.use(globalErrorHandler);

// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      // scriptSrc: ["'self'", 'https://*.cloudflare.com'],
      // scriptSrc: ["'self'", 'https://*.stripe.com'],
      scriptSrc: ["'self'", 'https://*.mapbox.com'],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      workerSrc: ["'self'", 'data:', 'blob:'],
      childSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
      upgradeInsecureRequests: [],
    },
  }),
);
module.exports = app;
