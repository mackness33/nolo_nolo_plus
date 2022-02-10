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

//app.use(express.static(path.join(__dirname, "fo_app", "build")));

// app.get("/", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "./my-app/build/index.html"));
// });

const homepageRouter = require("./routes/homepage");

app.use(cookieParser());

app.use("/home", homepageRouter);

module.exports = app;
