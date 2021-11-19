const router = require('express').Router();
const logger = require('./../logger.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info("in users");
  res.send('respond with a resource');
});

module.exports = router;
