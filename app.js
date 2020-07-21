const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
var cors = require('cors')
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");

  next();
});

const routerIndex = require("./routes/app");
const routerUsuario = require("./routes/usuario");
const routerLogin = require("./routes/login");
const routerHospital = require("./routes/hospital");
const routerMedico = require("./routes/medico");
const routerBusqueda = require("./routes/busqueda");
const routerUpload = require("./routes/upload");
const routerImagenes= require("./routes/imagenes");





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
app.use("/medico", routerMedico);
app.use("/hospital", routerHospital);
app.use("/usuario", routerUsuario);
app.use("/login", routerLogin);
app.use("/busqueda", routerBusqueda);
app.use("/upload", routerUpload);
app.use("/img", routerImagenes);




app.listen(3000, () => {
  console.log("iniciado");
});
