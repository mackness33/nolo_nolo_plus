const router = require("express").Router();
const logger = require("../../logger.js");
const userModel = require("../../services/mongo/schema/user");
const emplModel = require("../../services/mongo/schema/employee");
const SessionService = require("../../services/auth");
const userService = require("../../services/mongo/userService");
const bookingService = require("../../services/mongo/bookingService");
const baseService = require("../../services/mongo/base.js");
const { contentType } = require("express/lib/response");
const e = require("express");
const session = require("express-session");

router.use(async (req, res, next) => {
  await userService.initialize();
  await bookingService.initialize();
  next();
});

router.use(async (req, res, next) => {
  SessionService.check_model(req, res, userModel, next);
});

// router.use((req, res, next) => {
//   SessionService.authorization(
//     req,
//     res,
//     next,
//     "/nnplus/logout",
//     "/nnplus/login",
//     2
//   );
// });

router.get("/whoAmI", async (req, res, next) => {
  logger.info("IN user -- whoAmI");
  if (req.session && req.session.mail) {
    logger.warn(req.session.mail);
    var user = await userService.findOne({ "person.mail": req.session.mail });
    user = userService.format(user, "person");
    res.send(user);
  } else {
    res.send({ name: "notLogged" });
  }
});

router.get("/alreadyLogged", async (req, res, next) => {
  logger.info("IN user -- alreadyLogged");
  if (req.session && req.session.mail) {
    res.send({ success: true });
  } else {
    logger.warn("DOIN");
    res.send({ success: false });
  }
});

router.post("/subscribe", async (req, res, next) => {
  logger.info("IN user -- subscribe");

  let alreadyExists = await userService.find({
    "person.mail": req.body.mail,
  });

  if (alreadyExists.length === 0) {
    const user = {
      ...userService.setUpPerson(req.body),
      birth: req.body.birth,
      status: req.body.status,
      points: req.body.points,
      feedback: [],
    };

    try {
      await userService.insertOne(user);
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, error: "Registrazione fallita" });
    }
  } else {
    res.send({ success: false, error: "Mail gia' in utilizzo" });
  }
});

router.post("/update", async (req, res, next) => {
  logger.info("IN user -- update");

  if (req.session && req.session.mail) {
    if (req.session.mail !== req.body.mail) {
      const count = await userService.find({ "person.mail": req.body.mail });

      if (count.lenght === 0) {
        await userService.updateOne(
          { "person.mail": req.session.mail },
          req.body
        );
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    } else {
      await userService.updateOne(
        { "person.mail": req.session.mail },
        req.body
      );
      res.send({ success: true });
    }
  } else {
    res.send({ success: false });
  }
});

router.get("/getBookings", async (req, res, next) => {
  logger.info("IN user -- getBookings");
  if (req.session && req.session.mail) {
    // if (true) {
    logger.warn(req.query.mail);

    const user = await userService.findOne({
      // "person.mail": "primo@levi",
      "person.mail": req.session.mail,
    });
    const books = await bookingService.getPopulatedBookingsByUser(user.id);
    res.send({ success: true, payload: books });
  } else {
    res.send({ success: false });
  }
});

router.post("/updateBooking", async (req, res, next) => {
  logger.info("IN user -- updateBooking");
  if (req.session && req.session.mail) {
    // if (true) {
    const data = req.body.data;
    await bookingService.updateOne({ _id: req.body.id }, data);
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

router.post("/deleteBooking", async (req, res, next) => {
  logger.info("IN user -- deleteBooking");
  if (req.session && req.session.mail) {
    // if (true) {
    const data = req.body.id;
    logger.info(data);

    await bookingService.deleteOne({ _id: req.body.id });
    res.send({ success: true });
    // await bookingService.updateOne({ _id: req.body.id }, data);
    // res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

router.post("/changeFavs", async (req, res, next) => {
  logger.info("IN user -- changeFavs");
  if (req.session && req.session.mail) {
    // if (true) {
    const result = await userService.updateFavs(
      req.body.userId,
      req.body.compId,
      req.body.add
    );

    res.send({ ...result });
    // await bookingService.updateOne({ _id: req.body.id }, data);
    // res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
