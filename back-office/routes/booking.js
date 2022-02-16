const router = require("express").Router();
const logger = require("../../logger.js");
const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const empService = require("../../services/mongo/employeeService");
const computerService = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");
const bookingService = require("../../services/mongo/bookingService");

router.use(async (req, res, next) => {
  await bookingService.initialize();
  await userService.initialize();
  next();
});

router.get("/getDiscountsComputer", async (req, res, next) => {
  const discounts = await bookingService.getDefaultDiscountComputer(
    req.query.computerId,
    req.query.days
  );
  res.send({ discounts, points: 0 });
});


router.get("/getBookingsByItem", async (req, res, next) => {
  logger.info(JSON.stringify(req.query.id));
  logger.info("in booking");

  const bookingDates = await bookingService.find(
    { computer: req.query.id },
    "begin end computer"
  );
  console.log(bookingDates);
  res.send(bookingDates);
});

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

router.get("/getDiscounts", async (req, res, next) => {
  const discounts = await bookingService.getDefaultDiscount(
    req.query.userId,
    req.query.computerId,
    req.query.days
  );
  const points = await userService.findOne({ _id: req.query.userId }, "points");
  res.send({ discounts, points: points.points });
});

router.post("/addOne", async (req, res, next) => {
  logger.info(JSON.parse(req.body.data));
  const booking = JSON.parse(req.body.data);
  const ack_insert = await bookingService.insertOne(booking);
  console.log(JSON.stringify(ack_insert));
  await userService.changePoints(booking.user, -booking.points);
  await userService.changePoints(
    booking.user,
    Math.trunc(parseFloat(booking.final_price))
  );
  res.send({ done: true });
});

router.get("/byDates", async (req, res, next) => {
  const items = await bookingService.getAvailByDates(
    req.query.begin,
    req.query.end
  );
  res.send(items);
});

router.get("/getBookings", async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : null;
  const bookings = await bookingService.getPopulatedBookings(null, attributes);

  res.send(bookings);
});

router.get("/getBooking", async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : null;
  const booking = await bookingService.getPopulatedBooking(
    req.query.id,
    attributes
  );

  res.send(booking);
});

router.get("/getBookingsByUser", async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : null;
  const bookings = await bookingService.getPopulatedBookingsByUser(
    req.query.user,
    attributes
  );

  res.send(bookings);
});

router.get("/getBookingsByTypes", async (req, res, next) => {
  const status = [];
  if (req.query.types[0]) status.push(1, 2);
  if (req.query.types[1]) status.push(0, 3);
  if (req.query.types[2]) status.push(0, 4, 5);

  const attributes = req.query.attributes ? req.query.attributes : null;
  let bookings;
  if (status.length === 0) {
    bookings = await bookingService.getPopulatedBookingsByTypes(
      status,
      req.query.user,
      attributes
    );
  } else {
    bookings = await bookingService.getPopulatedBooking(
      req.query.id,
      attributes
    );
  }

  console.log(bookings);
  res.send(bookings);
});

router.put("/certifiedBooking", async (req, res, next) => {
  const certificate = JSON.parse(req.body.certificate);

  const ack = await bookingService.updateOne({ _id: req.body.id }, certificate);
  res.send(ack);
});

router.put("/updateBooking", async (req, res, next) => {
  const changes = JSON.parse(req.body.booking);

  const ack = await bookingService.updateOne({ _id: req.body.id }, changes);
  res.send(ack);
});

router.delete("/deleteBooking", async (req, res, next) => {
  const ack = await bookingService.deleteOne({ _id: req.body.id });
  logger.info(ack);
  res.send(ack);
});

module.exports = router;
