import express from 'express';
import User from '../models/user.js';
import Favourites from '../models/favourites.js';
import passport from 'passport';
import { getToken } from '../authenticate.js';
import { verifyOrdinaryUser, verifyAdminUser } from '../authenticate.js';
import { defaultCors as cors, corsWithOptions } from './cors.js';

const userRouter = express.Router();
userRouter.use(express.json());

/* GET users listing. */
userRouter.options('*', corsWithOptions, (req, res) => {
  res.statusCode = 200;
});

userRouter.route('/', cors, verifyOrdinaryUser)
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    User.find({})
      .then(user => {
        res.json(user);
      });
  });

userRouter.post('/signup', corsWithOptions, (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500,
          res.json({ err: err })
      }
      else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        };
        if (req.body.lastname) {
          user.lastname = req.body.lastname
        };
        user.save(err => {
          if (err) {
            res.statusCode = 500;
            res.json({ err: err });
            return;
          };
          User.findOne({ username: req.body.username })
            .then(user => {
              Favourites.create({ user: user._id, dishes: [] })
                .then(favourite => {
                  passport.authenticate('local')(req, res, () => {
                    res.json({ success: true, status: 'Registration Succesful' });
                  });
                });
            });
        });
      };
    });
});

userRouter.post('/login', corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.json({ success: false, status: 'Login Unsuccessful!', err: info });
    };

    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' });
      };

      const token = getToken({ _id: req.user._id });
      res.json({ success: true, token: token, status: 'You have successfully logged in!' });
    });
  })(req, res, next);
});

userRouter.get('/logout', corsWithOptions, (req, res, next) => {
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

userRouter.get('/facebook/token', corsWithOptions, passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    const token = getToken({ _id: req.user._id })
    res.json({ success: true, token: token, status: 'You are successfully logged in' });
  };
});

userRouter.get('/checkJWTToken', corsWithOptions, (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err)
      return next(err)

    if (!user) {
      res.statusCode = 401;
      return res.json({ status: 'JWT invalid!', success: false, err: info })
    }
    else {
      return res.json({ status: 'JWT valid!', success: true, user: user })
    };
  })(req, res);
});

export default userRouter;
