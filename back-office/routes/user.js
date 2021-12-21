const router = require("express").Router();
const logger = require("../../logger.js");
const userModel = require("../../services/mongo/schema/user");
const emplModel = require("../../services/mongo/schema/employee");
const SessionService = require("../../services/auth");
const pedService = require("../../services/pedalo");
const helper = require("../../services/mongo/base.js");

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

router.get("/getOne", async (req, res, next) => {
  if (req.query.mail) {
    var user = await helper.getOne(userModel, req);
    user = helper.format(user);
    for (let i = 0; i < user.feedback.length; i++) {
      user.feedback[i].emplCode = helper.format(
        user.feedback[i].emplCode,
        true
      );
    }
  } else {
    var user = await helper.getOne(userModel, req);
    for (let i = 0; i < user.length; i++) {
      user[i] = helper.format(user[i]);
    }
  }

  res.send(user);
});

router.post("/setOne", async (req, res, next) => {
  await helper.setOne(userModel, req);
  res.send("ahhh done");
});

router.get("/all", async (req, res, next) => {
  const users = await helper.getAll(userModel);
  for (let i = 0; i < users.length; i++) {
    users[i] = helper.format(users[i], false);
  }
  res.send(users);
});

router.post("/add", async (req, res, next) => {
  await helper.add(userModel, req);
  res.send("all cool");
});

router.post("/feed", async (req, res, next) => {
  const emp = await helper.getOne(emplModel, req.session.mail);
  req.query = { mail: req.body.userMail };
  const user = await helper.getOne(userModel, req);
  user.feedback.push({
    date: req.body.date,
    text: req.body.text,
    emplCode: emp._id,
  });
  await user.save();
  res.send("bene bene");
});

router.post("/deleteOne", async (req, res, next) => {
  res.send(await helper.deleteOne(userModel, req.body.mail));
});

router.get("/checkExist", async (req, res, next) => {
  res.send(await helper.checkExist(userModel, req.query.mail));
});

module.exports = router;
