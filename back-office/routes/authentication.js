const path = require('path');
const router = require('express').Router();
const logger = require('../../logger');
const util = require('util');
const home = require('./home');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info("in login GET");
  // TODO: send the login.html

  res.sendFile(path.join(__dirname, '../public/templates/login.html'));
  // res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  logger.info("in login POST");
  logger.info('Form1: ' + req);
  // logger.info('Form: ' + util.inspect(req, { depth: null }));
  logger.info('Form: ' + JSON.stringify(req.body));
  // res.send('respond with a resource');
  // res.redirect(301, '/nnplus/home');
  // next(home);

  // TODO: use 'url package to redirect in an easier way'
  let href = req.protocol + '://' + req.hostname  + ':8000' + '/nnplus/home';

  let data = { 'url': href };
  logger.info("href: " + JSON.stringify(data));
  res.send(data);
});

// router.post('/login', function(req, res, next) {
//     // Read username and password from request body
//     const { username, password } = req.body;
//
//     // Filter user from the users array by username and password
//     const user = users.find(u => { return u.username === username && u.password === password });
//
//     console.log( "user: " + user );
//     if (user) {
//         // Generate an access token
//         const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret);
//
//         res.json({
//             accessToken
//         });
//     } else {
//         res.send('Username or password incorrect');
//     }
// });

module.exports = router;
