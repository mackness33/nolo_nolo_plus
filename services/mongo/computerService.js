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

  async getStatsMost (match, group, variable){
    const bModel = await Booking;
    const params = [];
    if (match){
      params.push({
        $match: match
      })
    }
    if (group){
      params.push({
        $group: group
      })
    }

    const computer_stat = await bModel.aggregate(params);

    if (!computer_stat){
      return null;
    }

    let result = computer_stat[0];
    for (const computer of computer_stat){
      if (computer[variable] > result[variable]){
        result = computer;
      }
    }

    logger.info(JSON.stringify(result));
    return this.findOne({_id: result._id});
  }

  async getStatsLess (match, group, variable){
    const bModel = await Booking;
    const params = [];
    if (match){
      params.push({
        $match: match
      })
    }
    if (group){
      params.push({
        $group: group
      })
    }

    const computer_stat = await bModel.aggregate(params);

    if (!computer_stat){
      return null;
    }

    let result = computer_stat[0];
    for (const computer of computer_stat){
      if (computer[variable] < result[variable]){
        result = computer;
      }
    }

    logger.info(JSON.stringify(result));
    return this.findOne({_id: result._id});
  }

  async getStats (match, group){
    const result = [];
    const bModel = await Booking;
    const params = [];
    if (match){
      params.push({
        $match: match
      })
    }
    if (group){
      params.push({
        $group: group
      })
    }

    const computer_stat = await bModel.aggregate(params);

    let populatedComputer = null;
    for (const computer of computer_stat){
      logger.info(computer);
      populatedComputer = await this.findOne({_id: computer._id});
      logger.info(populatedComputer.brand);
      result.push(`${populatedComputer.brand} ${populatedComputer.model}`);
    }

    logger.info(JSON.stringify(result));
    return result;
  }

  async getCharts (match, group, variable){
    const result = [];
    const bModel = await Booking;
    const params = [];

    if (match){
      params.push({
        $match: match
      })
    }
    if (group){
      params.push({
        $group: group
      })
    }

    const computer_per_count = await bModel.aggregate(params);

    let populatedComputer = null;
    for (const computer of computer_per_count){
      logger.info(computer);
      populatedComputer = await this.findOne({_id: computer._id});
      logger.info(populatedComputer.brand);
      result.push([`${populatedComputer.brand} ${populatedComputer.model}`, computer[variable]]);
    }

    logger.info(JSON.stringify(result));

    return result;
  }
}

const service = new computer_services();

module.exports = service;
