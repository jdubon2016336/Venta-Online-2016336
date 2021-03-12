'use strict'

const Categoria = require("../modelos/categoria_modelo");
const jwt = require("../servicios/jwt");

function agregarCategoria(req,res){
    if (req.user.rol === "ROL_ADMIN"){
        var categoria = new Categoria();
    var params = req.body;

    if(params.nombre){
        categoria.nombre = params.nombre;

        Categoria.find({nombre:categoria.nombre}).exec((err, catergoriaEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la solicitud categoria'});

            if(catergoriaEncontrada && catergoriaEncontrada.length >=1){
                return res.status(200).send({mensaje:'Esta categoria ya existe'});
            }else{
                categoria.save((err, categoriaGuardada)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al guardar'});

                    if (categoriaGuardada){
                       return res.status(200).send(categoriaGuardada);
                    }else{
                       return res.status(404).send({ mensaje: 'No se ha podido registrar la categoria'});
                    }
                })
            }
        })
    }
    }else{
        return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'});
    }
    
}

function editarCategoria(req, res) {
    if (req.user.rol === "ROL_ADMIN"){
    var idCategoria = req.params.id;
    var params = req.body;


    Categoria.findByIdAndUpdate(idCategoria, params, { new: true }, (err, categoariaActualizada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categoariaActualizada) return res.status(500).send({ mensaje: 'No se a podido editar la Categoria' });

        return res.status(200).send({ categoariaActualizada })
    })
    }else{

        return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'});
    }

  
}

function eliminarCategoria(req, res) {
    var params = req.body; 
    var categoria = params.categoria;
    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({mensaje: "Un cliente no puede eliminar una categoria"});
    }

    if(categoria == "default"){
        return res.status(500).send({mensaje: "No se puede borrar esta categoria"});
    }

    Producto.updateMany({IdCategoria: categoria}, params, { new: true }, (err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el producto' });
    })
}

function listarCategorias(req, res){
    Categoria.find().exec((err, categorias)=>{
        if(err) return res.status(500).send({ mensaje:"Error al realizar la solicitud de obtener categorias" });
        if(!categorias) return res.status(500).send({ mensaje:"No se encontraron categorias" });

        return res.status(200).send({ categorias });
    })
}

module.exports = {
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    listarCategorias
}