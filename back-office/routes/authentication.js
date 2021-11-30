const path = require('path');
const router = require('express').Router();
const createError = require('http-errors');
const logger = require('../../logger');
const Dipendente = require('./../mongo/dipendente');
// const home = require('./home');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info("in login GET");
  // TODO: send the login.html

  res.sendFile(path.join(__dirname, '../public/templates/login.html'));
  // res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
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
    if (query === null)
      throw new Error("Problem with the check of users");

    logger.info("query: " + query);

    let href = req.protocol + '://' + req.hostname  + ':8000' + '/nnplus/home';
    // let href = '';
    let data = { 'url': href, 'session': query };
    logger.info("data: " + JSON.stringify(data));

    return data;
  }

});

module.exports = router;
