const req = require("express/lib/request");
const mongoose = require("mongoose");
const { Schema } = mongoose.Schema();
const helper = require("../utils");
const person_schema = require("./person");

const manager_schema = mongoose.Schema({
  person: {
    type: person_schema,
    required: true,
  },
});

const Manager = helper.get_model("Manager", employee_schema);

module.exports = Manager;
