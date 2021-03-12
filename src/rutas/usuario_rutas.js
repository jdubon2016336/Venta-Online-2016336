'use strict'

var express = require("express");
var usuarioControlador = require("../controladores/usuario_controlador");


var md_autorizacion = require("../middlewares/authenticated");


var api = express.Router();
api.post('/login', usuarioControlador.login);
api.post('/registrar', usuarioControlador.registrar);
api.put('/editarUsuario/:id',md_autorizacion.ensureAuth,usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:id',md_autorizacion.ensureAuth, usuarioControlador.eliminarUsuario);

module.exports = api;