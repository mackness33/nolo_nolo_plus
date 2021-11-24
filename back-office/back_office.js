// INFO: how to start the server DEBUG=app:* npm start

require('dotenv').config({ path: __dirname + '/bin/.env' });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./../logger');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./routes/authentication');
const homeRouter = require('./routes/home');

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', authRouter);
app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use('/', function(req, res, next) {
  // logger.info("In back_office, back at y'all");
  // logger.info('Form: ' + util.inspect(req, { depth: null }));
  // logger.warn("");
  logger.warn("resource " + JSON.stringify(req.url) + " not found");
  // logger.info("res: " + JSON.stringify(res.url));
  next();
  // next(createError(404));
  // res.send('back_office');
});


module.exports = app;
