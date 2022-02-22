const router = require("express").Router();
const logger = require("../../logger.js");
const bookingModel = require("../../services/mongo/schema/booking");

const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const empService = require("../../services/mongo/employeeService");
const computerService = require("../../services/mongo/computerService");
const componentService = require("../../services/mongo/componentService");

router.use(async (req, res, next) => {
  await componentService.initialize();
  await empService.initialize();
  await computerService.initialize();
  next();
});

router.get("/allComponents", async (req, res, next) => {
  const compLists = await componentService.getAllComponents();
  res.send(compLists);
});

router.get("/getAll", async (req, res, next) => {
  const available = req.session.mail ? {} : { available: true };
  const items = await computerService.find(available);
  res.send(items);
});

router.get("/getOne", async (req, res, next) => {
  const item = await computerService.findOne({ _id: req.query.id });

  res.send(item);
});

router.get("/filter", async (req, res, next) => {
  const filteredItems = await computerService.filter(
    JSON.parse(req.query.data)
  );
  res.send(filteredItems);
});

router.post(
  "/insert",
  (req, res, next) => {
    SessionService.authorization(
      req,
      res,
      next,
      "/nnplus/logout",
      "/nnplus/login",
      1
    );
  },
  async (req, res, next) => {
    const emp = await empService.findOne({
      "person.mail": req.session.mail,
    });
    req.body["emplCode"] = emp._id;
    await componentService.addComponents(req.body);
    await computerService.insertOne(req.body);
    res.send({});
  }
);

router.put(
  "/editOne",
  (req, res, next) => {
    SessionService.authorization(
      req,
      res,
      next,
      "/nnplus/logout",
      "/nnplus/login",
      1
    );
  },
  async (req, res, next) => {
    const id = req.body.id;
    delete req.body.id;
    if (req.body["type[]"]) {
      req.body.type = req.body["type[]"];
      delete req.body["type[]"];
    }
    await componentService.addComponents(req.body);
    await computerService.updateOne({ _id: id }, req.body);
    res.send({});
  }
);

router.delete(
  "/delete",
  (req, res, next) => {
    SessionService.authorization(
      req,
      res,
      next,
      "/nnplus/logout",
      "/nnplus/login",
      1
    );
  },
  async (req, res, next) => {
    const bookMood = await bookingModel;
    await bookMood.deleteMany({ computer: req.body.id });
    res.send(await computerService.deleteOne({ _id: req.body.id }));
  }
);

router.put(
  "/available",
  (req, res, next) => {
    SessionService.authorization(
      req,
      res,
      next,
      "/nnplus/logout",
      "/nnplus/login",
      1
    );
  },
  async (req, res, next) => {
    logger.info("IN AVAILABLE: ");
    const ack = await computerService.updateOne(
      { _id: req.body.id },
      { available: true }
    );
    logger.info("ack: " + JSON.stringify(ack));
    res.send(ack);
  }
);

router.put(
  "/unavailable",
  (req, res, next) => {
    SessionService.authorization(
      req,
      res,
      next,
      "/nnplus/logout",
      "/nnplus/login",
      1
    );
  },
  async (req, res, next) => {
    logger.info("IN UNAVAILABLE: ");
    const ack = await computerService.updateOne(
      { _id: req.body.id },
      { available: false }
    );
    logger.info("ack: " + JSON.stringify(ack));
    res.send(ack);
  }
);

module.exports = router;
