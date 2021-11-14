var express = require('express');
var router = express.Router();
var Pedalo = require('./../mongo/pedalo_schema');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("in pedalo");
  console.log("ped: " + Pedalo);

  // if (!Pedalo){
  //   // TODO: throw error, 50x;
  //   console.log("Error has occured");
  //   throw new Error(500);
  // }
  Pedalo.then(pedalo_test)
  .then((result) => {console.log("pedalo: " + result);res.send(result);})
  .catch((reason) => {
    console.error(reason);
    res.status(500).send("Mongo Not Working");
  });
});

async function pedalo_test(model, reject){
  let dumb;
  // try{
  dumb = new model({ name: 'dumbpedalo' });
  // } catch(err){
    // console.error(err);
    // res.status(500).send("Mongo Not Working");
    // return "Mongo Not Working";
  // }

  dumb.check();

  // dumb.save();
  // dumb.check();
  let res = "queries";
  let result = "pedalos";
  res = await model.find();
  // res = await model.find(function (err, pedalos) {
  //   if (err) return handleError(err);
  //
  //   console.log("err in find: " + err);
  //   console.log("first find!");
  //   pedalos.forEach((item, i) => {
  //     console.log("pedalo n°" + i + " name is %s.", item)
  //   });
  //
  //   result = pedalos;
  // });

  return res;
  model.find({ name: /^dumb/ }, function (err, pedalos) {
    if (err) return handleError(err);

    console.log("second find!");
    pedalos.forEach((item, i) => {
      console.log("pedalo n°" + i + " name is %s.", item)
    });
  });
}

module.exports = router;
