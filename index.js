'use strict'

const mongoose = require("mongoose");
const Usuario = require('./src/modelos/usuario_modelo');
const Categoria = require('./src/modelos/categoria_modelo');
const bcrypt = require("bcrypt-nodejs");
const app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log('Esta conectado a la base de datos');

    var nombre = 'Admin';
    var username = 'Admin';
    var contraseña = '123456';
    var rol = 'ROL_ADMIN';
    var usuario = new Usuario();

    usuario.nombre = nombre;
    usuario.username = username;
    usuario.contraseña = contraseña;
    usuario.rol = rol;

    var nombreCategoria = 'default';
    var categoria = new Categoria();

    categoria.nombreCategoria = nombreCategoria;


    Usuario.find({username: usuario.username}).exec((err, usuarioEncontrado)=>{
        if(usuarioEncontrado && usuarioEncontrado.length >=1){
            console.log('Este usuario ya existe'); 
        }else{
            bcrypt.hash(usuario.contraseña, null, null, (err, contraseñaEncriptada)=>{
                usuario.contraseña = contraseñaEncriptada;
                
                usuario.save((err, usuarioGuardado)=>{
                    if(err)  console.log('Error en la solicitud de guardado');
                    
                    if (usuarioGuardado){
                          console.log({usuarioGuardado});
                    }else{
                          console.log('No se ha guardado el usuario');
                        }
                })
                }) 
        }
        
    })

    Categoria.find({nombreCategoria: categoria.nombreCategoria}).exec((err, CategoriaEncontrada)=>{
        if(CategoriaEncontrada && CategoriaEncontrada.length >=1){
            console.log('Esta categoria ya existe'); 
        }else{
            categoria.save((err, categoriaGuardada)=>{
                if(err)  console.log('Error en la solicitud de guardado');
                
                if (categoriaGuardada){
                      console.log({categoriaGuardada});
                }else{
                      console.log('No se ha guardado la categoria');
                    }
            })
        }
        
    })
    app.listen(3000,function(){
        console.log('La aplicacion esta corriendo en el puerto 3000');
    })     
}).catch(err => console.log(err))