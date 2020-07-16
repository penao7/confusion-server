import express from 'express';
import Dishes from '../models/dishes.js';
import { verifyUser } from '../authenticate.js';

const dishRouter = express.Router();
dishRouter.use(express.json());

// Handle dishes

dishRouter.route('/')
  .get((req, res, next) => {
    Dishes.find({})
      .then((dishes) => {
        res.json(dishes);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish Created', dish);
        res.json(dish);
      }, (err) => next(err))
      .catch(err => console.log(err))
  })
  .put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes')
  })
  .delete(verifyUser, (req, res, next) => {
    Dishes.deleteMany({})
      .then((resp) => {
        res.json(resp);
      }, (err) => next(err))
      .catch(err => console.log(err));
  });

// Handle dishes with id

dishRouter.route('/:dishId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'
      + req.params.dishId
    )
  })
  .put(verifyUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
    }, { new: true })
      .then((dish) => {
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(verifyUser, (req, res) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then((resp) => {
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Dishes comments

dishRouter.route('/:dishId/comments')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish !== null) {
          res.json(dish.comments);
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        };
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        if (dish !== null) {
          dish.comments.push(req.body);
          dish.save()
            .then((dish) => {
              res.json(dish);
            }, (err) => next(err));
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        };
      }, (err) => next(err))
      .catch(err => console.log(err))
  })
  .put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
      + req.params.dishId + '/comments'
    );
  })
  .delete(verifyUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: { comments: [] }
    }, { new: true })
      .then((dish) => {
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Handle comments with id

dishRouter.route('/:dishId/comments/:commentId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
          res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish === null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comments ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        };
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'
      + req.params.dishId + '/comments/' + req.params.commentId
    );
  })
  .put(verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating
          };
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment
          };
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
            });
        }
        else if (dish === null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comments ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        };
      })
      .catch((err) => next(err));
  })
  .delete(verifyUser, (req, res) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
          dish.comments.id(req.params.commentId).remove();
          dish.save()
            .then((dish) => {
              res.statusCode = 200,
                res.setHeader('Content-Type', 'application/json'),
                res.json(dish)
            }, (err) => next(err));
        }
        else if (dish === null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comments ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        };
      });
  });

export default dishRouter;