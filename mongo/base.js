require('dotenv').config({path: __dirname + '../bin/.env'});
var mongoose = require('mongoose');

class mongo_helper{
  #mongo_uri = ''
  #conn = 'conn'
  #connection = 'connection'

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

  get #MongoUri() {
    return this.#mongo_uri();
  }

  async #mongo_connection(resolve, reject) {
    await (this.#conn).then((value) => {
      resolve("connection ready state: " + value.readyState);
      if (value.readyState === 1)
        this.#connection = value;

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

  // async #createModel(table, schema) {
  //   const connection = await mongoose.createConnection(this.#mongo_uri);
  //   const model = connection.model(table, schema);
  //   return connection.model(table, schema);
  // }

  async create_model(table, schema) {
    console.log ("this priv conn is: " + this.#conn);
    console.log ("this priv connection is: " + this.#connection);
    let model = 'model';

    // await this.#mongo_connection(
    //   (info) => {console.log(info);},
    //   (err) => {console.error(err);}
    // ).then(() => {model = this.#connection.model(table, schema);});

    await this.#conn.then((connection) => {model = connection.model(table, schema);})
      .catch ((reason) => {console.error(reason);});

    console.log("model: " + model);
    return model;
  }

};

var helper = new mongo_helper();


module.exports = helper;
