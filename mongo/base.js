require('dotenv').config({path: __dirname + '../bin/.env'});
var mongoose = require('mongoose');

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

    // this.#conn = undefined;
    console.log("mongo_uri: " + this.#mongo_uri);
    this.#conn = mongoose.createConnection(this.#mongo_uri).asPromise();
  }

  async get_model(table, schema) {
    console.log ("this priv conn is: " + this.#conn);
    let model = 'model';

    await this.#conn.then((connection) => { model = connection.model(table, schema); })
      .catch ((reason) => { console.error(reason); });

    console.log("model: " + model);
    return model;
  }
  
};

var helper = new mongo_helper();

module.exports = helper;
