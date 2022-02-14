const logger = require("../../logger.js");
const mongoose = require("mongoose");
const baseService = require("./base");
const Computer = require("./schema/computer");

class computer_services extends baseService {
  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(Computer);
  }

  async filter(filters) {
    const query = {};
    for (const [entry, values] of Object.entries(filters)) {
      query[entry] = entry !== "price" ? { $in: values } : values;
    }

    const result = await super.find(query);
    return result;
  }

  async getDiscount(computerId) {
    const discountPercentage = await super.findOne(
      { _id: computerId },
      "discount price available"
    );
    return discountPercentage;
  }
}

const service = new computer_services();

module.exports = service;
