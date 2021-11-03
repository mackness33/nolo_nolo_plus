var express = require('express');
var router = express.Router();
var Pedalo = require('./../mongo/pedalo_schema');

console.log ('start of pedalo')
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("in pedalo");

  const dumb = new Pedalo({ name: 'dumbpedalo' });
  dumb.check(); // "Pedalo name is fluffy"

  dumb.save();
  dumb.check();

  const pedalos = Pedalo.find();
  console.log(pedalos);

  Pedalo.find({ name: /^dumb/ });

  res.send(pedalos);
});

module.exports = router;
