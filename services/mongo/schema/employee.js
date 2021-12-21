const req = require("express/lib/request");
const mongoose = require("mongoose");
const { Schema } = mongoose.Schema();
const helper = require("../base");
const person_schema = require("./person");

const employee_schema = mongoose.Schema({
  person: {
    type: person_schema,
    required: true,
  },
});

const Employee = helper.get_model("Employee", employee_schema);

module.exports = Employee;
