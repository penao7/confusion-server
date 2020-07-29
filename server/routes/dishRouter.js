import express from 'express';
import Dishes from '../models/dishes.js';
import { verifyOrdinaryUser, verifyAdminUser } from '../authenticate.js';
import { defaultCors as cors, corsWithOptions } from './cors.js';

const dishRouter = express.Router();
dishRouter.use(express.json());

// Handle dishes

dishRouter.route('/')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Dishes.find(req.query)
      .populate('comments.author')
      .then((dishes) => {
        res.json(dishes);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish Created', dish);
        res.json(dish);
      }, (err) => next(err))
      .catch(err => console.log(err))
  })
  .put(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes')
  })
  .delete(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    Dishes.deleteMany({})
      .then((resp) => {
        res.json(resp);
      }, (err) => next(err))
      .catch(err => console.log(err));
  });

// Handle dishes with id

dishRouter.route('/:dishId')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
      .then((dish) => {
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'
      + req.params.dishId
    );
  })
  .put(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
    }, { new: true })
      .then((dish) => {
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then((resp) => {
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

export default dishRouter;