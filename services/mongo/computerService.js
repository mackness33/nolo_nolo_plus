const logger = require("../../logger.js");
const mongoose = require("mongoose");
const baseService = require("./base");
const bookingService = require("./bookingService");
const Computer = require("./schema/computer");
const Booking = require("./schema/booking");

class computer_services extends baseService {
  #booking_model;

  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(Computer);
    this.#booking_model = await Booking;
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

  async deleteOne(params) {
    if (params._id){
      await this.#booking_model.deleteMany({computer: params._id});
    }
    logger.info("COMPUTER TO BE DELETED: " + params._id);
    return super.deleteOne(params);
  }
}

const service = new computer_services();

module.exports = service;
