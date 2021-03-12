'use strict'

const bcrypt = require("bcrypt-nodejs");
const Usuario = require("../modelos/usuario_modelo");
const jwt = require("../servicios/jwt");

function login(req, res) {
    var params = req.body; 

    Usuario.findOne({username: params.username}, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición"});
        if(usuarioEncontrado){
            bcrypt.compare(params.contraseña, usuarioEncontrado.contraseña, (err, contraVerificada)=>{
                if(err) return res.status(500).send({mensaje: "Error en la petición"});
                if(contraVerificada){
                     if(params.getToken == "true"){
                        return res.status(200).send({
                        token: jwt.createToken(usuarioEncontrado)});
                     }else{
                        usuarioEncontrado.contraseña = undefined;
                        return res.status(200).send({usuarioEncontrado});
                     }
                }else{
                    return res.status(500).send({mensaje:"El Usuario no se a podido identificar"});
                }
            })
        }else{
            return res.status(500).send({mensaje:"Error al buscar el Usuario"})
        }
    })
}

function registrar(req,res){
    var usuario = new Usuario();
    var params = req.body;
    
    if(params.username && params.contraseña){
        usuario.nombre = params.nombre;
        usuario.username = params.username
        usuario.contraseña = params.contraseña;
        usuario.rol = "ROL_CLIENTE";

        Usuario.find({nombre:usuario.nombre}).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la solicitud de usuarios'});

            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                return res.status(200).send({mensaje:'Este usuario ya existe'});
            }else{
                bcrypt.hash(params.contraseña, null, null, (err, contraEncriptada)=>{
                    usuario.contraseña = contraEncriptada;

                    usuario.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error al guardar'});

                        if (usuarioGuardado){
                           return res.status(200).send(usuarioGuardado);
                        }else{
                           return res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario'});
                        }
                    })
                })
            }
        })
    }
    
    
}

function editarUsuario(req, res) {
 var idAdmin = req.params.id;

    if(req.user.sub != idAdmin){
        if (req.user.rol === "ROL_ADMIN"){
            var idUsuario = req.params.id;
            var params = req.body;
            
            delete params.contraseña;
            if(idUsuario.rol === "ROL_CLIENTE"){
                Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el Usuario' });
            
                    return res.status(200).send({ usuarioActualizado })
                })
            
            }else{
                return res.status(500).send({mensaje:"no puede editar a otro administrador"})
            }
        }else{
            var idUsuario = req.params.id;
            var params = req.body;
        
            delete params.contraseña;
        
            if (idUsuario != req.user.sub) {
                return res.status(500).send({ mensaje: 'No posee los permisos para editar ese usuario' });
            }
            
            Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });
        
                return res.status(200).send({ usuarioActualizado })
            })
        }
    }else{
        return res.status(200).send({ mensaje: "No puede editar un administrador" })
    }

  
}

function eliminarUsuario(req, res){
    var idAdmin = req.params.id;
    
    if(req.user.sub != idAdmin){
        if (req.user.rol === "ROL_ADMIN"){
            var idUsuario = req.params.id;

            if(idUsuario.rol === "ROL_CLIENTE"){
                Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(500).send({ mensaje: 'No se a podido eliominar el Usuario' });
            
                    return res.status(200).send({ mensaje:"usario Eliminado" })
                })
            
            }else{
                return res.status(500).send({mensaje:"no puede eliminar a otro administrador"})
            }
        }else{
            var idUsuario = req.params.id;
        
        
            if (idUsuario != req.user.sub) {
                return res.status(500).send({ mensaje: 'No posee los permisos para eliminar ese usuario' });
            }
            
            Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!usuarioEliminado) return res.status(500).send({ mensaje: 'No se a podido eliminar al Usuario' });
        
                return res.status(200).send({ mensaje:"usuario eliminado" })
            })
        }
    }else{
        return res.status(200).send({ mensaje: "No puede eliminar un administrador" })
    }
}



module.exports = {
    login,
    registrar,
    editarUsuario,
    eliminarUsuario
}