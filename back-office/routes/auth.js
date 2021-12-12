const path = require('path');
const router = require('express').Router();
const createError = require('http-errors');
const logger = require('../../logger');
const Dipendente = require('./../mongo/dipendente');
const SessionService = require('../../services/auth');


// router.get('/login', function (req, res, next) {
router.get('/login', function(req, res, next) {
    logger.info('in pre-login GET');
    SessionService.already_logged(req, res, next, '/nnplus/home');
  }, function(req, res, next) {
    logger.info("in login GET");
    
    res.sendFile(path.join(__dirname, '../public/templates/login.html'));
});

router.post('/login', function(req, res, next) {
    logger.info('in pre-login POST');
    SessionService.already_logged(req, res, next, '/nnplus/home');
  }, function(req, res, next) {
    logger.info("in login POST");
    logger.info('Form: ' + JSON.stringify(req.body));
    logger.info('User: ' + JSON.stringify(req.session.user));
    logger.info('Session: ' + JSON.stringify(req.session));

    let data;
    SessionService.authentication(req.body.user, req.body.psw)
    .then((user) => { SessionService.generate(req.session, user); })
    .then( successful_login )
    .catch( wrong_credentials )
    .finally( send_result );

    function successful_login(){
      logger.info("req session: " + JSON.stringify(req.session));

      let href = req.protocol + '://' + req.hostname  + ':8000' + '/nnplus/home';
      data = { 'url': href, 'success': true};
    }

    function wrong_credentials(err){
      logger.error(err);
      data = { 'url': '', 'success': false};
    }

    function send_result(){
      logger.info("req session: " + JSON.stringify(req.session));
      logger.info("data: " + JSON.stringify(data));

      res.send(data);
    }
});

router.get('/logout', function(req, res, next) {
  logger.info('in pre-logout GET');
  SessionService.not_already_logged(req, res, next, '/nnplus/login');
}, function(req, res, next) {
  logger.info("in logout GET");

  SessionService.destroy(req.session, res);

  res.redirect('/nnplus/login')
});

module.exports = router;
