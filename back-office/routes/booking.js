const router = require("express").Router();
const logger = require("../../logger.js");
const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const empService = require("../../services/mongo/employeeService");
const computerService = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");
const bookingService = require("../../services/mongo/bookingService");

router.use((req, res, next) => {
  SessionService.authorization(
    req,
    res,
    next,
    "/nnplus/logout",
    "/nnplus/login",
    2
  );
});

router.use(async (req, res, next) => {
  await bookingService.initialize();
  await userService.initialize();
  next();
});

router.post("/addOne", async (req, res, next) => {
  logger.info(JSON.parse(req.body.data));
  const booking = JSON.parse(req.body.data);
  await bookingService.insertOne(booking);
  await userService.changePoints(booking.user, -booking.points);
  res.send({ done: true });
});

router.get("/byDates", async (req, res, next) => {
  const items = await bookingService.getAvailByDates(
    req.query.begin,
    req.query.end
  );
  res.send(items);
});

router.get("/getDiscounts", async (req, res, next) => {
  const discounts = await bookingService.getDefaultDiscount(
    req.query.userId,
    req.query.computerId,
    req.query.days
  );
  const points = await userService.findOne({ _id: req.query.userId }, "points");
  res.send({ discounts, points: points.points });
});

router.get("/getBookingsByItem", async (req, res, next) => {
  logger.info(JSON.stringify(req.query.id));
  logger.info("in booking");

  const bookingDates = await bookingService.find(
    { computer: req.query.id },
    "begin end"
  );
  console.log(bookingDates);
  res.send(bookingDates);
});

router.get("/getBookings", async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : null;
  const bookings = await bookingService.getPopulatedBookings(req.query.user, attributes);
  
  res.send(bookings);
});

router.get("/getBookingsByUser", async (req, res, next) => {
  logger.info(JSON.stringify(req.query.user));
  logger.info("in booking");

  const attributes = req.query.attributes ? req.query.attributes : null;
  const bookings = await bookingService.getPopulatedBookingsByUser(req.query.user, attributes);
  // console.log(bookings);
  res.send(bookings);
});

module.exports = router;
