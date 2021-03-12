'use strict'

var Categoria = require("../modelos/categoria.model");
var Factura = require("../modelos/factura.model");
var Producto = require("../modelos/producto.model");
var Usuario = require("../modelos/usuario.model");

var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function CrearFactura(req, res) {
    var facturaModel = new Factura();
    var params = req.body; 
 
    if(params.idUsuario){
        facturaModel.idUsuario = params.idUsuario;
        facturaModel.editable = "si";
        facturaModel.save((err, guardada)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion de la Encuesta' });
            if(!guardada) return res.status(500).send({ mensaje: 'Error al agregar la encuesta' });
 
            return res.status(200).send({ guardada })
        })
    }else{
        return res.status(500).send({mensaje: "Rellene todos los datos necesarios"})
    }
    
}

function CancelarFactura(req, res) {
    var params= req.body;

    Factura.findOne({_id: params.idFactura}).exec(
        (err, factura) => {
            if(err){
                console.log(err);
            }else{
                if (factura.editable == "no"){
                return res.status(500).send({ mensaje: "No se puede Eliminar/editar una factura terminada" });
            }else{
                Factura.findByIdAndDelete(params.idFactura,(err, Eliminado)=>{
                if(err) return res.status(500).send({mensaje:"Error en la peticion"});
                if(!Eliminado) return res.status(500).send({mensaje:"No se ha podido cancelar la factura, revise que este bien el iD"});
                    return res.status(200).send({mensaje: "Se ha cancelado la factura"});
                })
            }
            }
            
        }
    )
    
}

function FinalzarFactura(req, res) {

    var params = req.body; 
    var final = {};
    final['editable'] = "no";
    Factura.findByIdAndUpdate(params.idFactura, final, { new: true }, (err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el producto' });
        return res.status(200).send({ productoActualizado })
    })

    
}

function Multiplicacion(Producto, cantidad){

    return Producto.precio * cantidad

}

function restaStock(Producto, cantidad){  
    var productoTotal= Producto.cantidad - cantidad
    return productoTotal
}

function Carrito(req, res){
    var idFactura = req.params.id;
    var params = req.body;
    var idProducto = params.idProducto;

    Factura.findOne({_id: idFactura}).exec(
        (err, factura) => {
            if(err){
                console.log(err);
            }else{
                if (factura.editable == "no"){
                return res.status(500).send({ mensaje: "No se puede Eliminar/editar una factura terminada" });
            }else{
                var cantidad = params.cantidad;
                if(params.idProducto && params.cantidad){
                Producto.findById(idProducto).exec((err, Producto)=>{
                    if(err) return res.status(500).send({mensaje:"Error"})
                    var Subtotal = Multiplicacion(Producto,cantidad)
                    if(Subtotal === 0 ) return res.status(400).send({mensaje:"No se encontro el producto, o la cantidad es 0"})
                    Factura.findOne({_id:idFactura , "ProductoFactura.idProducto":idProducto, },{ProductoFactura:1}).exec((err, Facturas)=>{
                        if(err) return res.status(500).send({mensaje:"error al obtener facturas"})
                        if(Facturas != null){
                        if(Facturas.ProductoFactura.length > 0){
                            let i
                            let suma = cantidad
                            for(i=0; Facturas.ProductoFactura.length > i; i++){
                            const item =Facturas.ProductoFactura[i]
                            if(item.idProducto == idProducto){
                            suma = Number(item.cantidad) + Number(suma)
                            }
                            }
                            var restasStock =  restaStock(Producto, suma)
                            if(restasStock < 0 ) return res.status(400).send({mensaje:"No hay suficientes Productos en Stock"})

                        }
                    }
                    var restasStock =  restaStock(Producto, cantidad)
                    if(restasStock < 0 ) return res.status(400).send({mensaje:"No hay suficientes Productos en Stock2"})
                    Factura.findByIdAndUpdate(idFactura ,{$push:{ProductoFactura:{idProducto:idProducto, cantidad:cantidad, SubTotal:Subtotal}}},{new: true}, 
                        (err, En_Carrito)=>{
                            Factura.populate(En_Carrito, {path: "ProductoFactura.idProducto"},(err, Carrito)=>{
                            if(err) return res.status(500).send({mensaje:"Error al ingresar Producto"})
                            if(!Carrito) return res.status(500).send({mensaje:"La factura no existe"})
                            return res.status(200).send({Carrito})
                            })
                        })

                    })

                })
            }else{
                return res.status(200).send({mensaje:"No se enviaron los parametros correspondientes "})
            }
            }
            }
            
        }
    )

    

}

module.exports = {
    CrearFactura,
    CancelarFactura,
    FinalzarFactura,
    Carrito
}