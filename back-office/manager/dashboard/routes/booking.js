const router = require("express").Router();
const logger = require("../../../../logger");

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

router.get("/bookingStat", async (req, res, next) => {
  const bModel = await bookingModel;

  const buildRes = {};

  let count = await bModel.find().count();
  buildRes.totalBookings = count;

  count = await bModel.find({ $or: [{ status: 1 }, { status: 2 }] }).count();
  buildRes.futureBookings = count;

  count = await bModel.find({ status: 3 }).count();
  buildRes.activeBookings = count;

  count = await bModel.find({ $or: [{ status: 0 }, { status: 5 }] }).count();
  buildRes.pastBookings = count;

  count = await bModel.find({ status: 4 }).count();
  buildRes.lateBookings = count;

  res.send(buildRes);
});

router.get("/bookingStatus", async (req, res, next) => {
  const bModel = await bookingModel;

  const buildRes = [];

  let count = await bModel.find({status: 5}).count()

  buildRes.push(['completati con successo', count]);

  count = await bModel.find({status: 0}).count()

  buildRes.push(['annullati per indisponibilita', count])

  count = await bModel.find({payed: false}).count()

  buildRes.push(['non ancora pagati', count])

  count = await bModel.find({returned: false}).count()

  buildRes.push(['non resituiti', count])

  res.send(buildRes);
});

module.exports = router;
