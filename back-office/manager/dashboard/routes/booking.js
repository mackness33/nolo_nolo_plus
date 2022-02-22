const router = require("express").Router();
const logger = require("../../../../logger");

var addMonths = require("date-fns/addMonths");
var subYears = require("date-fns/subYears");
var startOfMonth = require("date-fns/startOfMonth");
var getMonth = require("date-fns/getMonth");
var subDays = require("date-fns/subDays");
var getYear = require("date-fns/getYear");

const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");

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
  logger.info("IN DASH booking -- bookingStat");

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
  logger.info("IN DASH booking -- bookingStatus");

  const bModel = await bookingModel;

  const buildRes = [];

  let count = await bModel.find({ status: 5 }).count();
  buildRes.push(["completati con successo", count]);

  count = await bModel.find({ status: 0 }).count();
  buildRes.push(["annullati per indisponibilita", count]);

  count = await bModel.find({ payed: false }).count();
  buildRes.push(["non ancora pagati", count]);

  count = await bModel.find({ returned: false }).count();
  buildRes.push(["non resituiti", count]);

  res.send(buildRes);
});

router.get("/bookingPerMonth", async (req, res, next) => {
  logger.info("IN DASH booking -- bookingPerMonth");
  const months = [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ];
  const bModel = await bookingModel;
  const resData = [{ name: "Guadagni", data: {} }];
  let date = new Date();
  date = subYears(date, 1);
  date = startOfMonth(date);

  for (let i = 0; i < 12; i++) {
    const info = await bModel.aggregate([
      {
        $match: {
          begin: {
            $gte: date,
            $lt: addMonths(date, 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$final_price" } } },
    ]);
    date = addMonths(date, 1);
    let mm = getMonth(subDays(date, 1));
    if (info.length > 0) {
      resData[0].data[months[mm]] = info[0].total;
    } else {
      resData[0].data[months[mm]] = 0;
    }
  }

  res.send(resData);
});

router.get("/mostBookedMonths", async (req, res, next) => {
  logger.info("IN DASH booking -- mostBookedMonths");
  const resData = [
    ["Gen", 0],
    ["Feb", 0],
    ["Mar", 0],
    ["Apr", 0],
    ["Mag", 0],
    ["Giu", 0],
    ["Lug", 0],
    ["Ago", 0],
    ["Set", 0],
    ["Ott", 0],
    ["Nov", 0],
    ["Dic", 0],
  ];
  const bModel = await bookingModel;
  const bookings = await bModel.find();

  for (const book of bookings) {
    // logger.warn(JSON.stringify(getMonth(book.begin)));
    resData[getMonth(book.begin)][1]++;
  }

  res.send(resData);
});

router.get("/booksDistr", async (req, res, next) => {
  logger.info("IN DASH booking -- booksDistr");
  const resData = {};

  const bModel = await bookingModel;
  const bookings = await bModel.find();

  for (const book of bookings) {
    // resData.push([
    //   new Date(book.begin).toISOString().split("T")[0],
    //   book.final_price,
    // ]);
    resData[new Date(book.begin).toISOString().split("T")[0]] =
      book.final_price;
  }
  logger.warn(JSON.stringify(resData));

  res.send(resData);
});

module.exports = router;
