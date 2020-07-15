import createError from 'http-errors';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import fs from 'session-file-store';

// router imports
import indexRouter from './routes/index.js';
import userRouter from './routes/userRouter.js';
import dishRouter from './routes/dishRouter.js';
import promoRouter from './routes/promoRouter.js';
import leaderRouter from './routes/leaderRouter.js';

// mongoDB connection
const url = 'mongodb://localhost:27017/conFusion';
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
const __dirname = dirname(fileURLToPath(import.meta.url));
const FileStore = fs(session);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express session
app.use(session({
  name: 'session-id',
  secret: 'app-lep-ie',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

// accessible routes without authentication
app.use('/', indexRouter);
app.use('/users', userRouter);

// basic authentication
const auth = (req, res, next) => {

  if (!req.session.user) {
    const err = new Error('You are not authenticated');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
  else {
    if (req.session.user === 'authenticated') {
      next();
    }
    else {
      const err = new Error('You are not authenticated');
      err.status = 401;
      return next(err);
    };
  };
};

app.use(auth);

// other routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
