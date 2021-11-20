const router = require('express').Router();
const logger = require('../../logger.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info("in index");
  res.send('Index');
  // res.render('index', { title: 'Express' });
});

module.exports = router;
