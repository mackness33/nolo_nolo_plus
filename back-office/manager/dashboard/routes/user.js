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

router.get("/userData", async (req, res, next) => {
  logger.info("IN DASH user -- userData");

  res.send([
    ["disponibili", 44],
    ["non disponibili", 65],
  ]);
});

module.exports = router;
