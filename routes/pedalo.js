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

  Pedalo.find(function (err, pedalo) {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host".
    console.log("pedalo's name is %s.", pedalo.name);
    res.send(pedalo);
  });
  // console.log(pedalos);

  Pedalo.find({ name: /^dumb/ }, function (err, pedalo) {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host".
    console.log("pedalo's name is %s.", pedalo.name);
    res.send(pedalo);
  });

  // res.send(pedalos.);
});

module.exports = router;
