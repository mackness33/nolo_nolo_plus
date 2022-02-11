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

//app.use(express.static(path.join(__dirname, "fo_app", "build")));

// app.get("/", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "./my-app/build/index.html"));
// });

const homepageRouter = require("./routes/homepage");

app.use(cookieParser());

app.use("/home", homepageRouter);

app.use(async (req, res, next) => {
  await userService.initialize();
  next();
});

app.get("/getOne", async (req, res, next) => {
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
