'use strict'

const Producto = require("../modelos/producto_modelo");
const { param } = require("../rutas/usuario_rutas");
const jwt = require("../servicios/jwt");

function agregarProducto(req,res){
    if (req.user.rol === "ROL_ADMIN"){
        var producto = new Producto();
    var params = req.body;

    if(params.nombreProducto && params.IdCategoria && params.precio && params.cantidad){
        producto.nombreProducto = params.nombreProducto;
        producto.IdCategoria = {};
        producto.precio = params.precio;
        producto.cantidad = params.cantidad;

        Producto.find({nombreProducto:producto.nombreProducto}).exec((err, productoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la solicitud producto'});

            if(productoEncontrado && productoEncontrado.length >=1){
                return res.status(200).send({mensaje:'Este producto ya existe'});
            }else{
                producto.save((err, productoGuardado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al guardar'});

                    if (productoGuardado){
                       return res.status(200).send(productoGuardado);
                    }else{
                       return res.status(404).send({ mensaje: 'No se ha podido registrar el producto'});
                    }
                })
            }
        })
    }
    }else{
        return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'});
    }
    
}

function editarProducto(req, res) {
    if (req.user.rol === "ROL_ADMIN"){
    var idProducto = req.params.id;
    var params = req.body;


    Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el producto' });

        return res.status(200).send({ productoActualizado })
    })
    }else{

        return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'});
    }

  
}

function eliminarProducto(req, res){
    if (req.user.rol === "ROL_ADMIN"){
    var idProducto = req.params.id;

    Producto.findByIdAndDelete(idProducto, (err, productoEliminado) =>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!productoEliminado) return res.status(500).send({mensaje:"No se ha eliminado el producto"});

        return res.status(200).send({mensaje: "producto eliminado"});
    })
    }
    return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'});
}

function listarProductos(req, res){
    Productos.find().exec((err, productos)=>{
        if(err) return res.status(500).send({ mensaje:"Error al realizar la solicitud de obtener productos" });
        if(!productos) return res.status(500).send({ mensaje:"No se encontraron productos" });

        return res.status(200).send({ productos });
    })
}

function listarProductosCat(req, res) {
    var idCategoria = req.params.id;

    Producto.find({"IdCateroria": idCategoria },(err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de productos'});
        if(!productosEncontrados) return res.status(500).send({mensaje: 'Error al obtener lso productos' });

        return res.status(200).send({ productosEncontrados });
    })

}


module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProducto,
    listarProductos,
    listarProductosCat
}