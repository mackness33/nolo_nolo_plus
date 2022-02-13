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
const userRouter = require("./routes/user");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "fo_app", "build")));

app.use("/home", homepageRouter);
app.use("/item", itemRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("*", (req, res, next) => {
  console.log("dio");
  res.sendFile(path.join(__dirname, "./fo_app/build/index.html"));
});

module.exports = app;
