const express = require("express");
const mongoose = require("mongoose");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");
const Usuario = require("../models/usuario");

const app = express();

app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var tabla = req.params.tabla;
  var regex = new RegExp(busqueda, "i");

  var promesa;
  switch (tabla) {
    case "usuarios":
      promesa = buscarUsuario(busqueda, regex);
      break;
    case "medicos":
      promesa = buscarMedico(busqueda, regex);
      break;
    case "hospitales":
      promesa = buscarHospital(busqueda, regex);
      break;

    default:
      return res.status(400).json({
        ok: false,
        mensaje:
          "Los tipos de busqueda solos son usuario, medicos y hospitales",
        error: { message: "Tipo de tabla /coleccion no valido" }
      });
      break;
  }

  promesa.then(data=>{
    res.status(400).json({
      ok: true,
      [tabla]:data
      
    
    });

  })
});

app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospital(busqueda, regex),
    buscarMedico(busqueda, regex),
    buscarUsuario(busqueda, regex)
  ]).then(respuesta => {
    console.log(respuesta[0]);
    res.status(200).json({
      ok: true,
      hospitales: respuesta[0],
      medicos: respuesta[1],
      usuarios: respuesta[2]
    });
  });
});

function buscarHospital(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .exec((err, hospitales) => {
        if (err) {
          reject(err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedico(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .populate("hospital")
      .exec((err, medicos) => {
        if (err) {
          reject(err);
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuario(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, "nombre apellidos email")
      .or([{ nombre: regex }, { email: regex }])
      .exec({ nombre: regex }, (err, usuarios) => {
        if (err) {
          reject(err);
        } else {
          resolve(usuarios);
        }
      });
  });
}
module.exports = app;
