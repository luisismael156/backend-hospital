const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb://localhost:27017/hospitalDB",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;

    console.log("conexion de db exitosa"); 
  }
);

//Rutas
app.get("/", (req, res) => {
  res.json("hola");
});

app.listen(3000, () => {
  console.log("iniciado");
});
