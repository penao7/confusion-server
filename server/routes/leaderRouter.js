import express from 'express';
import Leaders from '../models/leaders.js';
import { verifyUser } from '../authenticate.js';

const leaderRouter = express();

leaderRouter.route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then((leaders) => {
        res.json(leaders);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        res.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
  })
  .delete(verifyUser, (req, res, next) => {
    Leaders.deleteMany({})
      .then((resp) => {
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err))
  });

// Handle leaders with id

leaderRouter.route('/:leaderId')
  .get((req, res) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        res.json(leader);
      }, (err) => next(err))
      .catch(err => next(err))
  })
  .post(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'
      + req.params.leaderId
    );
  })
  .put(verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
      $set: req.body
    }, { new: true })
      .then((leader) => {
        res.json(leader)
      }, (err) => next(err))
      .catch(err => next(err))
  })
  .delete(verifyUser, (req, res) => {
    Leaders.findOneAndDelete(req.params.leaderId)
      .then((resp) => {
        res.json(resp);
      }, (err) => next(err))
      .catch(err => next(err))
  });

export default leaderRouter;