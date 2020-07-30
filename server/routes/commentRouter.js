import express from 'express';
import Comments from '../models/comments.js';
import { verifyOrdinaryUser, verifyAdminUser } from '../authenticate.js';
import { defaultCors as cors, corsWithOptions } from './cors.js';

const commentRouter = express.Router();
commentRouter.use(express.json());

commentRouter.route('/')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Comments.find(req.query)
      .populate('author')
      .then((comments) => {
        res.json(comments);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyOrdinaryUser, (req, res, next) => {
    if (req.body !== null) {
      req.body.author = req.user._id;
      Comments.create(req.body)
        .then(comment => {
          Comments.findById(comment._id)
            .populate('author')
            .then(comment => {
              res.json(comment);
            })
        }, err => next(err))
        .catch(err => next(err));
    }
    else {
      err = new Error('Comment not found in request body');
      err.status = 404;
      return next(err);
    }
  })
  .put(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments/');
  })
  .delete(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    Comments.remove({})
      .then(resp => {
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

// Handle comments with id

commentRouter.route('/:commentId')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .populate('author')
      .then((comment) => {
        res.json(comment);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /comments/'
      + req.params.commentId);
  })
  .put(corsWithOptions, verifyOrdinaryUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .then((dish) => {
        if (comment) {
          if (!comment.author.equals(req.user._id)) {
            const err = new Error('You are not authorized to update this comment');
            err.status = 403;
            return next(err);
          };
          req.body.author = req.user._id;
          Comments.findByIdAndUpdate(req.params.commentId, {
            $set: req.body
          }, { new: true })
            .then(comment => {
              Comments.findById(comment._id)
                .populate('author')
                .then(comment => {
                  res.json(comment);
                })
            }, (err) => next(err));
        }
        else {
          const err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        };
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(corsWithOptions, verifyOrdinaryUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .then(comment => {
        if (comment) {
          if (!comment.author.equals(req.user._id)) {
            const err = new Error('You are not authorized to delete this comment');
            err.status = 403;
            return next(err);
          };
          Comments.findByIdAndRemove(req.params.commentId)
            .then(resp => {
              res.json(resp);
            }, err => next(err))
            .catch(err => next(err));
        }
        else {
          const err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        };
      }, err => next(err))
      .catch(err => next(err));
  });

export default commentRouter;