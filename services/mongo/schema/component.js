var helper = require("../utils");
var mongoose = require("mongoose");

const component_schema = new mongoose.Schema({
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = component_schema;
