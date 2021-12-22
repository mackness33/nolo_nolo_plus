require("dotenv").config({ path: __dirname + "../bin/.env" });
const logger = require("./../../logger.js");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const User = require ("./schema/user.js");

class baseService {
  #model;
  #model_ready;

  constructor(){
    this.#model_ready = false;
  }

  /* FINDS */
  async findOne(params) {
    return this.#model.findOne(params);
  }

  async find(params) {
    return this.#model.find(params);
  }

  /* UPDATES */
  async updateOne(filter, params) {
    return this.#model.updateOne(filter, params);
  }

  /* INSERTS */
  async insertOne(params) {
    const newDoc = new this.#model(param);
    await newDoc.save();
  }

  /* DELETES */
  async deleteOne(params) {
    return this.#model.deleteOne(params);
  }

  async deleteMany(params) {
    return this.#model.deleteMany(params);
  }

  /* CHECKS */
  async checkExists(params) {
    const num_docs = await this.#model.count(params);
    return !!num_docs;
  }

  async initialize(){}

  // async initialize(){
  //   if (!this.alreadyInit()){
  //     this.#model = await Employee;
  //     this.#model_ready = true;
  //   }
  // }

  alreadyInit(){
    return this.#model_ready;
    super.funzione();
  }
}

module.exports = baseService;
