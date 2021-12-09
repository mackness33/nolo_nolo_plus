const router = require("express").Router();
const logger = require("../../logger.js");
const userModel = require("../mongo/user_schema");
const emplModel = require("../mongo/employee_schema");
const Employee = require("../mongo/employee_schema");

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
    if (req.query.mode == "edit") {
      user.feedback = user.feedback.filter((feed) => {
        if (feed.emplCode.mail == req.session.mail) {
          return feed;
        }
      });
    }
    res.send(user);
  });
});

router.post("/setOne", (req, res, next) => {
  logger.info("GODDO:::  " + req.session.mail);
  userModel.then(async (User, reject) => {
    //await User.findOneAndUpdate({ mail: req.body.mail }, req.body).exec();
    const user = await User.findOne({ mail: req.body.oldMail });
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.mail = req.body.newMail;
    user.status = req.body.status;
    logger.info(req.body["feeds[]"]);
    if (!Array.isArray(req.body["feeds[]"])) {
      req.body["feeds[]"] = [req.body["feeds[]"]];
    }
    user.feedback = user.feedback.filter((feed) => {
      return !req.body["feeds[]"].includes(feed.id);
    });
    logger.info(req.body["feeds[]"]);

    await user.save();
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

router.post("/feed", (req, res, next) => {
  emplModel.then(async (Employee, reject) => {
    const emp = await Employee.findOne({ mail: req.session.mail });
    userModel.then(async (User, reject) => {
      const user = await User.findOne({ mail: req.body.userMail });
      user.feedback.push({
        date: req.body.date,
        text: req.body.text,
        emplCode: emp._id,
      });
      await user.save();
    });
    res.send("bene bene");
  });
});

router.post("/deleteOne", (req, res, next) => {
  userModel.then(async (User, reject) => {
    const result = await User.deleteOne({ mail: req.body.mail });
    res.send(result);
  });
});

router.get("/checkExist", (req, res, next) => {
  userModel.then(async (User, reject) => {
    const result = await User.findOne({ mail: req.query.mail });
    logger.info(result);
    res.send(result);
  });
});

module.exports = router;
