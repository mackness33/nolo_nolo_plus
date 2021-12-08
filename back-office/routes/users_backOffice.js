const router = require("express").Router();
const logger = require("../../logger.js");
const userModel = require("../mongo/user_schema");
const emplModel = require("../mongo/employee_schema");

router.get("/getOne", (req, res, next) => {
  userModel.then(async (User, reject) => {
    var user;
    if (req.query.mail) {
      user = await User.findOne({ mail: req.query.mail }).populate(
        "feedback.emplCode"
      );
    } else {
      user = await User.find({
        name: req.query.name,
        surname: req.query.surname,
      }).populate("feedback.emplCode");
    }

    logger.info(user);
    res.send(user);
  });
});

router.post("/setOne", (req, res, next) => {
  userModel.then(async (User, reject) => {
    const tmp = await User.find({ mail: req.body.mail }).exec();
    logger.info(tmp);
    await User.findOneAndUpdate({ mail: req.body.mail }, req.body).exec();
    res.send("ah cool");
  });
});

router.get("/all", (req, res, next) => {
  userModel.then(async (User, reject) => {
    const users = await User.find().populate("feedback.emplCode");
    res.send(users);
  });
});

router.post("/add", (req, res, next) => {
  userModel.then(async (User, reject) => {
    const newUser = new User({
      name: req.body.name,
      surname: req.body.surname,
      birth: req.body.birth,
      mail: req.body.mail,
      password: req.body.password,
      status: req.body.status,
    });

    await newUser.save();
    res.send("all cool");
  });
});

module.exports = router;
