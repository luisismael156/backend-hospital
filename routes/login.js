const express = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const app = express();
var SEED = require("../config/config").SEED;

//Google
var CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });

  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

app.post("/google", async (req, res) => {
  var token = req.body.token;

  var googleUser = await verify(token).catch(e => {
    return res.status(403).json({
      ok: false,
      mensaje: "token invalido"
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (usuarioDB) {
      if (usuarioDB.google == false) {
        return res.status(500).json({
          ok: false,
          mensaje: "Debe usar su autencicacion normal",
          errors: err
        });
      } else {
        var token = jwt.sign(
          {
            usuario: usuarioDB
          },
          SEED,
          { expiresIn: 14400 } // 4 horas
        );
        res.status(200).json({
          ok: true,
          token: token,
          usuario: usuarioDB,
          id: usuarioDB._id
        });
      }
    } else {
      var usuario = new Usuario({
        nombre: googleUser.nombre,
        email: googleUser.email,
        img: googleUser.img,
        password: ":)",
        google: true
      });
      usuario.save((err, usuarioGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al Crear usuario",
            errors: err
          });
        }
        var token = jwt.sign(
          {
            usuario: usuarioGuardado
          },
          SEED,
          { expiresIn: 14400 } // 4 horas
        );

        res.status(200).json({
          ok: true,
          usuario:usuarioGuardado,
          token: token,
          id:usuarioGuardado._id
        });
      });
    }
  });
});

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
      usuario:usuarioLogin,
      token: token,
      id:usuarioLogin._id,
    });
  });
});

module.exports = app;
