var helper = require("../utils");
var mongoose = require("mongoose");

const component_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  list: {
    type: [String],
  },
});

const Component = helper.get_model("Component", component_schema);

module.exports = Component;
