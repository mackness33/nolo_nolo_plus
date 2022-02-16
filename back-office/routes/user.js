const router = require("express").Router();
const logger = require("../../logger.js");
const userModel = require("../../services/mongo/schema/user");
const emplModel = require("../../services/mongo/schema/employee");
const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const baseService = require("../../services/mongo/base.js");
const { contentType } = require("express/lib/response");

router.get("/getOne", async (req, res, next) => {
  if (!req.session.mail){
    res.send('NO_USER');
    return;
  }

  logger.info("In getOne of user");
  var user = await userService.findOne({ "person.mail": req.query.mail });
  user = user ? userService.format(user, "person") : user;

  if (user) {
    if (req.query.mode == "edit") {
      user.feedback = userService.filterFeeds(user.feedback, req.session.mail);
    }
    for (let i = 0; i < user.feedback.length; i++) {
      user.feedback[i].emplCode = userService.format(
        user.feedback[i].emplCode,
        "person"
      );
    }
  }
  logger.info("user: " + JSON.stringify(user));
  res.send(user);
});


router.get("/all", async (req, res, next) => {
  if (!req.session.mail){
    res.send('NO_USER');
    return;
  }

  const users = await userService.find(req.query.params, req.query.attributes);
  for (let i = 0; i < users.length; i++) {
    users[i] = userService.format(users[i], "person");
  }
  res.send(users);
});

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
  await userService.initialize();
  next();
});

router.get("/getMany", async (req, res, next) => {
  var users = await userService.find({
    "person.name": req.query.name,
    "person.surname": req.query.surname,
  });
  for (let i = 0; i < users.length; i++) {
    users[i] = userService.format(users[i], "person");
  }
  res.send(users);
});

router.post("/setOne", async (req, res, next) => {
  req.body.feeds = req.body["feeds[]"];
  delete req.body["feeds[]"];
  console.log("QUI::: " + JSON.stringify(req.body));
  await userService.updateOne({ "person.mail": req.body.oldMail }, req.body);
  res.send({});
});


router.post("/add", async (req, res, next) => {
  const user = {
    ...userService.setUpPerson(req.body),
    birth: req.body.birth,
    status: req.body.status,
    points: req.body.points,
    feedback: [],
  };
  await userService.insertOne(user);
  res.send({});
});

router.post("/feed", async (req, res, next) => {
  await userService.addFeed(req.session.mail, req.body.userMail, req.body);
  res.send({});
});

router.post("/deleteOne", async (req, res, next) => {
  res.send(await userService.deleteOne({ "person.mail": req.body.mail }));
});

router.get("/checkExist", async (req, res, next) => {
  res.send(await userService.checkExists({ "person.mail": req.query.mail }));
});

module.exports = router;
