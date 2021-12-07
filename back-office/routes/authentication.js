const path = require('path');
const router = require('express').Router();
const createError = require('http-errors');
const logger = require('../../logger');
const Dipendente = require('./../mongo/dipendente');
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

  Dipendente.then((model) => {
    return model.findOne({ 'user': req.body.user, 'psw': req.body.psw});
  })
    .then(start_session)
    .then((resolve) => { res.send(resolve); })
    .catch((reason) => {
      logger.fatal(reason);
      next(createError(500));
    });

  async function start_session(query){
    logger.info("query: " + query);

    if (query === null)
      throw new Error("User not found");

    // logger.info("query: " + query);
    req.session.user = query.user;

    logger.info("req session: " + JSON.stringify(req.session));

    let href = req.protocol + '://' + req.hostname  + ':8000' + '/nnplus/home';
    // let href = '';
    let data = { 'url': href, 'session': query };
    logger.info("data: " + JSON.stringify(data));

    return data;
  }

});

router.get('/logout', function(req, res, next) {
  logger.info("in logout GET");

  logger.info("req session: " + JSON.stringify(req.session));

  req.session.destroy(function(err) {
    logger.info('Destroying the session!');
  });

  logger.info("req session: " + JSON.stringify(req.session));
});

module.exports = router;
