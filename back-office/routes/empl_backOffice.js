const router = require("express").Router();
const logger = require("../../logger.js");
const Employee = require("../mongo/employee_schema");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.query);
  const dt = new Date();
  var again;
  Employee.then(async (model, reject) => {
    const tania = new model({
      name: "vladimira",
      surname: "putinia",
      mail: "vladimira@putinia",
      password: "something",
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
