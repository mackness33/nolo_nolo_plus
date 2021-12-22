const router = require("express").Router();
const logger = require("../../logger.js");
const Employee = require("../../services/mongo/schema/employee");
const SessionService = require("../../services/auth");
const baseService = require("../../services/mongo/base")
var baseHelper;

router.use(async (req, res, next) => {
  // let employeeModel = await Employee;
  logger.info('pre employee');
  baseHelper = new baseService(await Employee);
  logger.info('post employee');

  next();
});

/* GET users listing. */
router.get(
  "/",
  // (req, res, next) => {
  //   SessionService.authorization(
  //     req,
  //     res,
  //     next,
  //     "/nnplus/logout",
  //     "/nnplus/login",
  //     2
  //   );
  // },
  async function (req, res, next) {
    const doc = await baseHelper.checkExists({"person.name": "dio"})
    res.send(doc);
  }
);

module.exports = router;
