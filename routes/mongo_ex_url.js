var express = require('express');
var Kitten = require('./mongo_ex');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("in kitten");

  const fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak(); // "Meow name is fluffy"

  fluffy.save();
  fluffy.speak();

  const kittens = Kitten.find();
  console.log(kittens);

  Kitten.find({ name: /^fluff/ });


  res.send('respond with a kitten');
});

module.exports = router;
