const mongoose = require("mongoose");

const person_schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
  },
});

person_schema.virtual('full_name').get(function() {
  return `${this.name} ${this.surname}`;
});

module.exports = person_schema;
