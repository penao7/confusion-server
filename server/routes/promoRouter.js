import express from 'express';
import Promos from '../models/promotions.js';

const promoRouter = express();

promoRouter.route('/')
  .get((req, res, next) => {
    Promos.find({})
      .then((promos) => {
        res.json(promos);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Promos.create(req.body)
      .then(promo => {
        res.json(promo)
      }, err => next(err))
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete((req, res, next) => {
    Promos.deleteMany({})
      .then(resp => {
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err));
  });

// Handle promotions with id

promoRouter.route('/:promoId')
  .get((req, res) => {
    Promos.findById(req.params.promoId)
      .then(promo => {
        res.json(promo);
      }, err => next(err))
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'
      + req.params.promoId
    );
  })
  .put((req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })
      .then(promo => {
        res.json(promo);
      }, err => next(err))
      .catch(err => next(err))
  })
  .delete((req, res, next) => {
    Promos.findByIdAndDelete(req.params.promoId)
      .then(resp => {
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

export default promoRouter;
