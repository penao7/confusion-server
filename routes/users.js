import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.end('respond with a resource');
});

export { router as usersRouter };
