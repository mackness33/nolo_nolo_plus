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
    // for (let i = 0; i < some.length; i++) {
    //   logger.info(some[i].toObject());
    // }
    return result;
  }
}

const service = new computer_services();

module.exports = service;
