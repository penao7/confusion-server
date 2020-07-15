import express from 'express';
import User from '../models/user.js';

var userRouter = express.Router();
userRouter.use(express.json());

/* GET users listing. */
userRouter.get('/', (req, res, next) => {
  res.end('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user !== null) {
        const err = new Error('User ' + req.body.username + ' already exists');
        err.status = 403;
        next(err);
      }
      else {
        User.create({
          username: req.body.username,
          password: req.body.password
        })
          .then(user => {
            res.json({ status: 'Registration Succesful', user: user });
          }, err => next(err))
          .catch(err => next(err));
      };
    });
});

userRouter.post('/login', (req, res, next) => {

  if (!req.session.user) {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      const err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    };

    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    User.findOne({ username: username })
      .then(user => {
        if (user === null) {
          const err = new Error('Username does not exist');
          err.status = 401;
          return next(err);
        }
        else if (user.password !== password) {
          const err = new Error('Your password is incorrect!');
          err.status = 401;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.end('You are authenticated!');
        };
      }, err => next(err))
      .catch(err => next(err));
  }
  else {
    res.end('You are already authenticated!');
  };
});

userRouter.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } 
  else {
    const err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  };
});

export default userRouter;
