// require('dotenv').config({ path: '../bin/key.env', debug: process.env.DEBUG });

var mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  // let uri = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/test'
  let uri = 'mongodb://localhost:27017/test'
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

const example = new Pedalo({ name: 'Example' });
console.log(example.name); // 'Silence'
console.log("End of test pedalo");


module.exports = Pedalo;
