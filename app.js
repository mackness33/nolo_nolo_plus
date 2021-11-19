// INFO: how to start the server DEBUG=app:* npm start

require('dotenv').config({ path: __dirname + '/bin/.env' });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./logger.js');
const morgan = require('morgan');
var mongoose = require('mongoose');
var helper = require('./mongo/base');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pedaloRouter = require('./routes/pedalo');

var back_office = require('./back-office/back_office');

var app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', back_office);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pedalo', pedaloRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  logger.warn("Error occured");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // TODO: find another way to rendere the error. Without Jade
  // res.render('error');
  logger.error(err.status + " - " + err.message);

  res.status(err.status).send(err.message);
});

module.exports = app;
