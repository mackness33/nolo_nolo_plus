require('dotenv').config({path: __dirname + '/.env'});
var mongoose = require('mongoose');

class mongo_helper{
  #mongo_uri = ''

  constructor() {
    let db_cred = process.env.DB_USER && process.env.DB_PSW
      ? process.env.DB_USER + ':' + process.env.DB_PSW
      : ''
    let db_name = (process.env.DB_NAME || '')
    let db_options = (process.env.DB_OPTIONS || '')
    this.#mongo_uri =
      'mongodb://' + db_cred + '@' + process.env.DB_HOST + ':' +
      process.env.DB_PORT + '/' + db_name + "?" + db_options
  }

  async #mongo_connection() {
    const conn = await mongoose.createConnection(this.#mongo_uri).catch(err => console.log(err));
    return conn;
  }

  create_model(table, schema) {
    const connection = this.#mongo_connection();
    console.log("connection: " + connection);
    const model = connection.model(table, schema);
    return model;
  }
};

module.exports = mongo_helper;
