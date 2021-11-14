require('dotenv').config({path: __dirname + '../bin/.env'});
var mongoose = require('mongoose');

class mongo_helper{
  #mongo_uri = ''
  #conn = ''

  constructor() {
    let db_cred = process.env.DB_USER && process.env.DB_PSW
      ? process.env.DB_USER + ':' + process.env.DB_PSW + '@'
      : ''
    let db_name = (process.env.DB_NAME || '')
    let db_options = (process.env.DB_OPTIONS || '')
    this.#mongo_uri =
      'mongodb://' + db_cred + process.env.DB_HOST + ':' +
      process.env.DB_PORT + '/' + db_name + "?" + db_options

    this.#conn = undefined;
  }

  get #MongoUri() {
    return this.#mongo_uri();
  }

  async #mongo_connection(resolve, reject) {
    console.log("mongo_uri: " + this.#mongo_uri);
    let uri = this.#mongo_uri;
    (mongoose.createConnection(uri).asPromise()).then((value) => {
      resolve("connection ready state: " + value.readyState);
      if (value.readyState === 1)
        this.#conn = value;

      resolve( "Connection established!" );
    }).catch((err) => {
      reject(err);
    })

    return;
  }

  initialize(){
    this.#mongo_connection(
      (info) => {console.log(info);},
      (err) => {console.error(err);}
    );

    return;
  }

  async #createModel(table, schema) {
    const connection = await mongoose.createConnection(this.#mongo_uri);
    const model = connection.model(table, schema);
    return connection.model(table, schema);
  }

  create_model(table, schema) {
    return undefined;
  }

};

var helper = new mongo_helper();


module.exports = helper;
