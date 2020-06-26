const express = require("express");
const mongoose = require("mongoose");

const app = express();

const principal = app.get("/", (req, res) => {
  res.json("Ruta Principal");
});


module.exports = principal