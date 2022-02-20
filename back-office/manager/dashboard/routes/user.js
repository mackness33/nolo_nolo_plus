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

router.get("/userStat", async (req, res, next) => {
  logger.info("IN DASH user -- userStat");

  const resBuild = {};

  const bModel = await bookingModel;
  const sumObj = await bModel.aggregate([
    { $group: { _id: null, total: { $sum: "$final_price" } } },
  ]);
  resBuild.totalIncome = sumObj.length ? sumObj[0].total : 0;
  let users = await userService.find();
  resBuild.totalUsers = users.length;
  users = await userService.find({ status: { $ne: 0 } });
  resBuild.activeUsers = users.length;
  resBuild.inactiveUsers = resBuild.totalUsers - users.length;

  res.send(resBuild);
});

router.get("/userAgeSpend", async (req, res, next) => {
  logger.info("IN DASH user -- userAgSpend");

  const currentYear = new Date().getFullYear();
  const result = [];
  const bModel = await bookingModel;
  const uModel = await userModel;

  for (let i = 70; i > 0; i = i - 10) {
    let tmp = currentYear - i;

    let users = await uModel.find({
      birth: { $gte: JSON.stringify(tmp), $lte: JSON.stringify(tmp + 10) },
    });
    let acc = 0;
    for (const user of users) {
      let userBooks = await bModel.aggregate([
        { $match: { user: "$user.id" } },
        { $group: { _id: null, amount: { $sum: "$final_price" } } },
      ]);

      logger.warn("HOLD");
      logger.warn(user.id);
      logger.warn(JSON.stringify(userBooks.length));

      acc = acc + userBooks.amount;
    }
    result.push([`${i} - ${i - 10}`, acc]);
  }
  logger.info(JSON.stringify(result));

  res.send(result);
});

router.get("/userAge", async (req, res, next) => {
  logger.info("IN DASH user -- userAge");

  const moodel = await userModel;
  const currentYear = new Date().getFullYear();
  const result = [];

  for (let i = 70; i > 0; i = i - 10) {
    let tmp = currentYear - i;
    let count = await moodel.find({
      birth: { $gte: JSON.stringify(tmp), $lte: JSON.stringify(tmp + 10) },
    });
    result.push([`${i} - ${i - 10}`, count.length]);
  }
  // logger.info(JSON.stringify(result));

  res.send(result);
});

router.get("/bookingPerUser", async (req, res, next) => {
  logger.info("IN DASH user -- userAge");

  const group = {
    _id: "$user",
    total: { $sum: {} },
  };

  const result = await userService.getCharts(null, group, "total");

  res.send(result);
});

module.exports = router;
