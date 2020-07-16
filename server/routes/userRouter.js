import express from 'express';
import User from '../models/user.js';
import passport from 'passport';
import { getToken } from '../authenticate.js';
import user from '../models/user.js';

var userRouter = express.Router();
userRouter.use(express.json());

/* GET users listing. */
userRouter.get('/', (req, res, next) => {
  res.end('respond with a resource');
});

userRouter.post('/signup', (req, res) => {
  User.register(new User({username: req.body.username }), req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode= 500,
        res.json({ err: err })
      }
      else {
        if(req.body.firstname) {
          user.firstname = req.body.firstname;
        };
        if(req.body.lastname) {
          user.lastname = req.body.lastname
        };
        user.save(err => {
          if(err) {
            res.statusCode = 500;
            res.json({err: err});
            return;
          };
          passport.authenticate('local')(req, res, () => {
            res.json({ success: true, status: 'Registration Succesful' });
          });
        });
      };
    });
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {

  const token = getToken({ _id: req.user._id });
  res.json({ success: true, token: token, status: 'You are successfully logged in' });

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
