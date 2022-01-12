import React, { useState, useEffect, useRef } from "react";
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "fo_app", "build")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./my-app/build/index.html"));
});

module.exports = app;
