const router = require("express").Router();
const createError = require("http-errors");
const Pedalo = require("./../../services/mongo/schema/pedalo");
const logger = require("../../logger.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  Pedalo.then(pedalo_test)
    .then((resolve) => {
      res.send(resolve);
    })
    .catch((reason) => {
      logger.error(reason);
      next(createError(500));
    });
});

async function pedalo_test(model, reject) {
  let dumb;
  let query;

  dumb = new model({ name: "dumbpedalo" });
  dumb.check();

  query = await model.find();

  return query;
}

module.exports = router;
