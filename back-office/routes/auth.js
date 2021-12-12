const path = require('path');
const router = require('express').Router();
const createError = require('http-errors');
const logger = require('../../logger');
const Dipendente = require('./../mongo/dipendente');
const SessionService = require('../../services/auth');
// const home = require('./home');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  logger.info("in login GET");
  // TODO: send the login.html

  logger.info("req.session: " + JSON.stringify(req.session));
  res.sendFile(path.join(__dirname, '../public/templates/login.html'));
  // res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  logger.info("in login POST");
  logger.info('Form: ' + JSON.stringify(req.body));
  logger.info('User: ' + JSON.stringify(req.session.user));
  logger.info('Session: ' + JSON.stringify(req.session));


  if ( req.session.user ){
    throw new Error( 'User already logged in!' );
  }

  let data;
  SessionService.authentication(req.body.user, req.body.psw)
  .then((user) => { SessionService.generate(req.session, user); })
  .then( success_login )
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
  logger.info("in logout GET");

  SessionService.destroy(req.session, res);

  res.redirect('/nnplus/login')
});

module.exports = router;
