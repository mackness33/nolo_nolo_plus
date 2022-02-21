const router = require("express").Router();
const logger = require("../../../../logger");
const mongoose = require("mongoose");

const bookingModel = require("../../../../services/mongo/schema/booking");
const userModel = require("../../../../services/mongo/schema/user");

const SessionService = require("../../../../services/auth");
const userService = require("../../../../services/mongo/userService");
const empService = require("../../../../services/mongo/employeeService");
const computerService = require("../../../../services/mongo/computerService");
const componentService = require("../../../../services/mongo/componentService");
const bookingService = require("../../../../services/mongo/bookingService");

router.use(async (req, res, next) => {
  await componentService.initialize();
  await empService.initialize();
  await computerService.initialize();
  await bookingService.initialize();
  await userService.initialize();
  next();
});

router.get("/whoAmI", async (req, res, next) => {
  if (req.session && req.session.mail) {
    try {
      const emp = await empService.findOne({ "person.mail": req.session.mail });
      res.send({ success: true, payload: emp });
    } catch (error) {
      res.send({ success: false, error: "FIND_FAILED" });
    }
  } else {
    res.send({ success: false, error: "NOT_LOGGED" });
  }
});

router.get("/getAll", async (req, res, next) => {
  logger.info("IN DASH employee -- getAll");

  const emps = await empService.find();

  res.send(emps);
});

router.get("/getOne", async (req, res, next) => {
  logger.info("IN DASH employee -- getOne");
  try {
    const emps = await empService.find({ "person.mail": req.query.mail });
    res.send({ success: true, payload: emps });
  } catch (error) {
    res.send({ success: false, error: "Errore durante la ricerca" });
  }
});

router.post("/addOne", async (req, res, next) => {
  logger.info("IN DASH employee -- addOne");
  const check = await empService.find({ "person.mail": req.body.person.mail });
  if (check.length == 0) {
    try {
      const done = await empService.insertOne(req.body);
      res.send({ success: true, message: "Creazione avvenuta con successo" });
    } catch (error) {
      res.send({ success: false, message: "Creazione fallita" });
    }
  } else {
    res.send({ success: false, message: "Mail gia' esistente" });
  }
});

router.post("/deleteOne", async (req, res, next) => {
  logger.info("IN DASH employee -- deleteOne");

  try {
    const done = await empService.deleteOne({ "person.mail": req.body.mail });
    res.send({ success: true, message: "Cancellazione avvenuta" });
  } catch (error) {
    res.send({ success: false, message: "Cancellazione fallita" });
  }
});

router.post("/promote", async (req, res, next) => {
  logger.info("IN DASH employee -- promote");
  logger.warn(req.body);
  // const emps = await empService.find();
  try {
    const emp = await empService.findOne({ "person.mail": req.body.mail });
    emp.person.role = 0;
    await emp.save();
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false, error: error });
  }
});

router.get("/getStats", async (req, res, next) => {
  logger.info("IN DASH employee -- getStats");
  const mood = await bookingModel;

  try {
    const data = await mood.aggregate([
      { $match: { employee: new mongoose.Types.ObjectId(req.query.id) } },
      {
        $group: {
          _id: req.query.id,
          totalNum: { $sum: 1 },
          totalPrice: { $sum: "$final_price" },
          avgPrice: { $avg: "$final_price" },
          maximumPrice: { $max: "$final_price" },
          minimumPrice: { $min: "$final_price" },
        },
      },
    ]);

    res.send({ success: true, payload: data });
  } catch (error) {
    res.send({ success: false, error: error });
  }
});

module.exports = router;
