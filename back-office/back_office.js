// INFO: how to start the server DEBUG=app:* npm start

require('dotenv').config({ path: __dirname + '/bin/.env' });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./../logger');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(express.static(path.join(__dirname, 'public')));
// app.use('static', express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use('/', function(req, res, next) {
  logger.info("In back_office, back at y'all");
  // next(createError(404));
  // res.send('back_office');
  next();
});


app.use('/', function(req, res, next) {
  logger.info("sending first file");
  res.sendFile(path.join(__dirname, 'public/login.html'));
  // res.sendFile(path.join(__dirname, 'public/stylesheets/login.css'));
});

module.exports = app;
