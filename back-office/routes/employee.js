const router = require("express").Router();
const logger = require("../../logger.js");
const Employee = require("../../services/mongo/schema/employee");
const User = require("../../services/mongo/schema/user");
const SessionService = require("../../services/auth");
const baseService = require("../../services/mongo/base");
var baseHelper = new baseService();
const userHelper = require("../../services/mongo/userService");
const empService = require("../../services/mongo/employeeService");
const computerService = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");

router.use(async (req, res, next) => {
  await componentService.initialize();
  await computerService.initialize();
  await empService.initialize();
  //await baseHelper.initialize(User);

  next();
});

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const em = await empService.insertOne({
    "person.name": "mario",
    "person.surname": "rossi",
    "person.password": "cabbio",
    "person.mail": "jojo@brando",
    "person.role": 1,
  });
  res.send("arrived");
});

router.get("/anco", async (req, res, next) => {
  const items = await computerService.find({}, "-image");
  logger.info(items);
  res.send("fatto");
});

router.get("/components", async (req, res, next) => {
  await componentService.addComponents({
    brand: "hp",
    model: "spectre",
    type: ["2-in-1", "ultrabook"],
    cpu: "intel i7-12000k 3.7ghz",
    gpu: "nvidia rtx 3060 12gb",
    ram: "32gb 4200mhz",
  });
  res.send("done");
});

router.get("/attr", async (req, res, next) => {
  const compLists = await componentService.getAll();
  res.send(compLists);
});

module.exports = router;
