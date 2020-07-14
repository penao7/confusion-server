import createError from 'http-errors';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { indexRouter } from './routes/index.js';
import { usersRouter } from './routes/users.js';
import { dishRouter } from './routes/dishRouter.js';
import { promoRouter } from './routes/promoRouter.js';
import { leaderRouter } from './routes/leaderRouter.js';

import mongoose from 'mongoose';

// MongoDB Connection
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

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
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
  res.end('Error: ' + err);
});

export { app };
