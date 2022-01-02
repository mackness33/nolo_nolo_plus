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
}

const service = new computer_services();

module.exports = service;
