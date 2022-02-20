const mongoose = require("mongoose");
const person_schema = require("./person");
const helper = require("../utils");

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
  person: {
    type: person_schema,
    required: true,
  },
  birth: {
    type: Date,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  feedback: [feedback_schema],
  favourites: {
    type: [mongoose.Schema.Types.ObjectId],
    deafult: [],
  },
});

const User = helper.get_model("User", user_schema);

module.exports = User;
