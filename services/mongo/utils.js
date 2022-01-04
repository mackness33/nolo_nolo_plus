require("dotenv").config({ path: __dirname + "../bin/.env" });
const logger = require("./../../logger.js");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

class mongo_helper {
  #mongo_uri = ""; // uri for mongo
  #conn; // connection promise

  constructor() {
    // creation of the mongo uri based on the environment
    let db_cred =
      process.env.DB_USER && process.env.DB_PSW
        ? process.env.DB_USER + ":" + process.env.DB_PSW + "@"
        : "";
    let db_name = process.env.DB_NAME || "";
    let db_options = process.env.DB_OPTIONS || "";
    this.#mongo_uri =
      "mongodb://" +
      db_cred +
      process.env.DB_HOST +
      ":" +
      process.env.DB_PORT +
      "/" +
      db_name +
      "?" +
      db_options;

    // get the connection to the mongo server as a promise
    this.#conn = mongoose.createConnection(this.#mongo_uri).asPromise();
  }

  get mongo_uri() {
    return this.#mongo_uri;
  }

  // if used it will "return" a promise that will eventually return the model requested
  async get_model(table, schema) {
    let model = "model";

    // await to get the connecion
    await this.#conn
      // then get the model requested
      .then((connection) => {
        model = connection.model(table, schema);
      })
      // logger the error that happend
      .catch((reason) => {
        logger.fatal(reason);
      });

    return model;
  }

  // return the store for the session package
  get_store(promise) {
    let conn_prom = this.#conn;
    // options for the store to be created
    let options = {
      conn_prom,
      dbName: "test",
      ttl: 5 * 60,
      autoRemove: "native",
    };

    // if the store has to be made without a promise of the connection
    if (!!!promise) options.mongoUrl = this.#mongo_uri;

    return MongoStore.create(options);
  }
}

const helper = new mongo_helper();

module.exports = helper;
