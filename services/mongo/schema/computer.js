require("dotenv").config({ path: __dirname + "../bin/.env" });
const logger = require("../../../logger");
var helper = require("../utils");
var mongoose = require("mongoose");
const empHelper = require("../employeeService");

const computerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  type: {
    type: [String],
    required: true,
  },
  cpu: {
    type: String,
    required: true,
  },
  gpu: {
    type: String,
    required: true,
  },
  ram: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  note: {
    type: String,
    required: true,
  },
  emplCode: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

computerSchema.methods.getEmployee = async function () {
  await empHelper.initialize();
  return await empHelper.findOne({ _id: this.emplCode });
};

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
// pedaloSchema.methods.check = function check() {
//   const greeting = this.name
//     ? "Pedalo name is " + this.name
//     : "It doesn't have a name";
//   logger.info(greeting);
// };

const Computer = helper.get_model("Computer", computerSchema);

module.exports = Computer;
