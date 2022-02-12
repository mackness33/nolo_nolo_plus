const router = require("express").Router();
const logger = require("../../logger.js");
const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const empService = require("../../services/mongo/employeeService");
const computerService = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");
const bookingService = require("../../services/mongo/bookingService");

router.use(async (req, res, next) => {
  await componentService.initialize();
  await empService.initialize();
  await computerService.initialize();
  await bookingService.initialize();
  next();
});

router.get("/getOne", async (req, res, next) => {
  const item = await computerService.findOne({ _id: req.query.id });
  logger.error(item);
  res.send(item);
});

router.get("/getBookingsByItem", async (req, res, next) => {
  logger.info(JSON.stringify(req.query.id));

  const bookingDates = await bookingService.find(
    { computer: req.query.id },
    "begin end"
  );
  console.log(bookingDates);
  res.send(bookingDates);
});

router.get("/findSimilar", async (req, res, next) => {
  const comp = await computerService.findOne({ _id: req.query.id });
  const similarType = await computerService.find({ type: { $in: comp.type } });
  const similarBrand = await computerService.find({ brand: comp.brand });

  let final = [...similarType, ...similarBrand];
  final = final.filter((el) => el.id !== req.query.id);
  console.log(final);
  var check = new Set();
  final = final.filter((obj) => !check.has(obj.id) && check.add(obj.id));
  res.send(final);
});

module.exports = router;
