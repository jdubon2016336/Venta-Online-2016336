'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    idUsuarios: { type: Schema.Types.ObjectId, ref: 'usuarios' },
    editable: 'si',
        ProducosFactura:[{
            IdProducto: { type: Schema.Types.ObjectId, ref: 'productos' },
            cantidad: Number,
            precio: Number,
            subTotal: Number
        }],
total: Number

});

module.exports = mongoose.model('facturas', FacturaSchema);

