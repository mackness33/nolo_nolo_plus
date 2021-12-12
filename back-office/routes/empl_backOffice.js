const router = require("express").Router();
const logger = require("../../logger.js");
const Employee = require("../mongo/schema/employee");
const SessionService = require('../../services/auth');

/* GET users listing. */
router.get("/", (req, res, next) => {
    SessionService.authorization(req, res, next, '/nnplus/logout', '/nnplus/login', 2);
  }, function (req, res, next) {
  console.log(req.query);
  const dt = new Date();
  var again;
  Employee.then(async (model, reject) => {
    const tania = new model({
      name: "vladimira",
      surname: "putinia",
      mail: "vladimira@putinia",
      password: "something",
      role: 2,
    });
    await tania.save();
    again = await model.find({ name: "vladimira" });
    logger.info(again);
  }).then(() => {
    logger.info("EMPLYEE::  " + again);
    res.send(again);
  });
});

module.exports = router;
