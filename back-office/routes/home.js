const path = require('path');
const router = require('express').Router();
const logger = require('../../logger.js');
const util = require('util');
const SessionService = require('../../services/auth');

/* GET users listing. */
router.get('/', (req, res, next) => {
    logger.info("in pre-home GET");
    SessionService.authorization(req, res, next, '/nnplus/logout', '/nnplus/login', 'dip');
  }, function(req, res, next) {
    logger.info("in home GET");
    // TODO: send the login.html
    req.session.mail = "vladimira@putinia";
    logger.info("req.session: " + JSON.stringify(req.session));
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
