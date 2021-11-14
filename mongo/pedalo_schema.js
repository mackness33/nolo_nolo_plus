require('dotenv').config({path: __dirname + '../bin/.env'});
var helper = require('./base');
var mongoose = require('mongoose');

const pedaloSchema = new mongoose.Schema({
  name: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
pedaloSchema.methods.check = function check() {
  const greeting = this.name
    ? "Pedalo name is " + this.name
    : "It doesn't have a name";
  console.log(greeting);
};

const Pedalo = helper.get_model('Pedalo', pedaloSchema);

module.exports = Pedalo;
