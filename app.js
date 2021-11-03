// INFO: how to start the server DEBUG=app:* npm start


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kittenRouter = require('./routes/mongo_ex_url');
var pedaloRouter = require('./routes/pedalo');

var app = express();

// view engine setup
// TODO: uninstall Jade
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/kitten', kittenRouter);
app.use('/pedalo', pedaloRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("Error occured");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // TODO: find another way to rendere the error. Without Jade
  res.render('error');
});

module.exports = app;
