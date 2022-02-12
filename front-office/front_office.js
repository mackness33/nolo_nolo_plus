//import React, { useState, useEffect, useRef } from "react";
const express = require("express");
const path = require("path");
const app = express();

require("dotenv").config({ path: __dirname + "/bin/.env" });
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("./../logger");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const authService = require("../services/auth");
const userService = require("../services/mongo/userService");

const homepageRouter = require("./routes/homepage");
const itemRouter = require("./routes/item");
const authRouter = require("./routes/auth");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "fo_app", "build")));

app.use("/home", homepageRouter);
app.use("/item", itemRouter);
app.use("/auth", authRouter);

app.get("*", (req, res, next) => {
  console.log("dio");
  res.sendFile(path.join(__dirname, "./fo_app/build/index.html"));
});

app.use(async (req, res, next) => {
  await userService.initialize();
  next();
});

app.get("/getUser", async (req, res, next) => {
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

  res.send(user);
});

module.exports = app;
