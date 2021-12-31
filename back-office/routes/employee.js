const router = require("express").Router();
const logger = require("../../logger.js");
const Employee = require("../../services/mongo/schema/employee");
const User = require("../../services/mongo/schema/user");
const SessionService = require("../../services/auth");
const baseService = require("../../services/mongo/base");
var baseHelper = new baseService();
const userHelper = require("../../services/mongo/userService");
const empHelper = require("../../services/mongo/employeeService");
const computerHelper = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");

router.use(async (req, res, next) => {
  await componentService.initialize();
  //await baseHelper.initialize(User);

  next();
});

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const comp = {
    brand: "dell",
    model: "legion",
    type: "gaming",
    cpu: "ryzen 7 3700x 3.8ghz",
    gpu: "nvidia gtx 1050 2gb",
    ram: "16gb 3600mhz",
  };
  componentService.addComponents(comp);
  res.send("arrived");
});

router.get("/attr", async (req, res, next) => {
  const compLists = await componentService.getAll();
  logger.info(compLists);
  res.send(compLists);
});

module.exports = router;
