const mongoose = require("mongoose");
const { Schema } = mongoose;
const helper = require("./base");
const Employee = require("./employee_schema");

const feedback_schema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  emplCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
});

const user_schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  birth: {
    type: Date,
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
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  feedback: [feedback_schema],
});

const User = helper.get_model("User", user_schema);

module.exports = User;
