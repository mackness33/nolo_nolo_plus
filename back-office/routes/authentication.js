const path = require('path');
const router = require('express').Router();
const logger = require('../../logger.js');
const util = require('util');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  logger.info("in login GET");
  // TODO: send the login.html

  res.sendFile(path.join(__dirname, '../public/templates/login2.html'));
  // res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  logger.info("in login POST");
  logger.info('Form1: ' + req);
  // logger.info('Form: ' + util.inspect(req, { depth: null }));
  logger.info('Form: ' + JSON.stringify(req.body));
  res.send('respond with a resource');
});

module.exports = router;
