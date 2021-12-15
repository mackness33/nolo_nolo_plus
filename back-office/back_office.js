// INFO: how to start the server DEBUG=app:* npm start

require("dotenv").config({ path: __dirname + "/bin/.env" });
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("./../logger");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const authService = require("../services/auth");

const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const userListRouter = require("./routes/user");
const emplListRoter = require("./routes/employee");

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(authService.get_session());

app.use("/", authRouter);
app.use("/home", homeRouter);
app.use("/user", userListRouter);
app.use("/empl", emplListRoter);

// catch 404 and forward to error handler
app.use("/", function (req, res, next) {
  // logger.info('Form: ' + util.inspect(req, { depth: null }));
  logger.warn("resource " + JSON.stringify(req.url) + " not found");
  next();
});

module.exports = app;
