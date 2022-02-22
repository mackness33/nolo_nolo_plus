const router = require("express").Router();
const logger = require("../../../../logger");
const mongoose = require("mongoose");

const computerModel = require("../../../../services/mongo/schema/computer");
const bookingModel = require("../../../../services/mongo/schema/booking");
const userModel = require("../../../../services/mongo/schema/user");
const componentModel = require("../../../../services/mongo/schema/component");

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
  logger.info("IN DASH user -- invStat");
  const mood = await computerModel;

  const resBuild = {};

  resBuild.totalNumber = await mood.find().count();

  resBuild.maxComputer = await computerService.getStatsMost(
    null,
    {
      _id: "$computer",
      total: { $sum: "$final_price" },
    },
    "total"
  );
  resBuild.computerCurrentlyInUse = await computerService.getStats(
    { status: 3 },
    { _id: "$computer" }
  );
  resBuild.computerCurrentlyInUse = resBuild.computerCurrentlyInUse.length;
  resBuild.computerCurrentlyUnavailableCount = await computerService.find({
    available: false,
  });
  resBuild.computerCurrentlyUnavailableCount =
    resBuild.computerCurrentlyUnavailableCount.length;
  resBuild.computersCount = await computerService.find({ available: false });
  resBuild.computersCount = resBuild.computersCount.count;

  res.send(resBuild);
});

router.get("/maxPricePerComputer", async (req, res, next) => {
  logger.info("IN DASH inventory -- maxPricePerComputer");

  const group = {
    _id: "$computer",
    total: { $sum: "$final_price" },
  };

  const result = await computerService.getCharts(null, group, "total");

  res.send(result);
});

router.get("/computerMostUsed", async (req, res, next) => {
  logger.info("IN DASH inventory -- computerMostUsed");

  const group = {
    _id: "$computer",
    count: { $sum: 1 },
  };

  const result = await computerService.getCharts(null, group, "count");
  res.send(result);
});

router.get("/computerPerUser", async (req, res, next) => {
  logger.info("IN DASH inventory -- computerPerUser");

  const group = {
    _id: "$computer",
    total: { $sum: "$user" },
  };

  const result = await computerService.getStats(null, group, "total");
  res.send(result);
});

router.get("/componentNumbers", async (req, res, next) => {
  logger.info("IN DASH inventory -- componentNumbers");

  const mood = await componentModel;
  const data = await mood.find();
  const resData = [];
  for (const el of data) {
    resData.push([el.name, el.list.length]);
  }
  res.send(resData);
});

router.get("/brandProfit", async (req, res, next) => {
  logger.info("IN DASH inventory -- brandProfit");

  const componentMood = await componentModel;
  const computerMood = await computerModel;
  const bookMood = await bookingModel;
  const le = await componentMood.findOne({ name: "brand" });
  const brands = le.list;
  const resData = [];

  for (const brand of brands) {
    let tmp = 0;
    let acc = 0;
    const comps = await computerMood.find({ brand: brand }, "id");
    for (const comp of comps) {
      const data = await bookMood.aggregate([
        { $match: { computer: new mongoose.Types.ObjectId(comp.id) } },
        { $group: { _id: null, total: { $sum: "$final_price" } } },
      ]);
      if (data.length > 0) {
        acc = acc + data[0].total;
      }
    }
    resData.push([brand, acc.toFixed(2)]);
  }
  res.send(resData);
});

module.exports = router;
