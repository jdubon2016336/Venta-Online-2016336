'use strict'

var express = require("express");
var productoControlador = require("../controladores/producto_controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();
api.post('/agregarProducto', md_autorizacion.ensureAuth, productoControlador.agregarProducto);
api.put('/editarProducto', md_autorizacion.ensureAuth, productoControlador.editarProducto);
api.delete('/eliminarProducto', md_autorizacion.ensureAuth, productoControlador.eliminarProducto);
api.get('/listarProductos', productoControlador.listarProductos);
api.get('/listarProductosCat', productoControlador.listarProductosCat);
api.get('/listarProductoNom', productoControlador.listarProductosNom);

module.exports = api;