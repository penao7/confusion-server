import express from 'express';
import { verifyOrdinaryUser, verifyAdminUser } from '../authenticate.js';
import multer from 'multer';
import { defaultCors as cors, corsWithOptions } from './cors.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can upload only image files'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter
});

const uploadRouter = express.Router();
uploadRouter.use(express.json());

uploadRouter.route('/')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload')
  })
  .post(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, upload.single('imageFile'), (req, res) => {
    res.json(req.file);
  })
  .put(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload')
  })
  .delete(corsWithOptions, verifyOrdinaryUser, verifyAdminUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload')
  });

export default uploadRouter;