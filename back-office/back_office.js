// INFO: how to start the server DEBUG=app:* npm start

require('dotenv').config({ path: __dirname + '/bin/.env' });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./../logger');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const authService = require('../services/auth');
// const Mon = require('connect-mongodb');

const authRouter = require('./routes/authentication');
const homeRouter = require('./routes/home');

const app = express();

// app.use(session({
//   secret: 'keyboard cat',
//   cookie: { maxAge: 36000 },
//   saveUninitialized: false,
//   resave: false
// }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authService.get_session());

app.use('/', authRouter);
app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use('/', function(req, res, next) {
  // logger.info('Form: ' + util.inspect(req, { depth: null }));
  logger.warn("resource " + JSON.stringify(req.url) + " not found");
  next();
});


module.exports = app;
