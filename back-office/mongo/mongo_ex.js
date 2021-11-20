var mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://david.mack:iraeBoh3@david.mack.tw.cs.unibo.it:27017/test');
}

const kittySchema = new mongoose.Schema({
  name: String
});



// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function speak() {
  const greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
};

const Kitten = mongoose.model('Kitten', kittySchema);

const silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'

console.log("End of test kitten");

module.exports = Kitten;

// const fluffy = new Kitten({ name: 'fluffy' });
// fluffy.speak(); // "Meow name is fluffy"
//
// await fluffy.save();
// fluffy.speak();
//
// const kittens = await Kitten.find();
// console.log(kittens);
//
// await Kitten.find({ name: /^fluff/ });
