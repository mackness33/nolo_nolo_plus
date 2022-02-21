// INFO: how to start the server DEBUG=app:* npm start
require("dotenv").config({ path: __dirname + "/bin/.env" });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("./../../logger");
const morgan = require("morgan");
const session = require("express-session");
const SessionService = require("../../services/auth");
const emplModel = require("../../services/mongo/schema/employee");

const baseClass = require("../../services/mongo/base");
var baseService = new baseClass();

// const homeRouter = require("./routes/home");
const userRoute = require("./dashboard/routes/user");
const invRoute = require("./dashboard/routes/inventory");
const bookingRoute = require("./dashboard/routes/booking");
const emplRoute = require("./dashboard/routes/employee");
const authRoute = require("./dashboard/routes/auth");

const app = express();

app.use(morgan("combined"));

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "dashboard/src/assets")));
app.use(express.static(path.join(__dirname, "dashboard", "dist")));

app.use(async (req, res, next) => {
  await baseService.initialize(emplModel);
  next();
});

app.post("/login", async (req, res, next) => {
  logger.info("in DASH LOGIN POST");
  try {
    let user = await SessionService.authentication(
      req.body.mail,
      req.body.password,
      emplModel
    );
    if (user.person.role > 0) {
      throw new Error("user unauthorized");
    }
    user = await baseService.format(user, "person");
    SessionService.generate(req.session, user);
    res.send({ success: true });
  } catch (err) {
    res.status(401);
    res.send({ success: false, error: err });
  }
});

app.use(async (req, res, next) => {
  if (SessionService.check_if_user_logged_in(req.session, 0)) {
    next();
  } else {
    res.status(401);
    res.send({ success: false });
  }
});

app.get("/protect", async (req, res, next) => {
  res.send({ success: true });
});

app.get("/logout", async (req, res, next) => {
  try {
    SessionService.destroy(req.session, res);
    res.status(401);
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err });
  }
});

app.use("/user", userRoute);
app.use("/inv", invRoute);
app.use("/booking", bookingRoute);
app.use("/empl", emplRoute);

module.exports = app;
