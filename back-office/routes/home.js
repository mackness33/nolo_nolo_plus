const path = require('path');
const router = require('express').Router();
const logger = require('../../logger.js');
const util = require('util');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info("in home GET");
  // TODO: send the login.html
  res.locals.requested_url = req.protocol + '://' + req.hostname  + '8000' + req.path;
  logger.info(res.locals.requested_url);
  logger.info("req PATH: " + res.locals.requested_url);
  res.sendFile(path.join(__dirname, '../public/templates/empl_home.html'));
  // res.send('respond with home res');
  logger.info("end home GET");
});

// router.post('/', function(req, res, next) {
//   logger.info("in login POST");
//   logger.info('Form: ' + JSON.stringify(req.body));
//   res.send('respond with a resource');
// });

// logger.info('Form: ' + util.inspect(req, { depth: null }));

module.exports = router;
