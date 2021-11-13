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
    let uri = this.#mongo_uri
    try{
      setTimeout( function() {
        let conn_prom = mongoose.createConnection(uri).asPromise();
        conn_prom.then(connection_made => {
          console.log("connection: " + connection_made);
          console.log("connection ready state: " + connection_made.readyState);
          if (conn_prom.readyState === 1)
            this.#conn = value;

          resolve( "Connection established!" );
        }).catch(err => {
          reject( "Mongo error: ", err );
        })
      }, 1000);
    } catch (err) {
      reject( "connection request as timed out" );
    }
    return;
  }

  initialize(){
    this.#mongo_connection((info) => {console.log(info)}, (err) => {console.error(err)}).then(value => {
      console.log("intiizialize value: " + value);
    }).catch(err => {
      console.log("intiizialize err: " + err);
    })
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
