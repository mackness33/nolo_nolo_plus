const mongoose = require("mongoose");
const helper = require("../utils");

const booking_schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  computer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Computer",
    required: true,
  },
  begin: {
    type: Date,
    require: true,
  },
  end: {
    type: Date,
    require: true,
  },
  discounts: [
    {
      reason: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    },
  ],
  starting_price: {
    type: Number,
    required: true,
  },
  final_price: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
    required: true,
  },
  note: {
    type: String,
  },
  picked: {
    type: Boolean,
    require: true,
    default: false,
  },
  returned: {
    type: Boolean,
    require: true,
    default: false,
  },
  payed: {
    type: Boolean,
    require: true,
    default: false,
  },
  late: {
    type: Boolean,
    default: false,
  },
  onHold: {
    type: Boolean,
    default: false,
  },
  defaulted: {
    type: Boolean,
    default: false,
  },
  final_condition: {
    type: Number,
    default: 5,
    required: true,
  },
});

booking_schema.methods.checkConditon = function (final_condition) {
  return final_condition > 10 || final_condition < 0;
};

const Booking = helper.get_model("Booking", booking_schema);

module.exports = Booking;
