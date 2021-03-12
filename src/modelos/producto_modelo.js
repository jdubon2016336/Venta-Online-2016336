'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombreProducto: String,
    IdCategoria:  { type: Schema.Types.ObjectId, ref: 'categorias' },
    precio: Number,
    cantidad: Number,
    vendido: Number
});

module.exports = mongoose.model('productos', ProductoSchema);

