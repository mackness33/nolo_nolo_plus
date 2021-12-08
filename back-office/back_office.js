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
const MongoStore = require("connect-mongo");

const authRouter = require("./routes/authentication");
const homeRouter = require("./routes/home");
const userListRouter = require("./routes/users_backOffice");
const emplListRoter = require("./routes/empl_backOffice");

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "super secret",
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017",
      dbName: "prova",
      collectionName: "sessions",
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 15,
    },
  })
);

app.use("/login", authRouter);
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
