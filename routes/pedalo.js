var express = require('express');
var router = express.Router();
var Pedalo = require('./../mongo/pedalo_schema');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("in pedalo");
  console.log("ped: " + Pedalo);

  if (!Pedalo){
    // TODO: throw error, 50x;
    console.log("Error has occured");
    next(createError(500));
    return;
  }

  const dumb = new Pedalo({ name: 'dumbpedalo' });
  dumb.check();

  dumb.save();
  dumb.check();

  Pedalo.find(function (err, pedalos) {
    if (err) return handleError(err);

    pedalos.forEach((item, i) => {
      console.log("pedalo n°" + i + " name is %s.", item)
    });

    res.send(pedalos);
  });

  Pedalo.find({ name: /^dumb/ }, function (err, pedalos) {
    if (err) return handleError(err);

    pedalos.forEach((item, i) => {
      console.log("pedalo n°" + i + " name is %s.", item)
    });

    // res.send(pedalo);
  });
});

module.exports = router;
