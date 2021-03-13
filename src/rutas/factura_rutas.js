'use strict'
var express = require("express");
var facturaControlador = require("../controladores/factura_controlador");
var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post("/crearFactura", facturaControlador.crearFactura);
api.delete("/cancelarFactura/:id", facturaControlador.cancelarFactura);
api.put('/finalizarFactura/:id', facturaControlador.finalizarFactura);
api.put('/carrito/:id', facturaControlador.carrito);
module.exports = api;