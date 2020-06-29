const express = require("express");
const mongoose = require("mongoose");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");

const mDAutenticacion = require("../middlewares/autenticacion");

const app = express();

app.get("/", (req, res, next) => {
  var desde = Number(req.query.desde) || 0;

  Usuario.find({}, "nombre email img role")
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error Cargando usuario",
          errors: err
        });
      }
      Usuario.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          usuarios,
          total: conteo
        });
      });
    });
});

app.put("/:id", (req, res, next) => {
  var body = req.body;
  var id = req.params.id;
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al actualizar usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id " + id + "no existe",
        errors: { message: "No existe el usuario" }
      });
    }
    usuario.nombre = body.nombre;
    usuario.apellidos = body.apellidos;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al Actualizar usuario",
          errors: err
        });
      }
      usuarioGuardado.password = ":v";

      res.status(200).json({
        ok: true,
        usuarioGuardado
      });
    });
  });
});

app.post("/", mDAutenticacion.verificaToken, (req, res, next) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    apellidos: body.apellidos,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al Crear usuario",
        errors: err
      });
    }
    res.status(200).json({
      ok: true,
      usuarioGuardado,
      usuariotoken: req.usuario
    });
  });
});

app.delete("/:id", (req, res, next) => {
  var id = req.params.id;
  Usuario.findByIdAndRemove(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al actualizar usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id " + id + " no existe",
        errors: { message: "No existe el usuario" }
      });
    }

    res.status(200).json({
      ok: true,
      usuario
    });
  });
});

module.exports = app;
