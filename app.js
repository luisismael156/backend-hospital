const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
const app = express();


const routerIndex = require("./routes/app");
const routerUsuario = require("./routes/usuario");
const routerLogin = require("./routes/login");



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect(
  "mongodb://localhost:27017/hospitalDB",
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, res) => {
    if (err) throw err;

    console.log("conexion de db exitosa");
  }
);

//Rutas
app.use("/", routerIndex);
app.use("/usuario", routerUsuario);
app.use("/login", routerLogin);



app.listen(3000, () => {
  console.log("iniciado");
});
