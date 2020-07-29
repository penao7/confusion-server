import createError from 'http-errors';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import config from './config.js';

// router imports
import indexRouter from './routes/index.js';
import userRouter from './routes/userRouter.js';
import dishRouter from './routes/dishRouter.js';
import promoRouter from './routes/promoRouter.js';
import leaderRouter from './routes/leaderRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import favouriteRouter from './routes/favouriteRouter.js';
import commentRouter from './routes/commentRouter.js';

// mongoDB connection
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

connect.then((db) => {
  console.log('Connection established to the MongoDB');
}, (err) => { console.log(err) });

// express usage
const app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  };
});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// accessible routes without authentication
app.use('/', indexRouter);
app.use('/users', userRouter);

// other routes
app.use('/dishes', dishRouter);
app.use('/comments', commentRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/favourites', favouriteRouter);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end('Error ' + err.status + ": " + err.message);
});

export { app };
