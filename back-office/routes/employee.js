const router = require("express").Router();
const logger = require("../../logger.js");
const Employee = require("../../services/mongo/schema/employee");
const User = require("../../services/mongo/schema/user");
const SessionService = require("../../services/auth");
const baseService = require("../../services/mongo/base");
var baseHelper = new baseService();
const userHelper = require("../../services/mongo/user_service");
const computerHelper = require("../../services/mongo/computer_service");

router.use(async (req, res, next) => {
  await computerHelper.initialize();
  //await baseHelper.initialize(User);

  next();
});

/* GET users listing. */
router.post("/", async function (req, res, next) {
  await computerHelper.insertOne(req.body);
  res.send("arrived");
});

router.get("/attr", async (req, res, next) => {
  const attr = await computerHelper.find();
  let tmp;
  attr.forEach((el) => {
    tmp[el.name] = el.values;
  });
  tmp.gpu;
  // var types = [];
  // attr.forEach((a) => {
  //   types.push(...a.type);
  // });
  // types = [...new Set(types)];
  res.send(attr);
});

module.exports = router;
