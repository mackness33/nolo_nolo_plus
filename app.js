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

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// //Set up default mongoose connection
// var mongoDB = 'mongodb://127.0.0.1:27017/test';
// mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//
// //Get the default connection
// var db = mongoose.connection;
//
// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// const fluffy = new Kitten({ name: 'fluffy' });
// fluffy.speak(); // "Meow name is fluffy"
//
// await fluffy.save();
// fluffy.speak();
//
// const kittens = await Kitten.find();
// console.log(kittens);
//
// await Kitten.find({ name: /^fluff/ });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/kitten', kittenRouter);

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
  res.render('error');
});

module.exports = app;
