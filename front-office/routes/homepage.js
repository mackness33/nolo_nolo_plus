const router = require("express").Router();
const logger = require("../../logger.js");
const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const empService = require("../../services/mongo/employeeService");
const computerService = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");
const bookingService = require("../../services/mongo/bookingService");
const { query } = require("express");

router.use(async (req, res, next) => {
  await componentService.initialize();
  await empService.initialize();
  await computerService.initialize();
  await bookingService.initialize();
  next();
});

router.get("/getAll", async (req, res, next) => {
  logger.warn("IN homepage -- getAll");

  const items = await computerService.find({ available: true });
  res.send(items);
});

router.get("/search", async (req, res, next) => {
  logger.warn("IN homepage -- search");

  console.log(req.query);
  let filters = {
    ...(req.query.brand ? { brand: req.query.brand } : {}),
    ...(req.query.type ? { type: req.query.type } : {}),
  };
  const computersByFilters = await computerService.filter(filters);
  const computersByDates = await bookingService.getAvailByDates(
    req.query.begin,
    req.query.end
  );
  const filtered = computersByFilters.filter((el) => {
    for (let index = 0; index < computersByDates.length; index++) {
      if (computersByDates[index] == el.id) {
        return true;
      }
    }
    return false;
  });

  res.send(filtered);
});

router.get("/getAllComponents", async (req, res, next) => {
  logger.warn("IN homepage -- getAllComponents");

  const comps = await componentService.getAllComponents();
  res.send(comps);
});

module.exports = router;
