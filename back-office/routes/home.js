const path = require('path');
const router = require('express').Router();
const logger = require('../../logger.js');
const util = require('util');
const SessionService = require('../../services/auth');

/* GET users listing. */
router.get('/',
  (req, res, next) => {
    logger.info("in pre-home GET");
    SessionService.authorization(req, res, next, '/nnplus/logout', '/nnplus/login', 2);
  }, function(req, res, next) {
    logger.info("in home GET");

    res.sendFile(path.join(__dirname, '../public/templates/users.html'));
  }
);

// router.post('/', function(req, res, next) {
//   logger.info("in login POST");
//   logger.info('Form: ' + JSON.stringify(req.body));
//   res.send('respond with a resource');
// });

// logger.info('Form: ' + util.inspect(req, { depth: null }));

module.exports = router;
