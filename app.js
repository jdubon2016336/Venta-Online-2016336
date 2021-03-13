'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const usuario_rutas = require('./src/rutas/usuario_rutas');
const producto_rutas = require('./src/rutas/producto_rutas');
const categoria_rutas = require('./src/rutas/categoria_rutas');
const factura_rutas = require('./src/rutas/factura_rutas');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/api', usuario_rutas, categoria_rutas, producto_rutas, factura_rutas);

module.exports = app