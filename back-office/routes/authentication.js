const path = require('path');
const router = require('express').Router();
const logger = require('../../logger');
const util = require('util');
const home = require('./home');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info("in login GET");
  // TODO: send the login.html

  res.sendFile(path.join(__dirname, '../public/templates/login.html'));
  // res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  logger.info("in login POST");
  logger.info('Form1: ' + req);
  // logger.info('Form: ' + util.inspect(req, { depth: null }));
  logger.info('Form: ' + JSON.stringify(req.body));
  // res.send('respond with a resource');
  res.redirect(301, '/nnplus/home');
  // next(home);
});

module.exports = router;
