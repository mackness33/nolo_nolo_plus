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

  authentication(res, req.body.user, req.body.psw).then(data => { res.send(data); }).catch(err => {
    logger.warn(err);
    res.send({ 'url': '', 'success': false });
  });


  async function authentication(res, usr, psw){
    let employees = await Dipendente;
    let user = await employees.findOne({ 'user': usr, 'psw': psw });

    logger.info('query: ' + JSON.stringify(user));

    if (user === null)
      // return { 'url': '', 'success': false };
      throw new Error("User not found");

    req.session.regenerate(function(err) {
      logger.info('Creating a new session');
      logger.error(err);

      this.something = 'hola';
    });


    req.session.user = user;

    logger.info("req session: " + JSON.stringify(req.session));

    let href = req.protocol + '://' + req.hostname  + ':8000' + '/nnplus/home';
    let data = { 'url': href, 'success': true};
    logger.info("data: " + JSON.stringify(data));

    return data;
  }

  // Dipendente.then((model) => {
  //   return model.findOne({ 'user': req.body.user, 'psw': req.body.psw});
  // })
  //   .then(start_session)
  //   .then((resolve) => { res.send(resolve); })
  //   .catch((reason) => {
  //     logger.fatal(reason);
  //     next(createError(500));
  //   });
  //
  // async function start_session(query){
  //   logger.info("query: " + query);
  //
  //   if (query === null)
  //     throw new Error("User not found");
  //
  //   // logger.info("query: " + query);
  //   req.session.user = query.user;
  //
  //   logger.info("req session: " + JSON.stringify(req.session));
  //
  //   let href = req.protocol + '://' + req.hostname  + ':8000' + '/nnplus/home';
  //   // let href = '';
  //   let data = { 'url': href, 'session': query };
  //   logger.info("data: " + JSON.stringify(data));
  //
  //   return data;
  // }

});

router.get('/logout', function(req, res, next) {
  logger.info("in logout GET");

  logger.info("req session: " + JSON.stringify(req.session));

  res.clearCookie(req.session.id, { path: "/" });

  req.session.destroy(function(err) {
    logger.info('Destroying the session!');
    if (err === null)
      logger.error('err in destroy: null');
    else
      logger.error('err in destroy: ' + JSON.stringify(err));
  });

  logger.info("req session: " + JSON.stringify(req.session));
  res.redirect('/nnplus/login');
});

module.exports = router;
