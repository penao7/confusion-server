import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';

export default passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

