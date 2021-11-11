const result = require('dotenv').config({path: __dirname + '/.env'});


var mongoose = require('mongoose');
mongo_connection().catch(err => console.log(err));

function mongo_uri(){
  let db_cred = process.env.DB_USER && process.env.DB_PSW ? process.env.DB_USER + ':' + process.env.DB_PSW : ''
  let db_name = (process.env.DB_NAME || '')
  let db_options = (process.env.DB_OPTIONS || '')
  return 'mongodb://' + db_cred + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + db_name + "?" + db_options
}

async function mongo_connection() {
  let uri = mongo_uri();
  console.log("mongo uri: " + uri);
  await mongoose.connect(uri);
}

const pedaloSchema = new mongoose.Schema({
  name: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
pedaloSchema.methods.check = function check() {
  const greeting = this.name
    ? "Pedalo name is " + this.name
    : "It doesn't have a name";
  console.log(greeting);
};


const Pedalo = mongoose.model('Pedalo', pedaloSchema);

module.exports = Pedalo;
