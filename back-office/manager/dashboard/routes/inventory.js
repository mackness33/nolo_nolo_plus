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
  const cModel = await computerModel;
  const bModel = await bookingModel;

  resBuild.maxComputer = await get_computer_more_productive();
  // }
  // resBuild.totalIncome = sumObj[0].total;
  // let users = await userService.find();
  // resBuild.totalUsers = users.length;
  // users = await userService.find({ status: { $ne: 0 } });
  // resBuild.activeUsers = users.length;
  // resBuild.inactiveUsers = resBuild.totalUsers - users.length;

  res.send(resBuild);
});

async function get_computer_more_productive () {
  const bModel = await bookingModel;

  const computer_per_price = await bModel.aggregate([
    {
      $group: {
        _id: "$computer",
        // computer: { $accumulator: "$final_price" },
        total: { $sum: "$final_price" }
      }
    },
  ]);

  let max_computer = computer_per_price[0];

  for (const computer of computer_per_price){
    if (computer.total > max_computer.total){
      max_computer = computer;
    }
  }

  return await computerService.findOne({_id: max_computer._id});
}

router.get("/maxPricePerComputer", async (req, res, next) => {
  logger.info("IN DASH inventory -- maxPricePerComputer");

  const result = [];
  const bModel = await bookingModel;

  const computer_per_price = await bModel.aggregate([
    {
      $group: {
        _id: "$computer",
        total: { $sum: "$final_price" }
      }
    },
  ]);

  let populatedcomputer = null;
  for (const computer of computer_per_price){
    logger.info(computer);
    populatedComputer = await computerService.findOne({_id: computer._id});
    logger.info(populatedComputer.brand);
    result.push([`${populatedComputer.brand} ${populatedComputer.model}`, computer.total]);
  }

  logger.info(JSON.stringify(result));

  res.send(result);
});

router.get("/computerMostUsed", async (req, res, next) => {
  logger.info("IN DASH inventory -- computerMostUsed");

  const result = [];
  const bModel = await bookingModel;

  const computer_per_count = await bModel.aggregate([
    {
      $group: {
        _id: "$computer",
        count: { $count: {} }
      }
    },
  ]);

  let populatedcomputer = null;
  for (const computer of computer_per_count){
    logger.info(computer);
    populatedComputer = await computerService.findOne({_id: computer._id});
    logger.info(populatedComputer.brand);
    result.push([`${populatedComputer.brand} ${populatedComputer.model}`, computer.count]);
  }

  logger.info(JSON.stringify(result));

  res.send(result);
});

module.exports = router;
