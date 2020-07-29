import express from 'express';
import Promos from '../models/promotions.js';
import { verifyOrdinaryUser, verifyAdminUser } from '../authenticate.js';
import { defaultCors as cors, corsWithOptions } from './cors.js';

const promoRouter = express();

promoRouter.route('/')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Promos.find(req.query)
      .then((promos) => {
        res.json(promos);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(corsWithOptions, verifyAdminUser, (req, res, next) => {
    Promos.create(req.body)
      .then(promo => {
        res.json(promo)
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(corsWithOptions, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(corsWithOptions, verifyAdminUser, (req, res, next) => {
    Promos.deleteMany({})
      .then(resp => {
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err));
  });

// Handle promotions with id

promoRouter.route('/:promoId')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res) => {
    Promos.findById(req.params.promoId)
      .then(promo => {
        res.json(promo);
      }, err => next(err))
      .catch(err => next(err))
  })
  .post(corsWithOptions, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'
      + req.params.promoId
    );
  })
  .put(corsWithOptions, verifyAdminUser, (req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })
      .then(promo => {
        res.json(promo);
      }, err => next(err))
      .catch(err => next(err))
  })
  .delete(corsWithOptions, verifyAdminUser, (req, res, next) => {
    Promos.findByIdAndDelete(req.params.promoId)
      .then(resp => {
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

export default promoRouter;
