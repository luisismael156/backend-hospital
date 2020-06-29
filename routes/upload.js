const express = require("express");
const fileUpload = require("express-fileupload");
var fs = require("fs");

const app = express();
const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");
const usuario = require("../models/usuario");

app.use(fileUpload());

app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  var tiposValidos = ["hospitales", "medicos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(500).json({
      ok: false,
      mensaje: "Tipo de coleccion no es valida",
      errors: { message: "Tipo de coleccion no es valida" }
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(500).json({
      ok: false,
      mensaje: "No seleccion nada",
      errors: { message: "Debe de seleccionar una imagen" }
    });
  }

  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(500).json({
      ok: false,
      mensaje: "Extension no valida",
      errors: { message: "Las extensiones validas son jpg,png,fig,jpeg" }
    });
  }

  //Nombre de archivo personalizado
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, function (err) {
    if (err) {
      return res.status(500).json({
        ok: true,
        mensaje: "Error mover archivos",
        err: err
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo == "usuarios") {
    Usuario.findById(id, (err, usuario) => {
      var pathViejo = "./uploads/usuarios/" + usuario.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, () => {});
      }

      usuario.img = nombreArchivo;

      usuario.save((err, usuarioActualizados) => {
        return res.status(500).json({
          ok: true,
          mensaje: "Imagen de usuario actualizado",
          usuario: usuarioActualizados
        });
      });
    });
  }
  if (tipo == "medicos") {
    Medico.findById(id, (err, medico) => {
      var pathViejo = "./uploads/medicos/" + medico.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, () => {});
      }

      medico.img = nombreArchivo;

      medico.save((err, medicoActualizados) => {
        return res.status(500).json({
          ok: true,
          mensaje: "Imagen de medico actualizado",
          medico: medicoActualizados
        });
      });
    });
  }
  if (tipo == "hospitales") {
    Hospital.findById(id, (err, hospital) => {
      var pathViejo = "./uploads/hospitales/" + hospital.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, () => {});
      }

      hospital.img = nombreArchivo;

      hospital.save((err, hospitalActualizados) => {
        return res.status(500).json({
          ok: true,
          mensaje: "Imagen de hospital actualizado",
          hospital: hospitalActualizados
        });
      });
    });
  }
}

module.exports = app;
