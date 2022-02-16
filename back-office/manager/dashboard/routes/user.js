const router = require("express").Router();
const logger = require("../../../../logger");
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

router.get("/userAge", async (req, res, next) => {
  logger.info("IN DASH user -- userAge");

  const currentYear = new Date().getFullYear();
  const result = [];

  for (let i = 70; i > 0; i = i - 10) {
    let tmp = currentYear - i;
    let count = await userService.find({
      birth: { $gte: JSON.stringify(tmp), $lte: JSON.stringify(tmp + 10) },
    });
    result.push([`${tmp} - ${tmp + 10}`, count.length]);
  }
  logger.info(JSON.stringify(result));

  res.send(result);
});

module.exports = router;
