const router = require("express").Router();
const logger = require("../../logger.js");
const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const empService = require("../../services/mongo/employeeService");
const computerService = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");

router.use((req, res, next) => {
  SessionService.authorization(
    req,
    res,
    next,
    "/nnplus/logout",
    "/nnplus/login",
    2
  );
});

router.use(async (req, res, next) => {
  await componentService.initialize();
  await empService.initialize();
  await computerService.initialize();
  next();
});

router.get("/allComponents", async (req, res, next) => {
  const compLists = await componentService.getAll();
  res.send(compLists);
});

router.get("/getAll", async (req, res, next) => {
  const items = await computerService.find();
  res.send(items);
});

router.get("/getOne", async (req, res, next) => {
  logger.info(req.query.id);
  const item = await computerService.findOne({ _id: req.query.id }, "-image");

  res.send(item);
});

router.post("/insert", async (req, res, next) => {
  await componentService.addComponents(req.body);
  await computerService.insertOne(req.body);
  res.send("fatto");
});

router.put("/editOne", async (req, res, next) => {
  const id = req.body.id;
  delete req.body.id;
  req.body.type = req.body["type[]"];
  delete req.body["type[]"];
  await componentService.addComponents(req.body);
  await computerService.updateOne({ _id: id }, req.body);
  res.send("fattone");
});

router.delete("/delete", async (req, res, next) => {
  res.send(await computerService.deleteOne({ _id: req.body.id }));
});

module.exports = router;
