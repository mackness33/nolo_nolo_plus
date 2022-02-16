// INFO: how to start the server DEBUG=app:* npm start
require("dotenv").config({ path: __dirname + "/bin/.env" });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("./../../logger");
const morgan = require("morgan");
const session = require("express-session");
const SessionService = require("../../services/auth");

// const homeRouter = require("./routes/home");
const userRoute = require("./dashboard/routes/user");
const invRoute = require("./dashboard/routes/inventory");
const bookingRoute = require("./dashboard/routes/booking");

const app = express();

app.use(morgan("combined"));

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "dashboard/src/assets")));
app.use(express.static(path.join(__dirname, "./dashboard/dist/assets", "assets" )));

app.use((req, res, next) => {
  SessionService.authorization(
    req,
    res,
    next,
    "/nnplus/logout",
    "/nnplus/login",
    0
  );

  logger.warn("Session! " + JSON.stringify(req.session));
});


app.use("/user", userRoute);
app.use("/inv", invRoute);
app.use("/booking", bookingRoute);

app.get('/', async(req, res, next) =>{
  res.sendFile(path.join(__dirname, "./dashboard/dist/index.html"))
})

// app.use("/", homeRouter);
app.get("/prova", async (req, res, next) => {
  console.log("wow");
  res.send({ dio: "cane" });
});

// catch 404 and forward to error handler
app.use("/", function (req, res, next) {
  // logger.info('Form: ' + util.inspect(req, { depth: null }));
  logger.warn("resource " + JSON.stringify(req.url) + " not found");
  next();
});

module.exports = app;
