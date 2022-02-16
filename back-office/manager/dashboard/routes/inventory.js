const router = require("express").Router();
const logger = require("../../../../logger");

const computerModel = require("../../../../services/mongo/schema/computer");
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

router.get("/invStat", async (req, res, next) => {
  logger.info("IN DASH user -- userStat");

  const resBuild = {};

  resBuild.maxComputer = await computerService.getStatsMost(
    null,
    {
      _id: "$computer",
      total: { $sum: "$final_price" }
    },
    'total'
  );
  resBuild.computerCurrentlyInUse = await computerService.getStats({ status: 3 }, { _id: "$computer" });
  resBuild.computerCurrentlyUnavailable = await computerService.find({ available: false });
  resBuild.computerCurrentlyUnavailableCount = resBuild.computerCurrentlyUnavailable.length;
  resBuild.computersCount = await computerService.find({ available: false });
  resBuild.computersCount = resBuild.computersCount.count;

  res.send(resBuild);
});


router.get("/maxPricePerComputer", async (req, res, next) => {
  logger.info("IN DASH inventory -- maxPricePerComputer");

  const group = {
    _id: "$computer",
    total: { $sum: "$final_price" }
  };

  const result = await computerService.getCharts(null, group, "total");

  res.send(result);
});

router.get("/computerMostUsed", async (req, res, next) => {
  logger.info("IN DASH inventory -- computerMostUsed");

  const group = {
    _id: "$computer",
    count: { $count: {} }
  };

  const result = await computerService.getCharts(null, group, "count");
  res.send(result);
});

router.get("/computerPerUser", async (req, res, next) => {
  logger.info("IN DASH inventory -- computerMostUsed");

  const group = {
    _id: "$computer",
    total: { $sum: "$user" }
  };

  const result = await computerService.getStats(null, group, "total");
  res.send(result);
});

module.exports = router;
