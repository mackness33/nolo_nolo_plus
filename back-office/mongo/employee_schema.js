const mongoose = require("mongoose");
const { Schema } = mongoose.Schema();
const helper = require("./base");

const employee_schema = mongoose.Schema({
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
    require,
  },
});

const Employee = helper.get_model("Employee", employee_schema);

module.exports = Employee;
