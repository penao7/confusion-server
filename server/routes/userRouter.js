import express from 'express';
import User from '../models/user.js';
import passport from 'passport';

var userRouter = express.Router();
userRouter.use(express.json());

/* GET users listing. */
userRouter.get('/', (req, res, next) => {
  res.end('respond with a resource');
});

userRouter.post('/signup', (req, res) => {
  console.log(req.body.username);
  console.log(req.body.password);
  User.register(new User({ username: req.body.username }), req.body.password,
    (err) => {
      if (err) {
        res.json({ err: err })
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.json({ success: true, status: 'Registration Succesful' });
        });
      };
    });
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ success: true, status: 'You are successfully logged in' });
});

userRouter.get('/logout', (req, res, next) => {
  if (req.user) {
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
