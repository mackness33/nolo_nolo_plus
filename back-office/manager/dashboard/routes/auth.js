const router = require("express").Router();
const logger = require("../../../../logger");
const path = require("path");

const bookingModel = require("../../../../services/mongo/schema/booking");
const userModel = require("../../../../services/mongo/schema/user");
const emplModel = require("../../../../services/mongo/schema/employee");

const SessionService = require("../../../../services/auth");
const userService = require("../../../../services/mongo/userService");
const empService = require("../../../../services/mongo/employeeService");
const computerService = require("../../../../services/mongo/computerService");
const componentService = require("../../../../services/mongo/componentService");
const bookingService = require("../../../../services/mongo/bookingService");

router.get(
  "/",
  (req, res, next) => {
    logger.info("in pre-login GET");
    SessionService.not_already_logged(req, res, next, "/fake");
  },
  (req, res, next) => {
    logger.info("in login GET");
    res.send({ success: true });
  }
);

module.exports = router;
