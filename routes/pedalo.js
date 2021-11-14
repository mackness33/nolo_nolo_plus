var express = require('express');
var router = express.Router();
var Pedalo = require('./../mongo/pedalo_schema');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("in pedalo");

  Pedalo.then(pedalo_test)
    .then((resolve) => { res.send(resolve); })
    .catch((reason) => {
      console.error(reason);
      res.status(500).send("Mongo Not Working");
    });
});

async function pedalo_test(model, reject){
  let dumb;
  let query

  dumb = new model({ name: 'dumbpedalo' });
  dumb.check();

  query = await model.find();

  return query;
}

module.exports = router;
