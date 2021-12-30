const logger = require("../../logger.js");
const mongoose = require("mongoose");
const baseService = require("./base");
const Computer = require("./schema/computer");
const fs = require("fs");

class computer_services extends baseService {
  #typesPath = __dirname + "../data/types.json";
  #model;

  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(Computer);
  }

  async getTypes() {
    var file = fs.readFileSync(this.#typesPath, "utf8");
    return JSON.parse(file).types;
  }

  addType(typeName) {
    var file = JSON.parse(fs.readFileSync(this.#typesPath, "utf8"));
    if (file.types.indexOf(typeName) === -1) {
      file.types.push(typeName);
    }
    fs.writeFileSync(this.#typesPath, JSON.stringify(file));
  }
}

const service = new computer_services();

module.exports = service;
