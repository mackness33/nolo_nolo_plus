require('dotenv').config({path: __dirname + '../bin/.env'});
const logger = require('./../../logger');
var helper = require('./base');
var mongoose = require('mongoose');

const dipendenteSchema = new mongoose.Schema({
  user: String,
  psw: String,
  role: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
dipendenteSchema.methods.check = function check() {
  const greeting = this.name
    ? "Dipendente name is " + this.name
    : "It doesn't have a name";
  logger.info(greeting);
};

const Dipendente = helper.get_model('Dipendente', dipendenteSchema);

module.exports = Dipendente;
