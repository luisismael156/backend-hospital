const express = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const app = express();
var SEED = require("../config/config").SEED;
app.post("/", (req, res, next) => {
  var body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuarioLogin) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuarioLogin) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - Email",
        errors: { message: "Email Invalido" }
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioLogin.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - Password",
        errors: { message: "Password Invalida" }
      });
    }
    usuarioLogin.password = ":v";
    var token = jwt.sign(
      {
        usuario: usuarioLogin
      },
      SEED,
      { expiresIn: 14400 }
    );
    res.status(200).json({
      ok: true,
      usuarioLogin,
      token: token
    });
  });
});

module.exports = app;
