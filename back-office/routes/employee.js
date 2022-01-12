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
const bookingService = require("../../services/mongo/bookingService");

router.use(async (req, res, next) => {
  await componentService.initialize();
  await computerService.initialize();
  await empService.initialize();
  await bookingService.initialize();
  //await baseHelper.initialize(User);

  next();
});

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // const em = await empService.insertOne({
  //   "person.name": "mario",
  //   "person.surname": "rossi",
  //   "person.password": "cabbio",
  //   "person.mail": "jojo@brando",
  //   "person.role": 1,
  // });
  const empl = await empService.findOne(
    { "person.mail": req.session.mail },
    "_id"
  );
  res.send(empl);
});

router.get("/anco", async (req, res, next) => {
  const book = {
    user: "61c11e49c5fa076a8980e4d3",
    computer: "61cdd2bcc4a1a19a470f337b",
    begin: "2021-12-25",
    end: "2022-12-28",
    discounts: [{ reason: "sconto dispositivo", amount: 256 }],
    final_condition: 5,
    final_price: 180,
  };

  //await bookingService.insertOne(book);
  //await bookingService.getAvailByDates("2022-01-01", "2022-01-30");
  //await bookingService.getUserScore("61c11e49c5fa076a8980e4d3");
  await bookingService.getDefaultDiscount(
    "61c11e49c5fa076a8980e4d3",
    "61cdd2bcc4a1a19a470f337b"
  );

  res.send("fatto");
});

router.get("/components", async (req, res, next) => {
  await componentService.addComponents({
    model: "nitro",
    type: ["2-in-1", "ultrabook"],
    cpu: "intel i7-12000k 3.7ghz",
    gpu: "nvidia rtx 3060 12gb",
    ram: "32gb 4200mhz",
  });
  res.send("done");
});

router.get("/attr", async (req, res, next) => {
  await componentService.clear();
  res.send("dio");
});

module.exports = router;
