require('dotenv').config({path: __dirname + '../bin/.env'});
const logger = require('./../../logger.js');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

class mongo_helper{
  #mongo_uri = ''
  #conn = 'conn'
  constructor() {
    let db_cred = process.env.DB_USER && process.env.DB_PSW
      ? process.env.DB_USER + ':' + process.env.DB_PSW + '@'
      : ''
    let db_name = (process.env.DB_NAME || '')
    let db_options = (process.env.DB_OPTIONS || '')
    this.#mongo_uri =
      'mongodb://' + db_cred + process.env.DB_HOST + ':' +
      process.env.DB_PORT + '/' + db_name + "?" + db_options

    this.#conn = mongoose.createConnection(this.#mongo_uri).asPromise();
  }

  get mongo_uri(){ return this.#mongo_uri; }

  async get_model(table, schema) {
    let model = 'model';

    await this.#conn.then((connection) => { model = connection.model(table, schema); })
      .catch ((reason) => {
        logger.fatal(reason);
      });

    logger.info('In get model: ' + model)

    return model;
  }

  get_store(promise) {
    let conn_prom = this.#conn;
    let options = {
      conn_prom,
      dbName: 'test-app',
      ttl: 5 * 60,
      autoRemove: 'native'
    };

    if (!promise)
      options.mongoUrl = this.#mongo_uri;

    logger.info('store options: ' + options);

    return MongoStore.create(options);
  }

};

const helper = new mongo_helper();

module.exports = helper;
