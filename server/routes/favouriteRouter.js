import express from 'express';
import Favourites from '../models/favourites.js';
import { verifyOrdinaryUser, verifyAdminUser } from '../authenticate.js';
import { defaultCors as cors, corsWithOptions } from './cors.js';

const favouriteRouter = express.Router();
favouriteRouter.use(express.json());

// Handle favourites

favouriteRouter.route('/')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, verifyOrdinaryUser, (req, res, next) => {
    Favourites.find({ user: req.user._id })
      .populate('user dishes')
      .then(favourites => {
        res.json(favourites)
      });
  })
  .post(corsWithOptions, verifyOrdinaryUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then(favourites => {
        if (favourites !== null) {
          Favourites.findOneAndUpdate(
            { user: req.user._id },
            { $addToSet: { dishes: req.body } },
            { safe: true, new: true })
            .then(favourites => {
              Favourites.findById(favourites._id)
                .populate('user dishes')
                .then(favourites => {
                  console.log('Favourite created!');
                  res.json(favourites)
                });
            }, err => next(err))
            .catch(err => next(err));
        }
        else {
          Favourites.create({ user: req.user._id })
            .then(favourites => {
              favourites.dishes.push(req.body);
              favourites.save()
                .then(favourites => {
                  Favourites.findById(favourites._id)
                    .populate('user dishes')
                    .then(favourites => {
                      console.log('Favourite created!');
                      res.json(favourites)
                    });
                }, err => next(err))
            })
            .catch(err => next(err));
        };
      })
      .catch(err => next(err));
  })
  .put(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites');
  })
  .delete(corsWithOptions, verifyOrdinaryUser, (req, res, next) => {
    Favourites.deleteOne({ user: req.user._id })
      .then(result => {
        Favourites.findById(favourites._id)
          .populate('user dishes')
          .then(favourites => {
            console.log('Favourite created!');
            res.json(favourites)
          });
      }, err => next(err))
      .catch(err => next(err));
  });

// Handle favourites with dishId

favouriteRouter.route('/:dishId')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, verifyOrdinaryUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then(favourites => {
        if (!favourites) {
          return res.json({ 'exists': false, "favourites": favourites });
        }
        else {
          if (favourites.dishes.indexOf(req.params.dishId) < 0) {
            return res.json({ 'exists': false, "favourites": favourites });
          }
          else {
            return res.json({ 'exists': true, "favourites": favourites });
          }
        }
      }, err => next(err))
      .catch(err => next(err))
  })
  .post(corsWithOptions, verifyOrdinaryUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then(favourites => {
        if (favourites) {
          if (!favourites.dishes.some(dish => dish.equals(req.params.dishId))) {
            favourites.dishes.push(req.params.dishId);
            favourites.save()
              .then(favourites => {
                Favourites.findById(favourites._id)
                  .populate('user dishes')
                  .then(favourites => {
                    console.log('Favourite created!');
                    res.json(favourites)
                  }, err => next(err));
              })
              .catch(err => next(err));
          }
          else {
            const err = new Error('Favourite already exists on the list')
            err.status = 403;
            next(err);
          };
        } else {
          const err = new Error('Favourite account not found')
          err.status = 404;
          next(err)
        }
      }).catch(err => next(err));
  })
  .put(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /favourites/'
      + req.params.dishId);
  })
  .delete(corsWithOptions, verifyOrdinaryUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id, dishes: req.params.dishId })
      .then(favourites => {
        if (favourites) {
          if (req.user._id.equals(favourites.user)) {
            favourites.dishes.pull(req.params.dishId);
            favourites.save()
              .then((favourites) => {
                Favourites.findById(favourites._id)
                  .populate('user dishes')
                  .then(favourites => {
                    console.log('Favourite created!');
                    res.json(favourites)
                  });
              }, err => next(err));
          } else {
            const err = new Error('You can only modify your own favourites');
            err.status = 404;
            return next(err);
          };
        } else {
          const err = new Error('Couldnt find favourite: favourite not found');
          err.status = 404;
          return next(err);
        }
      }).catch(err => next(err))
  });

export default favouriteRouter;