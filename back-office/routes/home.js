const path = require("path");
const router = require("express").Router();
const logger = require("../../logger.js");
const util = require("util");
const emplModel = require("../../services/mongo/schema/employee");
const SessionService = require("../../services/auth");

router.use(async (req, res, next) => {
  SessionService.check_model(req, res, emplModel, next);
});

/* GET users listing. */
router.get(
  "/",
  (req, res, next) => {
    logger.info("in pre-home GET");
    SessionService.authorization(
      req,
      res,
      next,
      "/nnplus/logout",
      "/nnplus/login",
      1
    );
  },
  function (req, res, next) {
    logger.info("in home GET");

    res.sendFile(path.join(__dirname, "../public/templates/users.html"));
  }
);

router.get(
  "/inventory",
  (req, res, next) => {
    logger.info("in inventory GET");
    res.sendFile(path.join(__dirname, "../public/templates/inventory.html"));
  }
);

router.get(
  "/booking",
  (req, res, next) => {
    logger.info("in pre-home GET");
    SessionService.authorization(
      req,
      res,
      next,
      "/nnplus/logout",
      "/nnplus/login",
      1
    );
  },
  (req, res, next) => {
    logger.info("in inventory GET");
    res.sendFile(path.join(__dirname, "../public/templates/booking.html"));
  }
);

// router.post('/', function(req, res, next) {
//   logger.info("in login POST");
//   logger.info('Form: ' + JSON.stringify(req.body));
//   res.send('respond with a resource');
// });

// logger.info('Form: ' + util.inspect(req, { depth: null }));

module.exports = router;
