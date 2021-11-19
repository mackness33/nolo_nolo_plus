// INFO: how to start the server DEBUG=app:* npm start

require('dotenv').config({ path: __dirname + '/bin/.env' });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./../logger');
const morgan = require('morgan');
var mongoose = require('mongoose');
var helper = require('./mongo/base');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var pedaloRouter = require('./routes/pedalo');

var app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/pedalo', pedaloRouter);

// catch 404 and forward to error handler
app.use('/', function(req, res, next) {
  logger.info("In back_office, back at y'all");
  // next(createError(404));
  next();
});

module.exports = app;
