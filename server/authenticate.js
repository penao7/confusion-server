import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';
import JwtPassport from 'passport-jwt';
import jwt from 'jsonwebtoken';
import FacebookTokenStrategy from 'passport-facebook-token';
import config from './config.js';


const JwtStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

export const local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = (user) => {
  return jwt.sign(
    user,
    config.secretKey,
    { expiresIn: 3600 }
  );
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

export const jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    User.findById(jwt_payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      else if (user) {
        return done(null, user);
      }
      else {
        return done(null, false);
      };
    });
  }
));

export const verifyOrdinaryUser = passport.authenticate('jwt', { session: false });

export const verifyAdminUser = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    const err = new Error('You are not authorized to perform this operation!')
    err.status = 403;
    return next(err);
  };
};

export const facebookPassport = passport.use(new FacebookTokenStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookId: profile.id }, (err, user) => {
    console.log(profile.id);
    if (err) {
      return done(err, false);
    };
    if (!err && user !== null) {
      return done(null, user);
    }
    else {
      user = new User({ username: profile.displayName });
      user.facebookId = profile.id;
      user.email = profile.email;
      user.firstname = profile.name.givenName;
      user.lastname = profile.name.familyName;
      user.save((err, user) => {
        if (err) {
          return done(err, false);
        }
        else {
          return done(null, user);
        };
      });
    };
  });
}));