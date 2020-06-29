const express = require("express");
const Hospital = require("../models/hospital");
const mDAutenticacion = require("../middlewares/autenticacion");

const app = express();


app.get("/", (req, res, next) => {
  var desde = Number(req.query.desde) || 0;

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error Cargando hospital",
        errors: err
      });
    }
    Hospital.count({}, (err, conteo) => {
      res.status(200).json({
        ok: true,
        hospitales,
        total:conteo
      });
    });
   
  });
});

app.put("/:id", mDAutenticacion.verificaToken,(req, res, next) => {
  var body = req.body;
  var id = req.params.id;
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al actualizar hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + "no existe",
        errors: { message: "No existe el hospital" }
      });
    }
    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al Actualizar hospital",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospitalGuardado
      });
    });
  });
});



app.post("/", mDAutenticacion.verificaToken , (req, res, next) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al Crear hospital",
        errors: err
      });
    }
    res.status(200).json({
      ok: true,
      hospitalGuardado,
    });
  });
});

app.delete("/:id", (req, res, next) => {
  var id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al actualizar hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + " no existe",
        errors: { message: "No existe el hospital" }
      });
    }

    res.status(200).json({
      ok: true,
      hospital
    });
  });
});

module.exports = app;
